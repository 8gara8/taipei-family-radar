// 讀取 repo 內 data/*.json、計算衍生欄位（status、過期過濾）、提供查詢 helper。
// 純讀取，build 時靜態載入；無 DB、無 runtime fetch。
import { tz } from "@date-fns/tz";
import { differenceInCalendarDays, parseISO } from "date-fns";
import eventsJson from "../../data/events.json";
import sourcesJson from "../../data/sources.json";
import digestsJson from "../../data/digests.json";
import type { Event, EventStatus, Source, WeeklyDigest } from "./types";
import { currentISOWeek, toISOWeek } from "./week";

const RAW_EVENTS = eventsJson as unknown as Event[];
const SOURCES = sourcesJson as unknown as Source[];
const DIGESTS = digestsJson as unknown as WeeklyDigest[];

// 渲染端保險：逾期超過此天數的活動不顯示（保留月曆回顧 4 週）。
const STALE_AFTER_DAYS = 28;

// 以台北時區的日曆日判定 upcoming/past 與過期界線（站點為台灣面向、伺服器為 UTC）。
const TAIPEI = "Asia/Taipei";

const NOW = new Date();

/** 活動的「實際結束日」：endDate 若無則用 startDate。 */
function effectiveEnd(event: Event): string {
  return event.endDate ?? event.startDate;
}

/** (endDate ?? startDate) 距今天的台北日曆日數（負值＝未來、0＝今天、正值＝已過）。 */
function daysPast(event: Event, now: Date = NOW): number {
  return differenceInCalendarDays(now, parseISO(effectiveEnd(event)), {
    in: tz(TAIPEI),
  });
}

/** 依今日與 (endDate ?? startDate) 計算 status。 */
function computeStatus(event: Event, now: Date = NOW): EventStatus {
  return daysPast(event, now) <= 0 ? "upcoming" : "past";
}

function byStartDateAsc(a: Event, b: Event): number {
  if (a.startDate !== b.startDate) return a.startDate < b.startDate ? -1 : 1;
  // 同日：用 startTime 再排，無則維持穩定。
  return (a.startTime ?? "").localeCompare(b.startTime ?? "");
}

/**
 * 正規化後的活動清單：補上 status、排除逾 28 天的活動、依日期升冪排序。
 * （正式的去重/寫回由 scripts/normalize-data.ts 負責；此處僅做渲染端處理。）
 */
export function getAllEvents(): Event[] {
  return RAW_EVENTS.map((event) => ({ ...event, status: computeStatus(event) }))
    .filter((event) => daysPast(event) <= STALE_AFTER_DAYS)
    .sort(byStartDateAsc);
}

/** 即將到來（含今天與未來）的活動。 */
export function getUpcomingEvents(): Event[] {
  return getAllEvents().filter((event) => event.status === "upcoming");
}

/** 本週（依 weekFound）新研究到的活動。 */
export function getEventsFoundThisWeek(now: Date = NOW): Event[] {
  const week = currentISOWeek(now);
  return getAllEvents().filter((event) => event.weekFound === week);
}

export function getEventById(id: string): Event | undefined {
  return getAllEvents().find((event) => event.id === id);
}

export function getSources(): Source[] {
  return SOURCES;
}

export function getDigests(): WeeklyDigest[] {
  // 依週次降冪，最新一筆在前。
  return [...DIGESTS].sort((a, b) => (a.weekOf < b.weekOf ? 1 : -1));
}

/** 最新一筆每週摘要（對應「本週精選」頁首）。 */
export function getLatestDigest(): WeeklyDigest | undefined {
  return getDigests()[0];
}

/** 依 highlightEventIds 取出本週首推活動（保留指定順序、濾掉已過期/不存在者）。 */
export function getDigestHighlights(digest?: WeeklyDigest): Event[] {
  if (!digest) return [];
  return digest.highlightEventIds
    .map((id) => getEventById(id))
    .filter(
      (event): event is Event =>
        Boolean(event) && event!.status === "upcoming",
    );
}

/**
 * 「最後更新」時間：取所有來源 lastScannedAt 的最大值，
 * 退而求其次用活動 discoveredAt 的最大值。回傳 ISO 字串或 undefined。
 */
export function getLastUpdated(): string | undefined {
  const candidates: string[] = [
    ...SOURCES.map((s) => s.lastScannedAt).filter(
      (v): v is string => Boolean(v),
    ),
    ...RAW_EVENTS.map((e) => e.discoveredAt),
  ];
  if (candidates.length === 0) return undefined;
  // 比較解析後的瞬間，而非字串：來源時間戳可能混用不同 UTC 偏移。
  const instant = (s: string): number => {
    const n = Date.parse(s);
    return Number.isNaN(n) ? -Infinity : n;
  };
  return candidates.reduce((max, cur) => (instant(cur) > instant(max) ? cur : max));
}

export { toISOWeek };
