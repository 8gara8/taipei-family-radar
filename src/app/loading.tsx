import { EventCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

/** 首頁載入骨架。 */
export default function HomeLoading() {
  return (
    <div className="px-[18px] pt-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-2 h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-28 w-full rounded-[var(--radius-card-lg)]" />
      <Skeleton className="mt-6 mb-3 h-6 w-28" />
      <div className="grid gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
