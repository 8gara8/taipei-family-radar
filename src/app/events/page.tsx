import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "全部活動" };

export default function EventsPage() {
  return (
    <ComingSoon
      title="全部活動"
      phase="Phase 3"
      description="可依利基、類型、免費、週末、適合度與行政區篩選所有活動。目前可先在「本週精選」瀏覽近期活動。"
    />
  );
}
