import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";

interface ComingSoonProps {
  title: string;
  phase: string;
  description: string;
}

/**
 * 階段性占位頁：在對應功能（月曆／全部活動／關於）完成前，
 * 讓導覽不會連到 404。完整內容見各自 Phase。
 */
export function ComingSoon({ title, phase, description }: ComingSoonProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <span
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-accent) 16%, white)",
          color: "var(--color-accent)",
        }}
      >
        <Hammer className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">
        {phase} 建置中
      </p>
      <p className="mt-3 max-w-md text-[var(--color-text-secondary)]">
        {description}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        回本週精選
      </Link>
    </div>
  );
}
