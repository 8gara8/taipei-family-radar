import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { tz } from "@date-fns/tz";
import {
  differenceInCalendarDays,
  format,
  nextWednesday,
  parseISO,
} from "date-fns";
import { zhTW } from "date-fns/locale";

// 站點與來源時間皆以台灣為準；在 UTC 伺服器（Vercel）上仍以台北時區呈現，
// 避免凌晨時間戳被顯示成前一天。
const TAIPEI = "Asia/Taipei";
const inTaipei = { in: tz(TAIPEI), locale: zhTW } as const;

/** 合併 Tailwind class，後者覆蓋前者衝突的 utility。 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** "2026-06-14" → "6月14日（週六）"（台北時區）。 */
export function formatDate(iso: string): string {
  const d = parseISO(iso);
  return `${format(d, "M月d日", inTaipei)}（${format(d, "EEE", inTaipei)}）`;
}

/** 起訖日格式化；同日只顯示一個。 */
export function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate || endDate === startDate) return formatDate(startDate);
  const start = parseISO(startDate);
  return `${format(start, "M月d日", inTaipei)} – ${formatDate(endDate)}`;
}

/** "2026年6月4日"（台北時區）— 用於「最後更新」等。 */
export function formatFullDate(iso: string): string {
  return format(parseISO(iso), "yyyy年M月d日", inTaipei);
}

/** 今天的 "yyyy-MM-dd"（台北時區）。供月曆等以確定值渲染、避免水合不一致。 */
export function todayISO(now: Date = new Date()): string {
  return format(now, "yyyy-MM-dd", { in: tz(TAIPEI) });
}

/** 距今天的天數（以台北時區的日曆日計）。 */
export function daysSince(iso: string, now: Date = new Date()): number {
  return differenceInCalendarDays(now, parseISO(iso), { in: tz(TAIPEI) });
}

/**
 * 下次內容更新日（代理人每週三掃描）。
 * 若今天就是週三，視為「下週三」，給空狀態一個明確的回訪日期。
 * 以台北時區判定星期：UTC 伺服器在「台北已週三、UTC 仍週二」的時段，
 * 才不會把今天誤算成下次更新日。
 */
export function formatNextUpdate(now: Date = new Date()): string {
  return format(nextWednesday(now, { in: tz(TAIPEI) }), "yyyy年M月d日", inTaipei);
}
