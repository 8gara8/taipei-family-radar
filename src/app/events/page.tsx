import type { Metadata } from "next";
import { EventsExplorer } from "@/components/features/EventsExplorer";
import { EmptyState } from "@/components/layout/EmptyState";
import { getAllEvents } from "@/lib/data";
import { formatNextUpdate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "全部活動",
  description:
    "依主題、類型、免費、週末、適合度與行政區，篩選台北、新北、基隆所有上雷達的親子活動。",
};

export default function EventsPage() {
  const events = getAllEvents();
  // 「全部活動」呈現即將到來的活動。若無任何即將到來者（即使近 28 天內仍有
  // 剛結束的活動），改顯示明確的空狀態，而非讓篩選列出現「無符合」的誤導畫面；
  // 最近結束的活動仍可從月曆回顧。
  const hasUpcoming = events.some((e) => e.status === "upcoming");

  return (
    <div className="px-[18px] pt-2">
      <h1 className="mb-3.5 text-[22px] font-black">全部活動</h1>

      {hasUpcoming ? (
        <EventsExplorer events={events} />
      ) : (
        <EmptyState
          title="目前沒有即將到來的活動"
          description={
            events.length > 0
              ? "近期的活動都結束了。每週自動更新內容，過幾天再回來看看，或到月曆回顧最近的活動。"
              : "每週自動更新內容，過幾天再回來看看吧。"
          }
          nextUpdate={formatNextUpdate()}
          action={{ href: "/calendar", label: "看月曆" }}
        />
      )}
    </div>
  );
}
