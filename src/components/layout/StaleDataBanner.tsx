import { AlertTriangle } from "lucide-react";

interface StaleDataBannerProps {
  days: number;
  className?: string;
}

/**
 * 淡琥珀提示條：資料距上次更新已超過門檻天數時顯示。
 * 由 WeekDigestHeader 等在 lastUpdated 距今 > 8 天時掛上。
 */
export function StaleDataBanner({ days, className }: StaleDataBannerProps) {
  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-sm ${className ?? ""}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-warning) 12%, white)",
        borderColor: "color-mix(in srgb, var(--color-warning) 35%, white)",
        color: "var(--color-primary-dark)",
      }}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
      <span>資料可能未更新（上次更新 {days} 天前）。</span>
    </div>
  );
}
