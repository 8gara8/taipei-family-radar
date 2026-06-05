import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { SourceList } from "@/components/features/SourceList";
import { StaleDataBanner } from "@/components/layout/StaleDataBanner";
import { getLastUpdated, getSources } from "@/lib/data";
import { daysSince, formatFullDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "關於與來源",
  description:
    "台北親子活動雷達如何運作：每週由 AI 代理人掃描台北、新北、基隆的各國文化機構與戶外表演場地，篩出免費且適合幼兒的活動。附掃描來源清單與最後更新狀態。",
};

export default function AboutPage() {
  const sources = getSources();
  const lastUpdated = getLastUpdated();
  const staleDays = lastUpdated ? daysSince(lastUpdated) : null;
  const isStale = staleDays !== null && staleDays > 8;

  return (
    <div>
      <header className="mb-8">
        <p className="mb-1 text-sm font-semibold text-[var(--color-primary)]">
          關於與來源
        </p>
        <h1 className="text-3xl font-bold sm:text-[32px]">關於本站</h1>
      </header>

      {/* Section A：這是什麼？ */}
      <section className="mb-10 max-w-3xl space-y-3 text-[var(--color-text-secondary)]">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          這是什麼？
        </h2>
        <p>
          <strong className="text-[var(--color-text)]">台北親子活動雷達</strong>
          是一個自動更新的免費親子活動指南，專為帶幼兒（2-4 歲）的台北家長設計。
        </p>
        <p>
          我們只收錄免費、有明確日期的活動：音樂會、表演、市集、節慶、比賽、文化體驗。
          不收錄常設景點、付費活動、或季節性設施。
        </p>
        <p>地理範圍涵蓋台北市、新北市、基隆市。</p>
      </section>

      {/* Section B：怎麼運作的？ */}
      <section className="mb-10 max-w-3xl space-y-3 text-[var(--color-text-secondary)]">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          怎麼運作的？
        </h2>
        <p>內容由 AI 代理人每週自動掃描產生：</p>
        <ul className="space-y-2">
          <li>
            <strong className="text-[var(--color-text)]">週二晚間</strong>
            ：掃描各國駐台文化機構（歌德學院、法國在台協會、AIT、日本交流協會等）的節慶與文化活動。
          </li>
          <li>
            <strong className="text-[var(--color-text)]">週四晚間</strong>
            ：掃描戶外表演場地（兩廳院、中正紀念堂、華山、大安公園、河濱公園、基隆潮境等）的演出、賽事、市集。
          </li>
        </ul>
        <p>
          每次掃描會研究 25+ 個來源，篩出免費且適合幼兒的活動，自動更新網站。本站為純靜態網站，
          無後端、無資料庫、不收集個資。
        </p>
      </section>

      {/* Section C：適合度徽章說明 */}
      <section className="mb-10 max-w-3xl space-y-3 text-[var(--color-text-secondary)]">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          適合度徽章說明
        </h2>
        <p>每個活動都有親子適合度評估：</p>
        <ul className="space-y-2">
          <li>
            <span className="font-semibold text-[var(--color-text)]">
              🟢 很適合
            </span>
            　— 戶外開放空間、免費、可隨進隨出、幼兒走動吵鬧沒關係、推車友善。
          </li>
          <li>
            <span className="font-semibold text-[var(--color-text)]">
              🟡 可考慮
            </span>
            　— 免費但室內或稍有形式、時間不長、家長陪同下 2-4 歲可參加。
          </li>
          <li>
            <span className="font-semibold text-[var(--color-text)]">
              ⚪ 較適合大小孩
            </span>
            　— 免費但需久坐安靜、對象學齡以上。
          </li>
        </ul>
        <p>評估理由會顯示在每個活動的詳情頁。</p>
      </section>

      {/* Section D：掃描來源 */}
      <section className="mb-10">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">掃描來源（{sources.length}）</h2>
          {lastUpdated && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Clock className="h-4 w-4" aria-hidden />
              最後更新 {formatFullDate(lastUpdated)}
            </span>
          )}
        </div>

        <p className="mb-4 max-w-3xl text-sm text-[var(--color-text-secondary)]">
          「<strong className="text-[var(--color-text)]">部分</strong>
          」狀態表示該來源已掃描，但無法取得全部資訊（網站結構改變、部分頁面需要 JavaScript 等）。
        </p>

        {isStale && <StaleDataBanner days={staleDays!} className="mb-4" />}

        <SourceList sources={sources} />
      </section>

      {/* Section E：免責聲明 */}
      <section className="max-w-3xl rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          免責聲明
        </h2>
        <p>
          活動資訊以主辦單位公告為準。本站資訊由 AI 自動彙整，可能有誤差或延遲。
          建議出發前確認主辦單位官網。
        </p>
      </section>
    </div>
  );
}
