import { ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";
import { CATEGORY_META } from "@/lib/category";
import { formatDateRange } from "@/lib/utils";
import { AgeFitBadge } from "@/components/ui/AgeFitBadge";
import { FreeBadge } from "@/components/ui/FreeBadge";
import { StreamDot } from "@/components/ui/StreamDot";
import { BackButton } from "./BackButton";

interface EventDetailProps {
  event: Event;
}

/**
 * 活動詳情：全螢幕推入視圖。
 * 類型色頁頭（emoji 佔位／來源圖）＋返回鈕、徽章列、資訊格、適合度提醒、
 * 簡介、標籤，底部固定「查看原始出處」CTA（有報名連結則加次要按鈕）。
 */
export function EventDetail({ event }: EventDetailProps) {
  const { tint, emoji } = CATEGORY_META[event.category];

  return (
    <article className="animate-push-in fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col bg-[var(--color-bg)]">
      <div className="flex-1 overflow-y-auto">
        {/* 類型色頁頭 */}
        <div
          className="relative flex h-[190px] items-center justify-center"
          style={{ background: tint }}
        >
          <BackButton />
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <span aria-hidden className="text-[76px]">
                {emoji}
              </span>
              <span className="absolute right-3.5 bottom-3 font-mono text-[11px] text-[rgba(31,36,33,0.45)]">
                category placeholder
              </span>
            </>
          )}
        </div>

        {/* 內文 */}
        <div className="px-5 pt-4 pb-7">
          <div className="flex flex-wrap items-center gap-2">
            <StreamDot stream={event.stream} />
            <AgeFitBadge fit={event.ageFit} />
            <FreeBadge isFree={event.isFree} priceNote={event.priceNote} />
          </div>

          <h1 className="mt-2.5 text-[22px] leading-[1.3] font-black">
            {event.title}
          </h1>
          {event.titleOriginal && (
            <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)] italic">
              {event.titleOriginal}
            </p>
          )}

          <dl className="my-4 grid gap-2.5 text-sm text-[var(--color-text)]">
            <div className="flex gap-2.5">
              <span aria-hidden>📍</span>
              <dd>
                <span className="font-bold">{event.venue}</span>
                {event.area && (
                  <span className="ml-1.5 text-[var(--color-text-secondary)]">
                    {event.area}
                  </span>
                )}
              </dd>
            </div>
            <div className="flex gap-2.5">
              <span aria-hidden>🗓️</span>
              <dd className="font-bold">
                {formatDateRange(event.startDate, event.endDate)}
                {event.startTime ? ` · ${event.startTime}` : ""}
              </dd>
            </div>
            <div className="flex gap-2.5">
              <span aria-hidden>🎟️</span>
              <dd className="font-bold">
                {event.isFree ? "免費" : (event.priceNote ?? "需購票")}
              </dd>
            </div>
          </dl>

          {/* 適合度提醒 */}
          <div className="rounded-[14px] border border-[#f6e2c5] bg-[#fff7ec] p-[13px] text-[13.5px] leading-[1.6] text-[#8a5a1c]">
            <b>適合 4 歲與 2 歲？</b>
            {event.ageFitReason}
          </div>

          <p className="mt-4 text-[14.5px] leading-[1.85] whitespace-pre-line text-[var(--color-text)]">
            {event.summary}
          </p>

          {event.tags && event.tags.length > 0 && (
            <ul className="mt-3.5 flex flex-wrap gap-[7px]">
              {event.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-[var(--radius-pill)] bg-[var(--color-soft)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 固定底部 CTA */}
      <div
        className="shrink-0 space-y-2.5 border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-5 pt-3 backdrop-blur"
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 text-[15px] font-extrabold text-[var(--color-text)] transition hover:border-[var(--color-primary)]"
          >
            前往報名
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-1.5 rounded-[14px] py-3.5 text-[15.5px] font-extrabold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          查看原始出處
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}
