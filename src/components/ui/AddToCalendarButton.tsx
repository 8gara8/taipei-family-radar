import type { Event } from "@/lib/types";

interface AddToCalendarButtonProps {
  event: Event;
}

/**
 * 「加入行事曆」：連到伺服器提供的真實 .ics（text/calendar）。
 * iPhone/iPad（Safari→行事曆）、Android（Chrome→Google 日曆）、桌機皆可用。
 * 用真實 URL 而非 data: URI，避開 iOS Safari 封鎖頂層 data: 導覽的限制。
 */
export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  return (
    <a
      href={`/events/${event.id}/event.ics`}
      className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[14px] py-3 text-[15px] font-extrabold text-white transition active:scale-[0.99] sm:w-auto sm:px-5"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      📅 加入行事曆
    </a>
  );
}
