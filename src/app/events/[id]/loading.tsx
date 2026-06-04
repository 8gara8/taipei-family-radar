import { Skeleton } from "@/components/ui/Skeleton";

/** 活動詳情載入骨架。 */
export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-24" />
      <div className="mt-4 flex gap-1.5">
        <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
        <Skeleton className="h-5 w-12 rounded-[var(--radius-pill)]" />
        <Skeleton className="h-5 w-12 rounded-[var(--radius-pill)]" />
      </div>
      <Skeleton className="mt-3 h-9 w-3/4" />
      <div className="mt-5 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="mt-5 h-16 w-full rounded-[var(--radius-card)]" />
      <div className="mt-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
