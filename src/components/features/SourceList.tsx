import type { Source, SourceType } from "@/lib/types";
import { STREAM_META } from "@/lib/stream";
import { cn } from "@/lib/utils";

interface SourceListProps {
  sources: Source[];
}

const TYPE_LABEL: Record<SourceType, string> = {
  "gov-calendar": "政府網站",
  "cultural-institute": "駐台文化機構",
  aggregator: "活動平台",
  venue: "場地",
};

const STATUS_COLOR: Record<NonNullable<Source["lastStatus"]>, string> = {
  ok: "var(--color-success)",
  partial: "var(--color-warning)",
  failed: "var(--color-error)",
};

const STATUS_LABEL: Record<NonNullable<Source["lastStatus"]>, string> = {
  ok: "正常",
  partial: "部分資料",
  failed: "失敗",
};

function streamLabel(stream: Source["stream"]): string {
  return stream === "both" ? "綜合" : STREAM_META[stream].short;
}

/**
 * 掃描來源清單（About 頁）：白底卡片內以分隔線排列各來源。
 * 每列＝狀態色點 ＋ 名稱 ＋「來源類型 · 主題」副標 ＋ 連到原站的 ↗。
 */
export function SourceList({ sources }: SourceListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {sources.map((source, i) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex items-center gap-3 px-3.5 py-3 transition hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)]",
            i > 0 && "border-t border-[var(--color-border)]",
          )}
        >
          <span
            aria-hidden
            title={source.lastStatus ? STATUS_LABEL[source.lastStatus] : "尚未掃描"}
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: source.lastStatus
                ? STATUS_COLOR[source.lastStatus]
                : "#c7c1b6",
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold text-[var(--color-text)]">
              {source.name}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--color-text-secondary)]">
              {TYPE_LABEL[source.type]} · {streamLabel(source.stream)}
            </p>
          </div>
          <span
            aria-hidden
            className="text-base text-[#c7c1b6] transition-colors group-hover:text-[var(--color-primary)]"
          >
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}
