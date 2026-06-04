import { EventCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

/** 首頁載入骨架。 */
export default function HomeLoading() {
  return (
    <div>
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-xl" />
      </div>
      <Skeleton className="mb-3 h-6 w-24" />
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
