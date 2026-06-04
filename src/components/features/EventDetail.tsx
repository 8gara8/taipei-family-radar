import { CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import { AgeFitBadge } from "@/components/ui/AgeFitBadge";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { FreeBadge } from "@/components/ui/FreeBadge";
import { StreamChip } from "@/components/ui/StreamChip";

interface EventDetailProps {
  event: Event;
}

/** 由 lat/lng 或地址產生「在 Google 地圖開啟」連結（v1 不嵌入互動地圖）。 */
function mapsUrl(event: Event): string {
  const query =
    event.lat != null && event.lng != null
      ? `${event.lat},${event.lng}`
      : (event.address ?? event.venue);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * 活動詳情主體：標籤列、標題、場地/日期/時間、適合度理由、
 * summary、tags 與來源／報名／地圖連結。
 */
export function EventDetail({ event }: EventDetailProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <StreamChip stream={event.stream} />
        <CategoryTag category={event.category} />
        <AgeFitBadge fit={event.ageFit} reason={event.ageFitReason} />
        <FreeBadge isFree={event.isFree} priceNote={event.priceNote} />
      </div>

      <h1 className="mt-3 text-3xl font-bold">{event.title}</h1>
      {event.titleOriginal && (
        <p className="mt-1 text-[var(--color-text-secondary)] italic">
          {event.titleOriginal}
        </p>
      )}

      <dl className="mt-5 grid gap-2 text-[var(--color-text)]">
        <div className="flex items-start gap-2">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-secondary)]"
            aria-hidden
          />
          <dd>
            <span className="font-medium">{event.venue}</span>
            {event.address && (
              <span className="text-[var(--color-text-secondary)]">
                　{event.address}
              </span>
            )}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays
            className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]"
            aria-hidden
          />
          <dd>{formatDateRange(event.startDate, event.endDate)}</dd>
        </div>
        {event.startTime && (
          <div className="flex items-center gap-2">
            <Clock
              className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]"
              aria-hidden
            />
            <dd>{event.startTime}</dd>
          </div>
        )}
      </dl>

      <div
        className="mt-5 rounded-[var(--radius-card)] border p-4 text-sm"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))",
          borderColor: "var(--color-border)",
        }}
      >
        <p className="font-semibold">親子適合度：{event.ageFitReason}</p>
      </div>

      <p className="mt-5 leading-[1.9] whitespace-pre-line text-[var(--color-text)]">
        {event.summary}
      </p>

      {event.tags && event.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-[var(--radius-pill)] bg-[color-mix(in_srgb,var(--color-border)_45%,white)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={mapsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium transition hover:border-[var(--color-primary)]"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          在 Google 地圖開啟
        </a>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-sm font-medium text-white transition"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            前往報名
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-1 py-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          來源：{event.sourceName}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </>
  );
}
