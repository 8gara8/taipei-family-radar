import { Skeleton } from "@/components/ui/Skeleton";

/** 月曆載入骨架。 */
export default function CalendarLoading() {
  return (
    <div>
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-[520px] w-full rounded-[var(--radius-card)]" />
    </div>
  );
}
