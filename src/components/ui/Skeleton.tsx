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
    <div className="flex gap-3 rounded-[var(--radius-card-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
      <Skeleton className="h-14 w-14 shrink-0 rounded-[14px]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1.5 pt-0.5">
          <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
          <Skeleton className="h-5 w-12 rounded-[var(--radius-pill)]" />
        </div>
      </div>
    </div>
  );
}
