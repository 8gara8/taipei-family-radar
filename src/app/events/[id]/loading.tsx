import { Skeleton } from "@/components/ui/Skeleton";

/** 活動詳情載入骨架（全螢幕推入視圖）。 */
export default function EventDetailLoading() {
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col bg-[var(--color-bg)]">
      <Skeleton className="h-[190px] w-full rounded-none" />
      <div className="space-y-3 px-5 pt-4">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-[var(--radius-pill)]" />
          <Skeleton className="h-5 w-16 rounded-[var(--radius-pill)]" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full rounded-[14px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
