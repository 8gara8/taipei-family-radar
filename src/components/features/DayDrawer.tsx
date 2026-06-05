"use client";

import { useEffect } from "react";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { EventCard } from "./EventCard";

interface DayDrawerProps {
  /** 選取日 "yyyy-MM-dd"；為 null 時不顯示。 */
  day: string | null;
  events: Event[];
  onClose: () => void;
}

/**
 * 當日活動清單：錨定在手機視窗底部的底部彈出面板（bottom sheet）。
 * 抓握條 + 日期標題 + 活動數 + 當天活動卡。Esc 或點背景關閉。
 */
export function DayDrawer({ day, events, onClose }: DayDrawerProps) {
  useEffect(() => {
    if (!day) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // 開啟時鎖住背景捲動。
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [day, onClose]);

  if (!day) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`${formatDate(day)} 的活動`}
    >
      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="animate-fade-in absolute inset-0"
        style={{ background: "rgba(31,36,33,0.28)" }}
      />
      <div
        className="animate-sheet-up relative flex max-h-[78dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[22px] bg-[var(--color-bg)] shadow-[0_-8px_30px_rgba(0,0,0,0.16)]"
      >
        <div className="px-[18px] pt-2.5">
          <div
            aria-hidden
            className="mx-auto mb-3.5 h-[5px] w-10 rounded-full bg-[var(--color-border)]"
          />
          <h2 className="text-[17px] font-black">{formatDate(day)}</h2>
          <p className="mt-0.5 mb-3.5 text-[13px] text-[var(--color-text-secondary)]">
            {events.length} 個活動
          </p>
        </div>

        <div
          className="flex-1 overflow-y-auto px-[18px]"
          style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
        >
          {events.length > 0 ? (
            <div className="grid gap-2.5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
              這天沒有上雷達的活動。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
