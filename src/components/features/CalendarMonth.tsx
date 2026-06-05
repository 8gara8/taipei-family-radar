"use client";

import { useMemo, useState } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event, Stream } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StreamDot } from "@/components/ui/StreamDot";
import { DayDrawer } from "./DayDrawer";

interface CalendarMonthProps {
  events: Event[];
  initialMonth?: string; // "2026-06"
  /** 今天 "yyyy-MM-dd"（由 server 以台北時區算好，避免水合不一致）。 */
  todayISO?: string;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

const STREAM_DOT: Record<Stream, string> = {
  cultural: "var(--color-stream-cultural)",
  outdoor: "var(--color-stream-outdoor)",
};

const KEY = "yyyy-MM-dd";

/** 活動橫跨的每一天（startDate ~ endDate，含端點）。 */
function eventDays(event: Event): string[] {
  const start = parseISO(event.startDate);
  const end = event.endDate ? parseISO(event.endDate) : start;
  return eachDayOfInterval({ start, end }).map((d) => format(d, KEY));
}

/** 列出 minMonth..maxMonth（含）之間的所有 "yyyy-MM"。 */
function monthsBetween(minMonth: string, maxMonth: string): string[] {
  const out: string[] = [];
  let [y, m] = minMonth.split("-").map(Number);
  const [maxY, maxM] = maxMonth.split("-").map(Number);
  while (y < maxY || (y === maxY && m <= maxM)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

/**
 * 互動月曆：以 stream 上色的小圓點標出有活動的日子；左右換月（夾在資料月份範圍內，
 * 到頭尾時箭頭停用）。點某天開啟 DayDrawer 底部彈出面板看當天清單。
 */
export function CalendarMonth({
  events,
  initialMonth,
  todayISO,
}: CalendarMonthProps) {
  // date → 當天活動（依日期＋時間排序，沿用資料層的升冪順序）。
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const event of events) {
      for (const day of eventDays(event)) {
        const list = map.get(day);
        if (list) list.push(event);
        else map.set(day, [event]);
      }
    }
    return map;
  }, [events]);

  // 有資料的月份範圍（夾住換月導覽）。
  const months = useMemo(() => {
    if (events.length === 0) {
      const fallback = (todayISO ?? format(new Date(), KEY)).slice(0, 7);
      return [fallback];
    }
    let min = events[0].startDate.slice(0, 7);
    let max = min;
    for (const e of events) {
      const s = e.startDate.slice(0, 7);
      const end = (e.endDate ?? e.startDate).slice(0, 7);
      if (s < min) min = s;
      if (end > max) max = end;
    }
    return monthsBetween(min, max);
  }, [events, todayISO]);

  const initialIndex = useMemo(() => {
    const seed = initialMonth ?? todayISO?.slice(0, 7) ?? months[0];
    const i = months.indexOf(seed);
    return i >= 0 ? i : 0;
  }, [initialMonth, todayISO, months]);

  const [index, setIndex] = useState(initialIndex);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const month = months[Math.min(index, months.length - 1)];
  const [year, month0] = [
    Number(month.slice(0, 4)),
    Number(month.slice(5, 7)) - 1,
  ];

  const firstWeekday = new Date(year, month0, 1).getDay();
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goMonth = (delta: number) => {
    setIndex((i) => {
      const next = Math.min(Math.max(i + delta, 0), months.length - 1);
      if (next !== i) setSelectedDay(null);
      return next;
    });
  };

  const atStart = index <= 0;
  const atEnd = index >= months.length - 1;

  const dayKey = (d: number) =>
    `${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const drawerEvents = selectedDay
    ? (eventsByDay.get(selectedDay) ?? [])
    : [];

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between px-1">
        <h2 className="text-[22px] font-black">
          {year} 年 {month0 + 1} 月
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="上個月"
            disabled={atStart}
            onClick={() => goMonth(-1)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] transition",
              atStart
                ? "cursor-default text-[#cfc9bf]"
                : "text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="下個月"
            disabled={atEnd}
            onClick={() => goMonth(1)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] transition",
              atEnd
                ? "cursor-default text-[#cfc9bf]"
                : "text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mb-1.5 grid grid-cols-7 text-center text-xs font-bold text-[var(--color-text-secondary)]">
        {WEEKDAYS.map((label, i) => (
          <div
            key={label}
            className={cn((i === 0 || i === 6) && "text-[var(--color-accent)]")}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`pad-${i}`} aria-hidden />;

          const key = dayKey(d);
          const dayEvents = eventsByDay.get(key) ?? [];
          const hasEvents = dayEvents.length > 0;
          const isToday = todayISO === key;
          const isSelected = selectedDay === key;
          const streams = [...new Set(dayEvents.map((e) => e.stream))];

          return (
            <button
              key={key}
              type="button"
              disabled={!hasEvents}
              onClick={() => hasEvents && setSelectedDay(isSelected ? null : key)}
              aria-label={
                hasEvents
                  ? `${month0 + 1}月${d}日，${dayEvents.length} 個活動`
                  : `${month0 + 1}月${d}日`
              }
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-[12px] border text-sm transition",
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : isToday
                    ? "border-transparent bg-[#e6f4ef] text-[var(--color-primary-dark)]"
                    : hasEvents
                      ? "cursor-pointer border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                      : "cursor-default border-transparent text-[#b3ada3]",
              )}
            >
              <span
                className={cn(
                  "tabular-nums",
                  isToday || isSelected ? "font-black" : "font-semibold",
                )}
              >
                {d}
              </span>
              <span className="flex h-1.5 items-center gap-[3px]">
                {streams.map((s) => (
                  <span
                    key={s}
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: isSelected ? "#fff" : STREAM_DOT[s],
                    }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <StreamDot stream="cultural" />
        <StreamDot stream="outdoor" />
      </div>

      <DayDrawer
        day={selectedDay}
        events={drawerEvents}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}
