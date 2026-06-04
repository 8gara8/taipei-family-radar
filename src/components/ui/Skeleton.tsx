import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** 載入骨架的基礎方塊：柔色底＋脈動動畫。 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-[8px] bg-[color-mix(in_srgb,var(--color-border)_55%,white)]",
        className,
      )}
    />
  );
}

/** 活動卡片骨架，對應 EventCard default 版面。 */
export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <Skeleton className="h-20 w-20 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
          <Skeleton className="h-5 w-12 rounded-[var(--radius-pill)]" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
