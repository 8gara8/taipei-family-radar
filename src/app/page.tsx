import { EventCard } from "@/components/features/EventCard";
import { WeekDigestHeader } from "@/components/features/WeekDigestHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  getDigestHighlights,
  getLastUpdated,
  getLatestDigest,
  getUpcomingEvents,
  getUpcomingEventsThisWeek,
} from "@/lib/data";
import { formatNextUpdate } from "@/lib/utils";

export default function HomePage() {
  const digest = getLatestDigest();
  const highlights = getDigestHighlights(digest);
  const upcoming = getUpcomingEvents();
  const lastUpdated = getLastUpdated();

  const highlightIds = new Set(highlights.map((e) => e.id));
  const rest = upcoming.filter((e) => !highlightIds.has(e.id));

  return (
    <div className="px-[18px] pt-2">
      <WeekDigestHeader
        digest={digest}
        thisWeek={getUpcomingEventsThisWeek().length}
        total={upcoming.length}
        lastUpdated={lastUpdated}
      />

      {upcoming.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="目前沒有即將到來的活動"
          description="本週暫時沒有掃描到適合幼兒的活動。代理人每週更新內容，過幾天再回來看看吧。"
          nextUpdate={formatNextUpdate()}
          action={{ href: "/calendar", label: "看月曆" }}
        />
      ) : (
        <>
          {highlights.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-[18px] font-black">⭐ 本週首推</h2>
              <div className="grid gap-2.5">
                {highlights.map((event) => (
                  <EventCard key={event.id} event={event} variant="highlight" />
                ))}
              </div>
            </section>
          )}

          <section className="mt-7">
            <h2 className="mb-3 text-[18px] font-black">
              {highlights.length > 0 ? "其他即將到來" : "即將到來"}
            </h2>
            {rest.length > 0 ? (
              <div className="grid gap-2.5">
                {rest.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="rounded-[var(--radius-card-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-secondary)]">
                本週暫無其他適合的活動，過幾天再回來看看吧。
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
