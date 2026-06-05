import Link from "next/link";
import type { Event } from "@/lib/types";
import { CATEGORY_META } from "@/lib/category";
import { cn, formatDateRange } from "@/lib/utils";
import { AgeFitBadge } from "@/components/ui/AgeFitBadge";
import { FreeBadge } from "@/components/ui/FreeBadge";
import { StreamDot } from "@/components/ui/StreamDot";

interface EventCardProps {
  event: Event;
  variant?: "default" | "highlight";
  className?: string;
}

/** 縮圖：有來源圖則顯示圖，否則以類型底色＋emoji 佔位。 */
function Thumbnail({ event, size }: { event: Event; size: number }) {
  const { tint, emoji } = CATEGORY_META[event.category];
  if (event.imageUrl) {
    return (
      // 來源圖網域不一，避免 next/image remotePatterns 設定，v1 直接用 img。
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={event.imageUrl}
        alt=""
        style={{ width: size, height: size }}
        className="shrink-0 rounded-[12px] object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-[14px]"
      style={{
        width: size,
        height: size,
        background: tint,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {emoji}
    </div>
  );
}

/**
 * 活動卡片。
 * - default：類型縮圖 + 利基色點/類型 meta 列 + 標題 + 場地·日期·時間 + 適合度/免費徽章。
 * - highlight：左側加 accent 色條、縮圖放大。
 * 整張連結到 /events/[id]。
 */
export function EventCard({
  event,
  variant = "default",
  className,
}: EventCardProps) {
  const highlight = variant === "highlight";
  const dateLabel = formatDateRange(event.startDate, event.endDate);

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article
        className={cn(
          "relative flex gap-3 overflow-hidden rounded-[var(--radius-card-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[0_1px_2px_rgba(31,36,33,0.04)] transition",
          "hover:border-[var(--color-primary)] hover:shadow-md",
          highlight && "pl-5",
          className,
        )}
      >
        {highlight && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        )}

        <Thumbnail event={event} size={highlight ? 64 : 56} />

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <StreamDot stream={event.stream} />
            <span>· {CATEGORY_META[event.category].label}</span>
          </div>

          <h3 className="text-[15.5px] leading-[1.35] font-extrabold tracking-[-0.2px] transition-colors group-hover:text-[var(--color-primary)]">
            {event.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text)]">
              {event.venue}
            </span>
            <span aria-hidden>·</span>
            <span>{dateLabel}</span>
            {event.startTime && (
              <>
                <span aria-hidden>·</span>
                <span>{event.startTime}</span>
              </>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <AgeFitBadge fit={event.ageFit} reason={event.ageFitReason} />
            {event.isFree && <FreeBadge isFree priceNote={event.priceNote} />}
          </div>
        </div>
      </article>
    </Link>
  );
}
