import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { SourceList } from "@/components/features/SourceList";
import { StaleDataBanner } from "@/components/layout/StaleDataBanner";
import { getLastUpdated, getSources } from "@/lib/data";
import { daysSince, formatFullDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "關於與來源",
  description:
    "台北親子活動雷達如何運作：每週由 Claude 代理人掃描各國文化機構與戶外表演場地，篩出適合幼兒的活動。附掃描來源清單與最後更新狀態。",
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

      <section className="mb-10 max-w-3xl space-y-3 text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text)]">台北親子活動雷達</strong>
          專為帶著 2 歲與 4 歲幼兒的大台北家長設計，每週精選兩條利基的活動：
          <strong className="text-[var(--color-text)]">各國駐台文化／代表機構</strong>
          的節慶與文化活動，以及中正紀念堂、大安森林公園、兩廳院藝文廣場、華山、松菸、市民廣場等地的
          <strong className="text-[var(--color-text)]">戶外表演</strong>。
        </p>
        <p>
          內容由一個每週執行的 Claude 代理人自動研究、整理並寫入網站：它會掃描下列來源，
          挑出適合幼兒參加的活動，為每筆判定親子適合度並寫下一句理由。本站為純靜態網站，
          無後端、無資料庫、不收集個資。
        </p>
        <p className="text-sm">
          適合度說明：
          <strong className="text-[var(--color-text)]">很適合</strong>＝戶外開放、免費或低價、可隨進隨出；
          <strong className="text-[var(--color-text)]">可考慮</strong>＝室內或稍有形式、家長陪同下尚可；
          <strong className="text-[var(--color-text)]">大小孩</strong>＝需久坐安靜或正式售票，較適合學齡以上。
        </p>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">掃描來源（{sources.length}）</h2>
          {lastUpdated && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Clock className="h-4 w-4" aria-hidden />
              最後更新 {formatFullDate(lastUpdated)}
            </span>
          )}
        </div>

        {isStale && <StaleDataBanner days={staleDays!} className="mb-4" />}

        <SourceList sources={sources} />
      </section>
    </div>
  );
}
