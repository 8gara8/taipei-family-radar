import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  return <EventDetail event={event} />;
}
