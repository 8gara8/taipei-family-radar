"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  label: string;
}

const TABS: TabItem[] = [
  { href: "/", label: "本週精選" },
  { href: "/calendar", label: "月曆" },
  { href: "/events", label: "全部活動" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 主頁籤（本週精選／月曆／全部活動），當前頁籤以 primary 底線標示。 */
export function Tabs() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="flex items-center gap-1" aria-label="主要導覽">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-3 py-3 text-sm font-medium transition-colors",
              active
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
            )}
          >
            {tab.label}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
