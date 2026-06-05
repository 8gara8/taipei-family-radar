"use client";

import type { Event } from "@/lib/types";
import { downloadIcs } from "@/lib/ics";

interface AddToCalendarButtonProps {
  event: Event;
}

/**
 * 「加入行事曆」：純前端產生 .ics 並下載。
 * iPhone（Safari→行事曆）、Android（Chrome→Google 日曆）、桌機皆可用。
 */
export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const onClick = () => {
    const eventPageUrl = `${window.location.origin}/events/${event.id}`;
    downloadIcs(
      {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        venue: event.venue,
        address: event.address,
        sourceUrl: event.sourceUrl,
        eventPageUrl,
      },
      `${event.id}.ics`,
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[14px] py-3 text-[15px] font-extrabold text-white transition active:scale-[0.99] sm:w-auto sm:px-5"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      📅 加入行事曆
    </button>
  );
}
