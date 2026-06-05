"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, Home, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "今天", Icon: Home },
  { href: "/calendar", label: "月曆", Icon: CalendarDays },
  { href: "/events", label: "全部", Icon: Compass },
  { href: "/about", label: "關於", Icon: Info },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href;
}

/**
 * 固定底部導覽（4 分頁）。行動優先、單手好按（每項 ≥44px）。
 * 進入活動詳情（/events/[id]）的全螢幕視圖時自動隱藏。
 */
export function BottomNav() {
  const pathname = usePathname() ?? "/";

  // 活動詳情為全螢幕推入視圖，隱藏底部導覽。
  if (pathname.startsWith("/events/")) return null;

  return (
    <nav
      aria-label="主要導覽"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[480px] border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-2.5 transition-colors",
              active
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)]",
            )}
          >
            <Icon
              className={cn("h-[22px] w-[22px]", !active && "opacity-70")}
              strokeWidth={active ? 2.4 : 2}
              aria-hidden
            />
            <span
              className={cn(
                "text-[10.5px] leading-none",
                active ? "font-extrabold" : "font-semibold",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
