"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
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
 * 當日活動清單面板。
 * - 桌機：置中對話框。
 * - 手機：底部 drawer（由下滑入）。
 * Esc 或點背景關閉。
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
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${formatDate(day)} 的活動`}
    >
      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
      />
      <div className="relative flex max-h-[80dvh] w-full flex-col rounded-t-2xl bg-[var(--color-bg)] shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)]">
              當天活動
            </p>
            <h2 className="text-lg font-bold">{formatDate(day)}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {events.length > 0 ? (
            <ul className="grid gap-2">
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} variant="compact" />
                </li>
              ))}
            </ul>
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
