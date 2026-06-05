import { Pill } from "./Pill";

interface FreeBadgeProps {
  isFree: boolean;
  priceNote?: string;
}

/** 免費→綠底「免費」；否則顯示票價說明（無則「需購票」）。 */
export function FreeBadge({ isFree, priceNote }: FreeBadgeProps) {
  if (isFree) {
    return (
      <Pill
        className="font-bold"
        style={{ backgroundColor: "#e6f4ef", color: "var(--color-primary-dark)" }}
      >
        免費
      </Pill>
    );
  }
  return (
    <Pill className="bg-[color-mix(in_srgb,var(--color-border)_45%,white)] text-[var(--color-text-secondary)]">
      {priceNote ?? "需購票"}
    </Pill>
  );
}
