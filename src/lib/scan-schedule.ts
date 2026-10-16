import { tz } from "@date-fns/tz";
import { addDays, getDay, set } from "date-fns";

// Mirrors the existing Claude Cowork tasks; this does not configure their triggers.
export const SCAN_TIME_ZONE = "Asia/Taipei";
export const SCAN_HOUR = 2;
export const SCAN_MINUTE = 0;
export const SCAN_SCHEDULE = [
  { stream: "cultural", weekday: 1, label: "週一" },
  { stream: "outdoor", weekday: 2, label: "週二" },
] as const;

export const SCAN_TIME_LABEL = `${String(SCAN_HOUR).padStart(2, "0")}:${String(SCAN_MINUTE).padStart(2, "0")}`;
export const SCAN_DAYS_LABEL = SCAN_SCHEDULE.map(({ label }) => label).join("、");

/** Next scheduled scan start, strictly after now; publication follows the scan. */
export function nextScanStart(now: Date = new Date()): Date {
  const context = { in: tz(SCAN_TIME_ZONE) };
  const todayAtScanTime = set(
    now,
    { hours: SCAN_HOUR, minutes: SCAN_MINUTE, seconds: 0, milliseconds: 0 },
    context,
  );
  const today = getDay(now, context);
  const candidates = SCAN_SCHEDULE.map(({ weekday }) => {
    let candidate = addDays(todayAtScanTime, (weekday - today + 7) % 7, context);
    if (candidate.getTime() <= now.getTime()) {
      candidate = addDays(candidate, 7, context);
    }
    return candidate;
  });
  return new Date(Math.min(...candidates.map((date) => date.getTime())));
}
