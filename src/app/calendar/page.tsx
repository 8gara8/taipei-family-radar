import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "月曆" };

export default function CalendarPage() {
  return (
    <ComingSoon
      title="互動月曆"
      phase="Phase 2"
      description="所有上雷達的活動將依日期分佈在月曆上，點選日期即可查看當天清單。"
    />
  );
}
