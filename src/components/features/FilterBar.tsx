"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Filter, RotateCcw } from "lucide-react";
import type { AgeFit, Category, Event, Stream } from "@/lib/types";
import { cn, CITY_META, parseArea, type CityKey } from "@/lib/utils";
import { CATEGORY_LABEL, CATEGORY_META } from "@/lib/category";
import { STREAM_META } from "@/lib/stream";

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
  /** 套用篩選後的結果筆數（顯示於觸發列與底部 CTA）。 */
  resultCount: number;
}

const AGEFIT_LABEL: Record<AgeFit, string> = {
  great: "很適合",
  ok: "可考慮",
  older: "大小孩",
};

/** 計算目前套用的篩選條件數量（供按鈕徽章顯示）。 */
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
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-[13px] py-[7px] text-[13.5px] font-bold transition",
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
      )}
    >
      {active && <Check className="h-3 w-3" aria-hidden />}
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
      <p className="mb-2.5 text-xs font-extrabold tracking-[0.3px] text-[var(--color-text-secondary)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/**
 * 全部活動篩選：以「篩選」按鈕（帶啟用數徽章）開啟底部彈出面板。
 * 條件：主題、類型（多選）、適合度、只看免費／週末、城市＋行政區，皆即時套用。
 * 城市與行政區選項由現有事件的 area 動態產生。
 */
export function FilterBar({
  events,
  value,
  onChange,
  resultCount,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);

  // 開啟面板時鎖背景捲動 + Esc 關閉。
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 事件中實際出現的類型（只列出有資料的，依固定順序）。
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
    <>
      {/* 觸發列：篩選按鈕（含啟用數徽章）＋ 清除 ＋ 結果筆數。 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[12px] border bg-[var(--color-surface)] px-3.5 py-2.5 text-sm font-extrabold transition",
            activeCount > 0
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]",
          )}
        >
          <Filter className="h-4 w-4" aria-hidden />
          篩選
          {activeCount > 0 && (
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-extrabold text-white"
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
            className="inline-flex shrink-0 items-center gap-1 text-[13.5px] font-bold whitespace-nowrap text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            清除
          </button>
        )}

        <span className="ml-auto shrink-0 text-[13px] font-bold whitespace-nowrap text-[var(--color-text-secondary)]">
          {resultCount} 個
        </span>
      </div>

      {/* 底部彈出面板。 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="篩選活動"
        >
          <button
            type="button"
            aria-label="關閉"
            onClick={() => setOpen(false)}
            className="animate-fade-in absolute inset-0"
            style={{ background: "rgba(31,36,33,0.32)" }}
          />
          <div className="animate-sheet-up relative flex max-h-[86dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[24px] bg-[var(--color-bg)] shadow-[0_-8px_30px_rgba(0,0,0,0.18)]">
            {/* sticky header */}
            <div className="shrink-0 px-5 pt-3 pb-1.5">
              <div
                aria-hidden
                className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-[var(--color-border)]"
              />
              <div className="flex items-center">
                <h3 className="text-[18px] font-black">篩選活動</h3>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange(EMPTY_FILTERS)}
                    className="ml-auto inline-flex items-center gap-1 text-[13.5px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    清除全部
                  </button>
                )}
              </div>
            </div>

            {/* scrollable groups */}
            <div className="flex-1 space-y-[18px] overflow-y-auto px-5 py-3">
              <FieldGroup label="主題">
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
                    {STREAM_META[s].label}
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
                      {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
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
                    {CITY_META[c].label.slice(0, 2)}
                  </TogglePill>
                ))}
              </FieldGroup>

              {value.city && districts.length > 0 && (
                <div className="-mt-2 flex flex-wrap items-center gap-2">
                  <TogglePill
                    active={!value.district}
                    onClick={() => set({ district: undefined })}
                  >
                    全區
                  </TogglePill>
                  {districts.map((d) => (
                    <TogglePill
                      key={d}
                      active={value.district === d}
                      onClick={() =>
                        set({ district: value.district === d ? undefined : d })
                      }
                    >
                      {d}
                    </TogglePill>
                  ))}
                </div>
              )}
            </div>

            {/* sticky footer CTA */}
            <div
              className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 pt-2.5"
              style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full rounded-[14px] py-3.5 text-center text-[15.5px] font-extrabold text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                顯示 {resultCount} 個活動
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
