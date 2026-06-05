// 利基（stream）的共用視覺中繼資料：標籤、簡稱、主色（CSS 變數）。
// 單一事實來源，供 StreamDot／StreamChip／行事曆圓點／來源清單共用。
import type { Stream } from "./types";

export interface StreamMeta {
  label: string;
  short: string;
  /** 主色：對應 globals.css 的 --color-stream-*。 */
  color: string;
}

export const STREAM_META: Record<Stream, StreamMeta> = {
  cultural: { label: "文化機構", short: "文化", color: "var(--color-stream-cultural)" },
  outdoor: { label: "戶外表演", short: "戶外", color: "var(--color-stream-outdoor)" },
};
