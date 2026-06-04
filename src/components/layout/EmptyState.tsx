import Link from "next/link";
import { ArrowRight, CalendarSearch } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  /** 下次更新日（如有，顯示「下次更新：…」一行）。 */
  nextUpdate?: string;
  /** 行動按鈕（如「看即將到來」連結）。 */
  action?: { href: string; label: string };
  icon?: ReactNode;
  className?: string;
}

/**
 * 空狀態：本週／當日無適合活動時顯示。
 * 可附下次更新日與一個導引連結（如「即將到來」）。
 */
export function EmptyState({
  title,
  description,
  nextUpdate,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, white)",
          color: "var(--color-primary)",
        }}
      >
        {icon ?? <CalendarSearch className="h-6 w-6" />}
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {nextUpdate && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          下次更新：{nextUpdate}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-sm font-medium text-white transition"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
