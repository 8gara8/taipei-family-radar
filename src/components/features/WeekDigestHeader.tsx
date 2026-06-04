import { CalendarHeart, Clock, MapPin } from "lucide-react";
import type { WeeklyDigest } from "@/lib/types";
import { daysSince, formatFullDate } from "@/lib/utils";
import { StaleDataBanner } from "@/components/layout/StaleDataBanner";

interface WeekDigestHeaderProps {
  digest?: WeeklyDigest;
  total: number;
  lastUpdated?: string;
}

/**
 * 「本週精選」頁首：本週摘要 intro、活動數、最後更新時間。
 * lastUpdated 距今 > 8 天時於上方掛淡琥珀提示條（StaleDataBanner 完整版見 Phase 2）。
 */
export function WeekDigestHeader({
  digest,
  total,
  lastUpdated,
}: WeekDigestHeaderProps) {
  const staleDays = lastUpdated ? daysSince(lastUpdated) : null;
  const isStale = staleDays !== null && staleDays > 8;

  // intro 為 Markdown，v1 以段落簡單呈現。
  const paragraphs = digest?.intro
    ? digest.intro.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <header className="mb-8">
      {isStale && <StaleDataBanner days={staleDays!} className="mb-4" />}

      <p className="mb-1 text-sm font-semibold text-[var(--color-primary)]">
        本週精選
      </p>
      <h1 className="text-3xl font-bold sm:text-[32px]">台北親子活動雷達</h1>

      {paragraphs.length > 0 && (
        <div className="mt-3 max-w-3xl space-y-2 text-[var(--color-text-secondary)]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" aria-hidden />
          <dt className="sr-only">地理範圍</dt>
          <dd>大台北（台北市・新北市）</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarHeart className="h-4 w-4" aria-hidden />
          <dt className="sr-only">本週活動數</dt>
          <dd>
            本週 <span className="font-semibold text-[var(--color-text)]">{total}</span> 個適合活動
          </dd>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden />
            <dt className="sr-only">最後更新</dt>
            <dd>最後更新 {formatFullDate(lastUpdated)}</dd>
          </div>
        )}
      </dl>
    </header>
  );
}
