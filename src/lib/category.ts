// 類型（category）的共用視覺中繼資料：中文標籤、佔位 emoji、縮圖底色。
// 單一事實來源，供 EventCard 縮圖、活動詳情頁頭、篩選與行事曆共用。
import type { Category } from "./types";

export interface CategoryMeta {
  label: string;
  /** 無來源圖時的佔位 emoji（同時用於縮圖與詳情頁頭）。 */
  emoji: string;
  /** 縮圖／詳情頁頭的柔色底（per-category tint）。 */
  tint: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  music: { label: "音樂", emoji: "🎵", tint: "#fde9d6" },
  dance: { label: "舞蹈", emoji: "🕺", tint: "#f6e2ef" },
  performance: { label: "表演", emoji: "🎭", tint: "#e7ecfa" },
  competition: { label: "比賽", emoji: "🏆", tint: "#fcecd0" },
  film: { label: "影展", emoji: "🎬", tint: "#e6eef0" },
  workshop: { label: "工作坊", emoji: "🧩", tint: "#e6f2ec" },
  market: { label: "市集", emoji: "🧺", tint: "#f3ecdd" },
  festival: { label: "節慶", emoji: "🎉", tint: "#fbe6e1" },
  exhibition: { label: "展覽", emoji: "🖼️", tint: "#eceaf4" },
  other: { label: "其他", emoji: "✨", tint: "#eef0ee" },
};

/** 類型 → 中文標籤（沿用既有 key，供篩選等以標籤顯示）。 */
export const CATEGORY_LABEL: Record<Category, string> = Object.fromEntries(
  (Object.keys(CATEGORY_META) as Category[]).map((c) => [
    c,
    CATEGORY_META[c].label,
  ]),
) as Record<Category, string>;
