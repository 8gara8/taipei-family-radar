import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "關於與來源" };

export default function AboutPage() {
  return (
    <ComingSoon
      title="關於與來源"
      phase="Phase 3"
      description="將列出每週掃描的資料來源清單與最後更新狀態，說明本站的內容如何產生。"
    />
  );
}
