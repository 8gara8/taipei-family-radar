import type { Stream } from "@/lib/types";
import { Pill } from "./Pill";

interface StreamChipProps {
  stream: Stream;
}

const STREAM_META: Record<Stream, { label: string; color: string }> = {
  cultural: { label: "文化機構", color: "var(--stream-cultural)" },
  outdoor: { label: "戶外表演", color: "var(--stream-outdoor)" },
};

/** 利基標籤。A=文化機構（藍）、B=戶外表演（珊瑚）；柔色底＋色點。 */
export function StreamChip({ stream }: StreamChipProps) {
  const meta = STREAM_META[stream];
  return (
    <Pill
      style={{
        backgroundColor: `color-mix(in srgb, ${meta.color} 14%, white)`,
        color: meta.color,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </Pill>
  );
}
