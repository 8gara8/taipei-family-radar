"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { canGoBackInApp } from "@/lib/nav-history";

/**
 * 活動詳情頭部的返回鈕（左上圓形）。發生過站內導覽時返回上一頁，
 * 否則（深連結／外部開啟／直接輸入網址）回到全部活動列表，避免離開 App。
 */
export function BackButton() {
  const router = useRouter();
  const onClick = () => {
    if (canGoBackInApp()) router.back();
    else router.push("/events");
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="返回"
      className="absolute left-4 z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full text-[var(--color-text)] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      style={{
        top: "calc(env(safe-area-inset-top) + 14px)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <ChevronLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}
