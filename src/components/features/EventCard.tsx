import Link from "next/link";
import type { Category, Event } from "@/lib/types";
import { cn, formatDateRange } from "@/lib/utils";
import { AgeFitBadge } from "@/components/ui/AgeFitBadge";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { FreeBadge } from "@/components/ui/FreeBadge";
import { StreamChip } from "@/components/ui/StreamChip";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact" | "highlight";
  className?: string;
}

const CATEGORY_EMOJI: Record<Category, string> = {
  music: "🎵",
  dance: "💃",
  performance: "🎭",
  competition: "🏆",
  film: "🎬",
  workshop: "🛠️",
  market: "🛍️",
  festival: "🎉",
  exhibition: "🖼️",
  other: "✨",
};

function Thumbnail({ event, size }: { event: Event; size: "sm" | "md" }) {
  const dim = size === "md" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12";
  if (event.imageUrl) {
    return (
      // 來源圖網域不一，避免 next/image remotePatterns 設定，v1 直接用 img。
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={event.imageUrl}
        alt=""
        className={cn(dim, "shrink-0 rounded-[10px] object-cover")}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        dim,
        "flex shrink-0 items-center justify-center rounded-[10px] text-2xl",
        "bg-[color-mix(in_srgb,var(--color-border)_35%,white)]",
      )}
    >
      {CATEGORY_EMOJI[event.category]}
    </div>
  );
}

/**
 * 活動卡片。
 * - default：縮圖 + 標籤列 + 標題 + venue·日期·時間 + 免費徽章。
 * - highlight：左側加 accent 色條。
 * - compact：單行，供 DayDrawer 使用。
 * 整張連結到 /events/[id]。
 */
export function EventCard({
  event,
  variant = "default",
  className,
}: EventCardProps) {
  const dateLabel = formatDateRange(event.startDate, event.endDate);

  if (variant === "compact") {
    return (
      <Link
        href={`/events/${event.id}`}
        className={cn(
          "group flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 transition hover:border-[var(--color-primary)]",
          className,
        )}
      >
        <Thumbnail event={event} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{event.title}</p>
          <p className="truncate text-xs text-[var(--color-text-secondary)]">
            {event.venue}
            {event.startTime ? ` · ${event.startTime}` : ""}
          </p>
        </div>
        <AgeFitBadge fit={event.ageFit} reason={event.ageFitReason} />
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article
        className={cn(
          "relative flex gap-3 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-sm transition sm:gap-4 sm:p-4",
          "hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md",
          variant === "highlight" && "pl-5",
          className,
        )}
      >
        {variant === "highlight" && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        )}
        <Thumbnail event={event} size="md" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <StreamChip stream={event.stream} />
            <CategoryTag category={event.category} />
            <AgeFitBadge fit={event.ageFit} reason={event.ageFitReason} />
          </div>
          <h3 className="font-bold transition-colors group-hover:text-[var(--color-primary)]">
            {event.title}
          </h3>
          {event.titleOriginal && (
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] italic">
              {event.titleOriginal}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-text)]">
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
            <FreeBadge isFree={event.isFree} priceNote={event.priceNote} />
          </div>
        </div>
      </article>
    </Link>
  );
}
