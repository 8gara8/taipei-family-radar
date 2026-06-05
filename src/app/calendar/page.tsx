import type { Metadata } from "next";
import { CalendarMonth } from "@/components/features/CalendarMonth";
import { EmptyState } from "@/components/layout/EmptyState";
import { getAllEvents, getUpcomingEvents } from "@/lib/data";
import { formatNextUpdate, todayISO } from "@/lib/utils";

export const metadata: Metadata = { title: "月曆" };

export default function CalendarPage() {
  const events = getAllEvents();
  const today = todayISO();

  // 預設月份：今天所在月；若當月沒有活動，跳到最近一筆即將到來活動的月份。
  const upcoming = getUpcomingEvents();
  const currentMonth = today.slice(0, 7);
  // 跨月活動也算「本月有活動」：start 月 ≤ 本月 ≤ end 月
  // （CalendarMonth 會在活動橫跨的每一天渲染，含從上個月延續進來的）。
  const hasEventsThisMonth = events.some(
    (e) =>
      e.startDate.slice(0, 7) <= currentMonth &&
      (e.endDate ?? e.startDate).slice(0, 7) >= currentMonth,
  );
  const initialMonth =
    hasEventsThisMonth || upcoming.length === 0
      ? currentMonth
      : upcoming[0].startDate.slice(0, 7);

  return (
    <div className="px-4 pt-2">
      {events.length > 0 ? (
        <CalendarMonth
          events={events}
          initialMonth={initialMonth}
          todayISO={today}
        />
      ) : (
        <EmptyState
          title="目前沒有上雷達的活動"
          description="代理人每週更新內容，過幾天再回來看看月曆吧。"
          nextUpdate={formatNextUpdate()}
          action={{ href: "/", label: "回今天" }}
        />
      )}
    </div>
  );
}
