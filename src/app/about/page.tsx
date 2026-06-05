import type { Metadata } from "next";
import { SourceList } from "@/components/features/SourceList";
import { StaleDataBanner } from "@/components/layout/StaleDataBanner";
import { STREAM_META } from "@/lib/stream";
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
    <div className="px-[18px] pt-2 pb-7">
      <h1 className="mb-2.5 text-[22px] font-black">關於</h1>

      {/* 介紹卡 */}
      <div className="rounded-[var(--radius-card-lg)] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff,#fdfbf6)] p-4">
        <p className="text-sm leading-[1.8] text-[var(--color-text)]">
          一個自動更新的「台北親子活動雷達」，為帶{" "}
          <b>4 歲與 2 歲</b>
          幼兒的台北家長，每週精選大台北（含新北、基隆）適合幼兒的免費活動。
        </p>
        <p className="mt-2.5 text-[13px] leading-[1.8] text-[var(--color-text-secondary)]">
          內容由 AI 代理人每週自動掃描兩次：週二晚間掃描各國文化機構活動，週四晚間掃描戶外表演與賽事。
        </p>
      </div>

      {/* 兩條利基 */}
      <div className="mt-4 grid gap-2.5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STREAM_META.cultural.color }}
            />
            <b className="text-[15px]">利基 A · 文化機構</b>
          </div>
          <p className="mt-2 text-[13px] leading-[1.7] text-[var(--color-text-secondary)]">
            各國駐台文化／代表機構的節慶與文化活動（歌德學院、法國在台協會、加拿大商會…）。
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STREAM_META.outdoor.color }}
            />
            <b className="text-[15px]">利基 B · 戶外表演</b>
          </div>
          <p className="mt-2 text-[13px] leading-[1.7] text-[var(--color-text-secondary)]">
            戶外表演、街舞賽事、音樂會、市集、節慶、兒童劇場免費場次。場地涵蓋兩廳院、中正紀念堂、大安公園、華山、河濱公園、基隆潮境等。
          </p>
        </div>
      </div>

      {/* 適合度說明 */}
      <div className="mt-4">
        <h2 className="text-[18px] font-black mb-2.5">適合度徽章</h2>
        <div className="grid gap-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex items-start gap-3">
            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{backgroundColor:'#e6f4ef',color:'#2f9e7e'}}>👶 很適合</span>
            <p className="text-[13px] text-[var(--color-text-secondary)]">戶外開放空間、免費、可隨進隨出、幼兒走動吵鬧沒關係、推車友善</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex items-start gap-3">
            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{backgroundColor:'#fbf1d8',color:'#b5810a'}}>可考慮</span>
            <p className="text-[13px] text-[var(--color-text-secondary)]">免費但室內或稍有形式、時間不長、家長陪同下 2-4 歲可參加</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex items-start gap-3">
            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{backgroundColor:'#eef0ee',color:'#6f7d75'}}>大小孩</span>
            <p className="text-[13px] text-[var(--color-text-secondary)]">免費但需久坐安靜、對象學齡以上</p>
          </div>
        </div>
      </div>

      {/* 掃描來源 */}
      <div className="mt-6 mb-3 flex items-center">
        <h2 className="text-[18px] font-black">每週掃描來源</h2>
        <span className="ml-auto text-[12.5px] font-bold text-[var(--color-text-secondary)]">
          {sources.length} 個來源
        </span>
      </div>

      {isStale && <StaleDataBanner days={staleDays!} className="mb-3" />}

      <SourceList sources={sources} />

      <p className="mt-[18px] text-center text-xs leading-[1.7] text-[var(--color-text-secondary)]">
        內容僅供參考，出發前請以主辦單位官方公告為準。
        {lastUpdated && (
          <>
            <br />
            最後更新 {formatFullDate(lastUpdated)}
          </>
        )}
      </p>
    </div>
  );
}
