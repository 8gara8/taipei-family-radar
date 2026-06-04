import Link from "next/link";
import { Radar } from "lucide-react";
import { Tabs } from "./Tabs";

/** 頂部導覽：品牌 + 主頁籤 + About 連結。置中、sticky。 */
export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 py-3 font-bold"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Radar className="h-5 w-5" aria-hidden />
            </span>
            <span className="hidden sm:inline">台北親子活動雷達</span>
          </Link>
          <Tabs />
        </div>
        <Link
          href="/about"
          className="py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          關於
        </Link>
      </div>
    </header>
  );
}
