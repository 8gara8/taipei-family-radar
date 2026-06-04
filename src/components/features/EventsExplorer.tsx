"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/lib/types";
import { cn, isWeekend, parseArea } from "@/lib/utils";
import { EventCard } from "@/components/features/EventCard";
import { FilterBar, EMPTY_FILTERS, type FilterState } from "@/components/features/FilterBar";
import { EmptyState } from "@/components/layout/EmptyState";

type Scope = "upcoming" | "all";

interface EventsExplorerProps {
  /** 已正規化、依日期升冪的全部活動（含近 4 週內已結束者）。 */
  events: Event[];
}

function matches(event: Event, f: FilterState): boolean {
  if (f.stream && event.stream !== f.stream) return false;
  if (f.categories.length > 0 && !f.categories.includes(event.category))
    return false;
  if (f.freeOnly && !event.isFree) return false;
  if (f.weekendOnly && !isWeekend(event.startDate)) return false;
  if (f.ageFit && event.ageFit !== f.ageFit) return false;
  if (f.city || f.district) {
    const { city, district } = parseArea(event.area);
    if (f.city && city !== f.city) return false;
    if (f.district && district !== f.district) return false;
  }
  return true;
}

/**
 * 「全部活動」互動區（client）：範圍切換（即將到來／全部）＋ FilterBar，
 * 對已載入的事件陣列在前端篩選。資料量小，整包送 client 可接受。
 */
export function EventsExplorer({ events }: EventsExplorerProps) {
  const [scope, setScope] = useState<Scope>("upcoming");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const scoped = useMemo(
    () =>
      scope === "upcoming"
        ? events.filter((e) => e.status === "upcoming")
        : events,
    [events, scope],
  );

  const filtered = useMemo(
    () => scoped.filter((e) => matches(e, filters)),
    [scoped, filters],
  );

  const upcomingCount = useMemo(
    () => events.filter((e) => e.status === "upcoming").length,
    [events],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="活動範圍"
        className="mb-5 inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-sm"
      >
        {(
          [
            ["upcoming", `即將到來（${upcomingCount}）`],
            ["all", `全部（${events.length}）`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={scope === key}
            onClick={() => setScope(key)}
            className={cn(
              "rounded-[var(--radius-pill)] px-4 py-1.5 font-medium transition",
              scope === key
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <FilterBar events={scoped} value={filters} onChange={setFilters} />

      <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
        共 <span className="font-semibold text-[var(--color-text)]">{filtered.length}</span> 個活動
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="沒有符合條件的活動"
          description="試著放寬篩選條件，或切換到「全部」查看近期所有活動。"
          action={{ href: "/calendar", label: "看月曆" }}
        />
      )}
    </div>
  );
}
