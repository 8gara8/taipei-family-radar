import type { Metadata } from "next";
import { EventsExplorer } from "@/components/features/EventsExplorer";
import { EmptyState } from "@/components/layout/EmptyState";
import { getAllEvents } from "@/lib/data";
import { formatNextUpdate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "全部活動",
  description:
    "依利基、類型、免費、週末、適合度與行政區，篩選大台北所有上雷達的親子活動。",
};

export default function EventsPage() {
  const events = getAllEvents();

  return (
    <div className="px-[18px] pt-2">
      <h1 className="mb-3.5 text-[22px] font-black">全部活動</h1>

      {events.length > 0 ? (
        <EventsExplorer events={events} />
      ) : (
        <EmptyState
          title="目前沒有上雷達的活動"
          description="代理人每週更新內容，過幾天再回來看看吧。"
          nextUpdate={formatNextUpdate()}
          action={{ href: "/", label: "回今天" }}
        />
      )}
    </div>
  );
}
