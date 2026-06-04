import type { Category } from "@/lib/types";
import { Pill } from "./Pill";

interface CategoryTagProps {
  category: Category;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  music: "音樂",
  dance: "舞蹈",
  performance: "表演",
  competition: "比賽",
  film: "影展",
  workshop: "工作坊",
  market: "市集",
  festival: "節慶",
  exhibition: "展覽",
  other: "其他",
};

/** 類型標籤，中性灰底。 */
export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <Pill className="bg-[color-mix(in_srgb,var(--color-border)_45%,white)] text-[var(--color-text-secondary)]">
      {CATEGORY_LABEL[category]}
    </Pill>
  );
}
