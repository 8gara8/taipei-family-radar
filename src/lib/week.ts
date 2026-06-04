// ISO 週次 (YYYY-Www) 工具與「本週」判定。
import {
  endOfISOWeek,
  getISOWeek,
  getISOWeekYear,
  parseISO,
  setISOWeek,
  setISOWeekYear,
  startOfISOWeek,
} from "date-fns";

/** Date → "2026-W23"（ISO-8601 週次）。 */
export function toISOWeek(date: Date): string {
  const year = getISOWeekYear(date);
  const week = getISOWeek(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** 今天的 ISO 週次。 */
export function currentISOWeek(now: Date = new Date()): string {
  return toISOWeek(now);
}

/** "2026-W23" → 該週的起訖日（週一至週日）。 */
export function weekRange(week: string): { start: Date; end: Date } {
  const match = week.match(/^(\d{4})-W(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid ISO week string: ${week}`);
  }
  const year = Number(match[1]);
  const weekNo = Number(match[2]);
  let d = setISOWeekYear(new Date(), year);
  d = setISOWeek(d, weekNo);
  return { start: startOfISOWeek(d), end: endOfISOWeek(d) };
}

/** 某日（ISO date 或 Date）是否落在「本週」。 */
export function isThisWeek(date: string | Date, now: Date = new Date()): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return toISOWeek(d) === toISOWeek(now);
}
