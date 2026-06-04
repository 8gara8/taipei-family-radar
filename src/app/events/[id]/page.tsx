import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventDetail } from "@/components/features/EventDetail";
import { getAllEvents, getEventById } from "@/lib/data";

export function generateStaticParams() {
  return getAllEvents().map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return { title: "找不到活動" };
  return { title: event.title, description: event.summary };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        回本週精選
      </Link>

      <div className="mt-4">
        <EventDetail event={event} />
      </div>
    </article>
  );
}
