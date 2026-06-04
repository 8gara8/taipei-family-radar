/**
 * prebuild 資料正規化（見 SPEC §7）。
 *
 *   1. 用 zod 驗證 data/events.json 每筆 Event；不合法 → 印出 id 與錯誤並讓 build 失敗。
 *   2. 依今日（台北時區）與 (endDate ?? startDate) 計算 status。
 *   3. 去重（id 重複 → 保留 discoveredAt 較早者，合併較新欄位）。
 *   4. 依 startDate（同日再依 startTime）升冪排序。
 *   5. 以穩定的欄位順序、2-space 縮排寫回 data/events.json。
 *
 * 另外驗證 data/sources.json 與 data/digests.json（不改寫），確保 `pnpm validate` 能
 * 在 build 前攔下髒資料。注意：逾期資料的「刪除」由每週代理人負責，這裡不刪。
 *
 * 用法：pnpm tsx scripts/normalize-data.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tz } from "@date-fns/tz";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { ZodError } from "zod";
import {
  digestsSchema,
  eventSchema,
  sourcesSchema,
  type EventInput,
} from "../src/lib/schema";

const TAIPEI = "Asia/Taipei";
const DATA_DIR = join(process.cwd(), "data");

// 輸出時的欄位順序（對應 src/lib/types.ts 的 Event），讓 diff 穩定。
const EVENT_KEY_ORDER: (keyof EventInput)[] = [
  "id",
  "title",
  "titleOriginal",
  "stream",
  "category",
  "organizer",
  "venue",
  "address",
  "area",
  "lat",
  "lng",
  "startDate",
  "endDate",
  "startTime",
  "isFree",
  "priceNote",
  "ageFit",
  "ageFitReason",
  "summary",
  "sourceName",
  "sourceUrl",
  "registrationUrl",
  "imageUrl",
  "tags",
  "status",
  "discoveredAt",
  "weekFound",
];

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
}

function fail(message: string): never {
  console.error(`\n❌ normalize-data：${message}\n`);
  process.exit(1);
}

/** 依今日（台北時區）與 (endDate ?? startDate) 計算 status。 */
function computeStatus(event: EventInput, now: Date): "upcoming" | "past" {
  const end = event.endDate ?? event.startDate;
  const daysPast = differenceInCalendarDays(now, parseISO(end), {
    in: tz(TAIPEI),
  });
  return daysPast <= 0 ? "upcoming" : "past";
}

function instant(iso: string): number {
  const n = Date.parse(iso);
  return Number.isNaN(n) ? Infinity : n;
}

/** 同 id 群組合併：保留最早 discoveredAt，欄位以較新（discoveredAt 較晚）者為準。 */
function mergeGroup(group: EventInput[]): EventInput {
  const byDiscoveredAsc = [...group].sort(
    (a, b) => instant(a.discoveredAt) - instant(b.discoveredAt),
  );
  const earliest = byDiscoveredAsc[0].discoveredAt;
  const merged = byDiscoveredAsc.reduce((acc, cur) => ({ ...acc, ...cur }));
  return { ...merged, discoveredAt: earliest };
}

/** 依固定欄位順序輸出物件，省略未提供（undefined）的欄位。 */
function canonicalize(event: EventInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of EVENT_KEY_ORDER) {
    const value = event[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function byStartDateAsc(a: EventInput, b: EventInput): number {
  if (a.startDate !== b.startDate) return a.startDate < b.startDate ? -1 : 1;
  return (a.startTime ?? "").localeCompare(b.startTime ?? "");
}

function validateOrThrow<T>(
  label: string,
  schema: { parse: (x: unknown) => T },
  data: unknown,
): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const lines = err.issues
        .map((i) => `  · ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      fail(`${label} 驗證失敗：\n${lines}`);
    }
    throw err;
  }
}

function main() {
  const now = new Date();

  // --- events.json：逐筆驗證 → 去重 → 計算 status → 排序 → 寫回 ---
  const rawEvents = readJson("events.json");
  if (!Array.isArray(rawEvents)) fail("events.json 必須是陣列。");

  const parsed: EventInput[] = (rawEvents as unknown[]).map((raw, index) => {
    const result = eventSchema.safeParse(raw);
    if (!result.success) {
      const id =
        raw && typeof raw === "object" && "id" in raw
          ? String((raw as { id: unknown }).id)
          : `#${index}`;
      const lines = result.error.issues
        .map((i) => `  · ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      fail(`events.json 第 ${index} 筆（id=${id}）驗證失敗：\n${lines}`);
    }
    return result.data;
  });

  // 去重（保留最早 discoveredAt、合併較新欄位）。
  const groups = new Map<string, EventInput[]>();
  for (const event of parsed) {
    const list = groups.get(event.id);
    if (list) list.push(event);
    else groups.set(event.id, [event]);
  }

  const deduped = [...groups.values()].map((group) =>
    group.length === 1 ? group[0] : mergeGroup(group),
  );
  const dupCount = parsed.length - deduped.length;

  const normalized = deduped
    .map((event) => ({ ...event, status: computeStatus(event, now) }))
    .sort(byStartDateAsc)
    .map(canonicalize);

  writeFileSync(
    join(DATA_DIR, "events.json"),
    JSON.stringify(normalized, null, 2) + "\n",
    "utf8",
  );

  // --- sources.json / digests.json：僅驗證，不改寫 ---
  const sources = validateOrThrow("sources.json", sourcesSchema, readJson("sources.json"));
  const digests = validateOrThrow("digests.json", digestsSchema, readJson("digests.json"));

  console.log(
    `✅ normalize-data：events ${normalized.length} 筆` +
      (dupCount > 0 ? `（合併 ${dupCount} 筆重複）` : "") +
      `、sources ${sources.length} 筆、digests ${digests.length} 筆，資料正規化完成。`,
  );
}

main();
