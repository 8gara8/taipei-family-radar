"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/lib/types";
import { isWeekend, parseArea } from "@/lib/utils";
import { EventCard } from "@/components/features/EventCard";
import {
  FilterBar,
  EMPTY_FILTERS,
  type FilterState,
} from "@/components/features/FilterBar";

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
 * 「全部活動」互動區（client）：對即將到來的活動套用 FilterBar 篩選，即時顯示結果。
 * 資料量小，整包送 client 可接受。
 */
export function EventsExplorer({ events }: EventsExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const upcoming = useMemo(
    () => events.filter((e) => e.status === "upcoming"),
    [events],
  );

  const filtered = useMemo(
    () => upcoming.filter((e) => matches(e, filters)),
    [upcoming, filters],
  );

  return (
    <div>
      <FilterBar
        events={upcoming}
        value={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      <div className="mt-3.5">
        {filtered.length > 0 ? (
          <div className="grid gap-2.5">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-[50px] text-center text-[var(--color-text-secondary)]">
            <div className="text-[40px]">🔍</div>
            <p className="mt-2.5 text-[14.5px] font-bold text-[var(--color-text)]">
              沒有符合的活動
            </p>
            <p className="mt-1 text-[13px]">試著放寬篩選條件</p>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-3.5 inline-block rounded-[12px] px-[18px] py-2.5 text-sm font-extrabold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              清除篩選
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
