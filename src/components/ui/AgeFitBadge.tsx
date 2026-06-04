import type { AgeFit } from "@/lib/types";
import { Pill } from "./Pill";

interface AgeFitBadgeProps {
  fit: AgeFit;
  reason?: string;
}

const FIT_META: Record<
  AgeFit,
  { label: string; bg: string; text: string }
> = {
  great: { label: "很適合", bg: "var(--agefit-great)", text: "#ffffff" },
  ok: { label: "可考慮", bg: "var(--agefit-ok)", text: "#1f2421" },
  older: { label: "大小孩", bg: "var(--agefit-older)", text: "#ffffff" },
};

/** 親子適合度徽章。great→綠、ok→琥珀、older→灰；有 reason 時以 tooltip 顯示。 */
export function AgeFitBadge({ fit, reason }: AgeFitBadgeProps) {
  const meta = FIT_META[fit];
  return (
    <Pill title={reason} style={{ backgroundColor: meta.bg, color: meta.text }}>
      {meta.label}
    </Pill>
  );
}
