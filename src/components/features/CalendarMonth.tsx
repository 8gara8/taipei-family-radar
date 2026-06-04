"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event, Stream } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DayDrawer } from "./DayDrawer";

interface CalendarMonthProps {
  events: Event[];
  initialMonth?: string; // "2026-06"
  /** 今天 "yyyy-MM-dd"（由 server 以台北時區算好，避免水合不一致）。 */
  todayISO?: string;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

const STREAM_DOT: Record<Stream, string> = {
  cultural: "var(--stream-cultural)",
  outdoor: "var(--stream-outdoor)",
};

const KEY = "yyyy-MM-dd";

/** 活動橫跨的每一天（startDate ~ endDate，含端點）。 */
function eventDays(event: Event): string[] {
  const start = parseISO(event.startDate);
  const end = event.endDate ? parseISO(event.endDate) : start;
  return eachDayOfInterval({ start, end }).map((d) => format(d, KEY));
}

/** "2026-06" 或 today → 該月第一天的 Date。 */
function initialCursor(initialMonth?: string, todayISO?: string): Date {
  const seed = initialMonth
    ? `${initialMonth}-01`
    : todayISO
      ? `${todayISO.slice(0, 7)}-01`
      : format(new Date(), "yyyy-MM-01");
  return startOfMonth(parseISO(seed));
}

/**
 * 互動月曆：以 date-fns 產生月格（含跨月補格），每格依當天活動以 stream 上色的小圓點。
 * 可左右換月；點某天開啟 DayDrawer 看當天清單。
 */
export function CalendarMonth({
  events,
  initialMonth,
  todayISO,
}: CalendarMonthProps) {
  const [cursor, setCursor] = useState<Date>(() =>
    initialCursor(initialMonth, todayISO),
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  const monthLabel = format(cursor, "yyyy年 M月", { locale: zhTW });
  const onCurrentMonth = todayISO
    ? format(cursor, "yyyy-MM") === todayISO.slice(0, 7)
    : false;

  const drawerEvents = selectedDay
    ? (eventsByDay.get(selectedDay) ?? [])
    : [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          {!onCurrentMonth && todayISO && (
            <button
              type="button"
              onClick={() => setCursor(initialCursor(undefined, todayISO))}
              className="mr-1 rounded-[10px] border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              回本月
            </button>
          )}
          <button
            type="button"
            aria-label="上個月"
            onClick={() => setCursor((c) => addMonths(c, -1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="下個月"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] text-center text-xs font-medium text-[var(--color-text-secondary)]">
          {WEEKDAYS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "py-2",
                (i === 0 || i === 6) && "text-[var(--color-accent)]",
              )}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, KEY);
            const dayEvents = eventsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, cursor);
            const isToday = todayISO === key;
            const weekend = getDay(day) === 0 || getDay(day) === 6;
            const hasEvents = dayEvents.length > 0;

            return (
              <button
                key={key}
                type="button"
                disabled={!hasEvents}
                onClick={() => hasEvents && setSelectedDay(key)}
                aria-label={
                  hasEvents
                    ? `${format(day, "M月d日", { locale: zhTW })}，${dayEvents.length} 個活動`
                    : format(day, "M月d日", { locale: zhTW })
                }
                className={cn(
                  "relative flex min-h-[64px] flex-col items-center gap-1 border-b border-r border-[var(--color-border)] p-1.5 text-sm transition sm:min-h-[88px] sm:p-2",
                  "[&:nth-child(7n)]:border-r-0",
                  hasEvents
                    ? "cursor-pointer hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
                    : "cursor-default",
                  !inMonth && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm tabular-nums",
                    isToday && "font-bold text-white",
                    !isToday && weekend && "text-[var(--color-accent)]",
                  )}
                  style={
                    isToday
                      ? { backgroundColor: "var(--color-primary)" }
                      : undefined
                  }
                >
                  {format(day, "d")}
                </span>

                {hasEvents && (
                  <span className="flex flex-wrap items-center justify-center gap-0.5">
                    {dayEvents.slice(0, 4).map((event, i) => (
                      <span
                        key={`${event.id}-${i}`}
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: STREAM_DOT[event.stream] }}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[10px] leading-none text-[var(--color-text-secondary)]">
                        +{dayEvents.length - 4}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STREAM_DOT.cultural }}
          />
          文化機構
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STREAM_DOT.outdoor }}
          />
          戶外表演
        </span>
        <span>點選有圓點的日期看當天活動。</span>
      </div>

      <DayDrawer
        day={selectedDay}
        events={drawerEvents}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}
