"use client";

import { useMemo, useState } from "react";
import { Check, Filter, RotateCcw } from "lucide-react";
import type { AgeFit, Category, Event, Stream } from "@/lib/types";
import { cn, CITY_META, parseArea, type CityKey } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/components/ui/CategoryTag";

export interface FilterState {
  stream?: Stream;
  categories: Category[];
  freeOnly: boolean;
  weekendOnly: boolean;
  ageFit?: AgeFit;
  city?: CityKey;
  district?: string;
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  freeOnly: false,
  weekendOnly: false,
};

interface FilterBarProps {
  events: Event[];
  value: FilterState;
  onChange: (s: FilterState) => void;
}

const STREAM_LABEL: Record<Stream, string> = {
  cultural: "文化機構",
  outdoor: "戶外表演",
};

const AGEFIT_LABEL: Record<AgeFit, string> = {
  great: "很適合",
  ok: "可考慮",
  older: "大小孩",
};

/** 計算目前套用的篩選條件數量（供行動版按鈕顯示徽章）。 */
function countActive(f: FilterState): number {
  return (
    (f.stream ? 1 : 0) +
    f.categories.length +
    (f.freeOnly ? 1 : 0) +
    (f.weekendOnly ? 1 : 0) +
    (f.ageFit ? 1 : 0) +
    (f.city ? 1 : 0) +
    (f.district ? 1 : 0)
  );
}

/** 單一可切換的膠囊按鈕。 */
function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm font-medium transition",
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
      )}
    >
      {active && <Check className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </button>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

/**
 * 全部活動篩選列（client）。
 * 條件：利基、類型（多選）、只看免費、只看週末、適合度、城市＋行政區。
 * 城市與行政區選項由現有事件的 area 動態產生。
 * 手機收進「篩選」按鈕展開。
 */
export function FilterBar({ events, value, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  // 事件中實際出現的類型（只列出有資料的）。
  const categories = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return (Object.keys(CATEGORY_LABEL) as Category[]).filter((c) =>
      present.has(c),
    );
  }, [events]);

  // 城市中實際出現的行政區（依目前選取的城市過濾）。
  const districts = useMemo(() => {
    if (!value.city) return [];
    const set = new Set<string>();
    for (const e of events) {
      const { city, district } = parseArea(e.area);
      if (city === value.city && district) set.add(district);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }, [events, value.city]);

  const activeCount = countActive(value);

  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  const toggleCategory = (c: Category) =>
    set({
      categories: value.categories.includes(c)
        ? value.categories.filter((x) => x !== c)
        : [...value.categories, c],
    });

  return (
    <div className="mb-6">
      {/* 行動版：篩選按鈕（展開/收合）。 */}
      <div className="mb-3 flex items-center justify-between gap-3 sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium transition hover:border-[var(--color-primary)]"
        >
          <Filter className="h-4 w-4" aria-hidden />
          篩選
          {activeCount > 0 && (
            <span
              className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            清除
          </button>
        )}
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_60%,var(--color-bg))] p-4",
          "space-y-4",
          open ? "block" : "hidden sm:block",
        )}
      >
        <FieldGroup label="利基">
          <TogglePill
            active={!value.stream}
            onClick={() => set({ stream: undefined })}
          >
            全部
          </TogglePill>
          {(["cultural", "outdoor"] as Stream[]).map((s) => (
            <TogglePill
              key={s}
              active={value.stream === s}
              onClick={() =>
                set({ stream: value.stream === s ? undefined : s })
              }
            >
              {STREAM_LABEL[s]}
            </TogglePill>
          ))}
        </FieldGroup>

        {categories.length > 0 && (
          <FieldGroup label="類型">
            {categories.map((c) => (
              <TogglePill
                key={c}
                active={value.categories.includes(c)}
                onClick={() => toggleCategory(c)}
              >
                {CATEGORY_LABEL[c]}
              </TogglePill>
            ))}
          </FieldGroup>
        )}

        <FieldGroup label="適合度">
          <TogglePill
            active={!value.ageFit}
            onClick={() => set({ ageFit: undefined })}
          >
            全部
          </TogglePill>
          {(["great", "ok", "older"] as AgeFit[]).map((a) => (
            <TogglePill
              key={a}
              active={value.ageFit === a}
              onClick={() =>
                set({ ageFit: value.ageFit === a ? undefined : a })
              }
            >
              {AGEFIT_LABEL[a]}
            </TogglePill>
          ))}
        </FieldGroup>

        <FieldGroup label="其他">
          <TogglePill
            active={value.freeOnly}
            onClick={() => set({ freeOnly: !value.freeOnly })}
          >
            只看免費
          </TogglePill>
          <TogglePill
            active={value.weekendOnly}
            onClick={() => set({ weekendOnly: !value.weekendOnly })}
          >
            只看週末
          </TogglePill>
        </FieldGroup>

        <FieldGroup label="地區">
          <TogglePill
            active={!value.city}
            onClick={() => set({ city: undefined, district: undefined })}
          >
            全部
          </TogglePill>
          {(Object.keys(CITY_META) as CityKey[]).map((c) => (
            <TogglePill
              key={c}
              active={value.city === c}
              onClick={() =>
                set(
                  value.city === c
                    ? { city: undefined, district: undefined }
                    : { city: c, district: undefined },
                )
              }
            >
              {CITY_META[c].label}
            </TogglePill>
          ))}
          {value.city && districts.length > 0 && (
            <select
              value={value.district ?? ""}
              onChange={(e) =>
                set({ district: e.target.value || undefined })
              }
              aria-label="行政區"
              className="rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)]"
            >
              <option value="">全部行政區</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </FieldGroup>

        {/* 桌機版清除鈕。 */}
        {activeCount > 0 && (
          <div className="hidden border-t border-[var(--color-border)] pt-3 sm:block">
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              清除全部篩選
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
