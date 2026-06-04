import { EventCard } from "@/components/features/EventCard";
import { WeekDigestHeader } from "@/components/features/WeekDigestHeader";
import {
  getDigestHighlights,
  getEventsFoundThisWeek,
  getLastUpdated,
  getLatestDigest,
  getUpcomingEvents,
} from "@/lib/data";

export default function HomePage() {
  const digest = getLatestDigest();
  const highlights = getDigestHighlights(digest);
  const upcoming = getUpcomingEvents();
  const lastUpdated = getLastUpdated();

  const highlightIds = new Set(highlights.map((e) => e.id));
  const rest = upcoming.filter((e) => !highlightIds.has(e.id));

  return (
    <div>
      <WeekDigestHeader
        digest={digest}
        total={getEventsFoundThisWeek().length}
        lastUpdated={lastUpdated}
      />

      {highlights.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">本週首推</h2>
          <div className="grid gap-3">
            {highlights.map((event) => (
              <EventCard key={event.id} event={event} variant="highlight" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">
          {highlights.length > 0 ? "其他即將到來" : "即將到來"}
        </h2>
        {rest.length > 0 ? (
          <div className="grid gap-3">
            {rest.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-[var(--color-text-secondary)]">
            本週暫無其他適合的活動，過幾天再回來看看吧。
          </p>
        )}
      </section>
    </div>
  );
}
