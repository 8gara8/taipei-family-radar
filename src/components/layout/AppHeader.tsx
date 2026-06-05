"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar } from "lucide-react";

/**
 * 精簡品牌列：置頂 sticky，僅顯示品牌標記。
 * 主要導覽改由底部 BottomNav 負責；進入活動詳情全螢幕視圖時隱藏。
 */
export function AppHeader() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/events/")) return null;

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-end justify-center border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] pb-2 backdrop-blur">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-black text-[var(--color-primary)]"
      >
        <span
          aria-hidden
          className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Radar className="h-3.5 w-3.5" />
        </span>
        親子活動雷達
      </Link>
    </header>
  );
}
