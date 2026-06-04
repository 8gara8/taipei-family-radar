import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

/** 合併 Tailwind class，後者覆蓋前者衝突的 utility。 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** "2026-06-14" → "6月14日（週六）" */
export function formatDate(iso: string): string {
  const d = parseISO(iso);
  return `${format(d, "M月d日", { locale: zhTW })}（${format(d, "EEE", {
    locale: zhTW,
  })}）`;
}

/** 起訖日格式化；同日只顯示一個。 */
export function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate || endDate === startDate) return formatDate(startDate);
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return `${format(start, "M月d日", { locale: zhTW })} – ${formatDate(endDate)}`;
}

/** "2026年6月4日" — 用於「最後更新」等。 */
export function formatFullDate(iso: string): string {
  return format(parseISO(iso), "yyyy年M月d日", { locale: zhTW });
}

/** 距今天的天數（向下取整、以日曆日計）。 */
export function daysSince(iso: string, now: Date = new Date()): number {
  return differenceInCalendarDays(now, parseISO(iso));
}
