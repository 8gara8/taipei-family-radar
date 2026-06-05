import type { Stream } from "@/lib/types";
import { STREAM_META } from "@/lib/stream";

interface StreamDotProps {
  stream: Stream;
}

/**
 * 利基「色點＋標籤」：小色點加上以利基主色著色的文字。
 * 用於卡片 meta 列、行事曆圖例與活動詳情徽章列（取代較重的 pill 樣式）。
 */
export function StreamDot({ stream }: StreamDotProps) {
  const meta = STREAM_META[stream];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
      style={{ color: meta.color }}
    >
      <span
        aria-hidden
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}
