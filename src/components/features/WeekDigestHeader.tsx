import type { WeeklyDigest } from "@/lib/types";
import { daysSince, formatFullDate } from "@/lib/utils";
import { StaleDataBanner } from "@/components/layout/StaleDataBanner";

interface WeekDigestHeaderProps {
  digest?: WeeklyDigest;
  /** 所有即將到來的活動數。 */
  total: number;
  lastUpdated?: string;
}

/** 由 "2026-W23" 取出週序數（23）。 */
function weekNumber(weekOf?: string): number | null {
  const m = weekOf?.match(/W(\d{1,2})/);
  return m ? Number(m[1]) : null;
}

/**
 * 首頁頁首：眉標（近期推薦 · 第 N 週）＋大標題＋柔色漸層摘要卡，
 * 卡內為本週 intro 與地點／活動數／資料更新的統計列。資料過期（>8 天）時於上方掛提示條。
 */
export function WeekDigestHeader({
  digest,
  total,
  lastUpdated,
}: WeekDigestHeaderProps) {
  const staleDays = lastUpdated ? daysSince(lastUpdated) : null;
  const isStale = staleDays !== null && staleDays > 8;
  const weekNo = weekNumber(digest?.weekOf);

  // intro 為 Markdown，v1 以段落簡單呈現。
  const paragraphs = digest?.intro
    ? digest.intro.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <header>
      {isStale && <StaleDataBanner days={staleDays!} className="mb-3" />}

      <p className="text-[13px] font-extrabold tracking-[0.3px] text-[var(--color-primary)]">
        近期推薦{weekNo !== null ? ` · 第 ${weekNo} 週` : ""}
      </p>
      <h1 className="mt-1 text-[27px] leading-[1.18] font-black tracking-[-0.5px]">
        台北親子活動雷達
      </h1>

      <div className="mt-3 rounded-[var(--radius-card-lg)] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff,#fdfbf6)] p-[15px]">
        {paragraphs.length > 0 ? (
          <div className="space-y-2 text-[13.5px] leading-[1.75] text-[var(--color-text-secondary)]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] leading-[1.75] text-[var(--color-text-secondary)]">
            近期推薦正在整理中，過幾天再回來看看吧。
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] font-semibold text-[var(--color-text-secondary)]">
          <span>📍 台北・新北・基隆</span>
          <span>
            🗓️ 共{" "}
            <b className="font-extrabold text-[var(--color-text)]">{total}</b>{" "}
            個免費活動
          </span>
          {lastUpdated && <span>🔄 {formatFullDate(lastUpdated)} 更新</span>}
        </div>
      </div>
    </header>
  );
}
