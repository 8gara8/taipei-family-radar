import { Skeleton } from "@/components/ui/Skeleton";

/** 月曆載入骨架。 */
export default function CalendarLoading() {
  return (
    <div className="px-4 pt-2">
      <div className="mb-3.5 flex items-center justify-between px-1">
        <Skeleton className="h-7 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-[10px]" />
          <Skeleton className="h-8 w-8 rounded-[10px]" />
        </div>
      </div>
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="h-[340px] w-full rounded-[12px]" />
    </div>
  );
}
