import type { AgeFit } from "@/lib/types";
import { Pill } from "./Pill";

interface AgeFitBadgeProps {
  fit: AgeFit;
  reason?: string;
}

/** 適合度徽章樣式：柔色底＋同色系深色字（見 SPEC Design Tokens）。 */
const FIT_META: Record<AgeFit, { label: string; bg: string; text: string }> = {
  great: { label: "👶 很適合", bg: "#e6f4ef", text: "#2f9e7e" },
  ok: { label: "可考慮", bg: "#fbf1d8", text: "#b5810a" },
  older: { label: "大小孩", bg: "#eef0ee", text: "#6f7d75" },
};

/** 親子適合度徽章。great→綠、ok→琥珀、older→灰；有 reason 時以 tooltip 顯示。 */
export function AgeFitBadge({ fit, reason }: AgeFitBadgeProps) {
  const meta = FIT_META[fit];
  return (
    <Pill
      title={reason}
      className="font-bold"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      {meta.label}
    </Pill>
  );
}
