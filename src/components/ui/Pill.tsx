import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/** 基礎 pill：圓角膠囊樣式，供各種 badge / chip 共用。 */
export function Pill({ children, className, style, title }: PillProps) {
  return (
    <span
      title={title}
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium leading-5 whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}
