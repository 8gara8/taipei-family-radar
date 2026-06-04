import { CheckCircle2, CircleSlash, ExternalLink, MinusCircle } from "lucide-react";
import type { Source, SourceType } from "@/lib/types";
import { Pill } from "@/components/ui/Pill";
import { formatFullDate } from "@/lib/utils";

interface SourceListProps {
  sources: Source[];
}

const TYPE_LABEL: Record<SourceType, string> = {
  "gov-calendar": "官方行事曆",
  "cultural-institute": "文化／代表機構",
  aggregator: "活動匯整平台",
  venue: "場館／場地",
};

const STREAM_LABEL: Record<Source["stream"], string> = {
  cultural: "文化機構",
  outdoor: "戶外表演",
  both: "文化＋戶外",
};

const STATUS_META: Record<
  NonNullable<Source["lastStatus"]>,
  { label: string; color: string; Icon: typeof CheckCircle2 }
> = {
  ok: { label: "正常", color: "var(--color-success)", Icon: CheckCircle2 },
  partial: { label: "部分", color: "var(--color-warning)", Icon: MinusCircle },
  failed: { label: "失敗", color: "var(--color-error)", Icon: CircleSlash },
};

function StatusBadge({ status }: { status?: Source["lastStatus"] }) {
  if (!status) {
    return (
      <span className="text-xs text-[var(--color-text-secondary)]">尚未掃描</span>
    );
  }
  const { label, color, Icon } = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={{ color }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

/**
 * 掃描來源清單（About 頁）。
 * 列出每筆來源的名稱、類型、利基、最後掃描時間與狀態，名稱連到原始網站。
 */
export function SourceList({ sources }: SourceListProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sources.map((source) => (
        <li
          key={source.id}
          className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1 font-semibold transition-colors hover:text-[var(--color-primary)]"
            >
              <span>{source.name}</span>
              <ExternalLink
                className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-primary)]"
                aria-hidden
              />
            </a>
            <StatusBadge status={source.lastStatus} />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Pill className="bg-[color-mix(in_srgb,var(--color-border)_45%,white)] text-[var(--color-text-secondary)]">
              {TYPE_LABEL[source.type]}
            </Pill>
            <Pill className="bg-[color-mix(in_srgb,var(--color-border)_45%,white)] text-[var(--color-text-secondary)]">
              {STREAM_LABEL[source.stream]}
            </Pill>
          </div>

          <p className="text-xs text-[var(--color-text-secondary)]">
            {source.lastScannedAt
              ? `最後掃描：${formatFullDate(source.lastScannedAt)}`
              : "尚未掃描"}
          </p>
        </li>
      ))}
    </ul>
  );
}
