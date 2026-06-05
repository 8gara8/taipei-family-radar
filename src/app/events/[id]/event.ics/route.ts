import { getAllEvents, getEventById } from "@/lib/data";
import { generateIcs } from "@/lib/ics";

// 以真實 .ics 回應（text/calendar）取代純前端 data: URI：
// iOS Safari 會封鎖 window.open 的頂層 data: 導覽，需由伺服器提供真正的
// .ics URL 才能交給「行事曆」App。Android/桌面瀏覽器則直接下載。
// 活動於建置期已知，故與 page.tsx 相同走靜態預渲染。
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEvents().map((event) => ({ id: event.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  // eventPageUrl 用站內相對路徑即可：產生的 .ics 內 URL 欄位非關鍵且避免硬編網域。
  const icsContent = generateIcs({
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    venue: event.venue,
    address: event.address,
    sourceUrl: event.sourceUrl,
    eventPageUrl: `/events/${event.id}`,
  });

  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.id}.ics"`,
    },
  });
}
