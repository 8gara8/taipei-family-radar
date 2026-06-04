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
    <div>
      <header className="mb-6">
        <p className="mb-1 text-sm font-semibold text-[var(--color-primary)]">
          全部活動
        </p>
        <h1 className="text-3xl font-bold sm:text-[32px]">瀏覽所有活動</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
          所有上雷達的活動，可依利基、類型、是否免費、週末、親子適合度與行政區篩選，找到最適合你家的那一場。
        </p>
      </header>

      {events.length > 0 ? (
        <EventsExplorer events={events} />
      ) : (
        <EmptyState
          title="目前沒有上雷達的活動"
          description="代理人每週更新內容，過幾天再回來看看吧。"
          nextUpdate={formatNextUpdate()}
          action={{ href: "/", label: "回本週精選" }}
        />
      )}
    </div>
  );
}
