"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordNavigation } from "@/lib/nav-history";

/**
 * 記錄站內導覽次數（每次 pathname 變動 +1，含初次掛載）。
 * 供活動詳情返回鈕判斷能否安全 router.back()。不渲染任何內容。
 */
export function NavHistoryTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordNavigation();
  }, [pathname]);
  return null;
}
