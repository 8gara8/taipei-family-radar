// zod schemas for build-time validation of data/*.json.
// 與 src/lib/types.ts 對應；由 scripts/normalize-data.ts（prebuild）使用。
import { z } from "zod";

export const streamSchema = z.enum(["cultural", "outdoor"]);

export const categorySchema = z.enum([
  "music",
  "dance",
  "performance",
  "competition",
  "film",
  "workshop",
  "market",
  "festival",
  "exhibition",
  "other",
]);

export const ageFitSchema = z.enum(["great", "ok", "older"]);

export const eventStatusSchema = z.enum(["upcoming", "past"]);

/**
 * 確認字串為真實存在的日曆日。
 * Date.parse 會把 2026-02-31 這類不可能的日期正規化成 3 月而非回傳 NaN，
 * 因此改以 year/month/day 來回比對，攔掉代理人寫入的錯誤日期。
 */
function isRealCalendarDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日期須為 YYYY-MM-DD")
  .refine(isRealCalendarDate, "須為合法日曆日期（如 2026-02-31 不存在）");

export const eventSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    titleOriginal: z.string().min(1).nullish(),
    stream: streamSchema,
    category: categorySchema,
    organizer: z.string().min(1).nullish(),
    venue: z.string().min(1),
    address: z.string().min(1).nullish(),
    area: z.string().min(1).nullish(),
    lat: z.number().nullish(),
    lng: z.number().nullish(),
    startDate: isoDate,
    endDate: isoDate.nullish(),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "時間須為 HH:mm")
      .nullish(),
    isFree: z.boolean(),
    priceNote: z.string().min(1).nullish(),
    ageFit: ageFitSchema,
    ageFitReason: z.string().min(1),
    summary: z.string().min(1),
    sourceName: z.string().min(1),
    sourceUrl: z.string().url(),
    registrationUrl: z.string().url().nullish(),
    imageUrl: z.string().url().nullish(),
    tags: z.array(z.string().min(1)).nullish(),
    // status 由 normalize 依日期計算，輸入可留空
    status: eventStatusSchema.optional(),
    discoveredAt: z.string().min(1),
    weekFound: z.string().regex(/^\d{4}-W\d{2}$/, "週次須為 YYYY-Www"),
  })
  .refine((e) => !e.endDate || e.endDate >= e.startDate, {
    message: "endDate 不可早於 startDate",
    path: ["endDate"],
  });

export const sourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["gov-calendar", "cultural-institute", "aggregator", "venue"]),
  stream: z.enum(["cultural", "outdoor", "both"]),
  url: z.string().url(),
  lastScannedAt: z.string().min(1).nullish(),
  lastStatus: z.enum(["ok", "partial", "failed"]).nullish(),
});

export const weeklyDigestSchema = z.object({
  weekOf: z.string().regex(/^\d{4}-W\d{2}$/, "週次須為 YYYY-Www"),
  intro: z.string().min(1),
  highlightEventIds: z.array(z.string().min(1)),
});

export const eventsSchema = z.array(eventSchema);
export const sourcesSchema = z.array(sourceSchema);
export const digestsSchema = z.array(weeklyDigestSchema);

export type EventInput = z.infer<typeof eventSchema>;
export type SourceInput = z.infer<typeof sourceSchema>;
export type WeeklyDigestInput = z.infer<typeof weeklyDigestSchema>;
