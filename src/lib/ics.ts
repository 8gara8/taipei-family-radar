// 純前端 .ics（iCalendar）產生器：在裝置上觸發「加入行事曆」。
// 不需後端/API；輸出時間以台北時區（Asia/Taipei）標註，避免被行事曆 App 位移。
// 規格依 RFC 5545。

export interface IcsEventParams {
  title: string;
  startDate: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD"（跨日）
  startTime?: string; // "HH:MM"（24h）— 省略則為整日活動
  venue: string;
  address?: string;
  sourceUrl: string;
  eventPageUrl: string; // 本站活動詳情 URL
}

const PRODID = "-//TaipeiFamily Radar//EN";
const TZID = "Asia/Taipei";

/** "2026-06-19" → "20260619"。 */
function compactDate(iso: string): string {
  return iso.replace(/-/g, "");
}

/** 在 YYYY-MM-DD 上加減天數，回傳 compact "YYYYMMDD"（以 UTC 運算，避免伺服器時區影響）。 */
function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * 將 date + "HH:MM" 視為本地（台北）牆鐘時間並加上小時數，
 * 回傳 { date: "YYYYMMDD", time: "HHMMSS" }。以 UTC 元件運算避免時區位移。
 */
function addHours(
  iso: string,
  hhmm: string,
  hours: number,
): { date: string; time: string } {
  const [y, m, d] = iso.split("-").map(Number);
  const [h, min] = hhmm.split(":").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, h, min));
  dt.setUTCHours(dt.getUTCHours() + hours);
  const s = dt.toISOString();
  return {
    date: s.slice(0, 10).replace(/-/g, ""),
    time: s.slice(11, 16).replace(":", "") + "00",
  };
}

/** RFC 5545 文字逸出：\\ ; , 與換行。 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** 單字元的 UTF-8 位元組長度（行折疊以 octet 計，CJK 需正確計數）。 */
function utf8Len(ch: string): number {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp <= 0x7f) return 1;
  if (cp <= 0x7ff) return 2;
  if (cp <= 0xffff) return 3;
  return 4;
}

/** RFC 5545 行折疊：每行至多 75 octets，續行以單一空白起首；不切斷多位元組字元。 */
function foldLine(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const chBytes = utf8Len(ch);
    if (bytes + chBytes > 75) {
      parts.push(current);
      current = " " + ch; // 續行前導空白計入 75 octets
      bytes = 1 + chBytes;
    } else {
      current += ch;
      bytes += chBytes;
    }
  }
  parts.push(current);
  return parts.join("\r\n");
}

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:STANDARD",
  "DTSTART:19700101T000000",
  "TZOFFSETFROM:+0800",
  "TZOFFSETTO:+0800",
  "TZNAME:CST",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/** 由參數產生完整 .ics 內容字串。 */
export function generateIcs(params: IcsEventParams): string {
  const {
    title,
    startDate,
    endDate,
    startTime,
    venue,
    address,
    sourceUrl,
    eventPageUrl,
  } = params;

  const isMultiDay = !!endDate && endDate !== startDate;
  const dtLines: string[] = [];

  if (startTime) {
    // 定時活動：以台北時區標註。
    const start = `${compactDate(startDate)}T${startTime.replace(":", "")}00`;
    dtLines.push(`DTSTART;TZID=${TZID}:${start}`);
    // 結束：跨日則落在結束日；單日預設 +2 小時。
    const endBase = isMultiDay ? endDate! : startDate;
    const { date, time } = addHours(endBase, startTime, 2);
    dtLines.push(`DTEND;TZID=${TZID}:${date}T${time}`);
  } else {
    // 整日活動：iCal 的整日 DTEND 為「不含」（exclusive），故 +1 天。
    dtLines.push(`DTSTART;VALUE=DATE:${compactDate(startDate)}`);
    const endExclusive = addDays(endDate ?? startDate, 1);
    dtLines.push(`DTEND;VALUE=DATE:${endExclusive}`);
  }

  const location = address ? `${venue}，${address}` : venue;
  const uid = `${eventPageUrl.split("/").pop() || "event"}@taipei-family-radar`;
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "") ;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    ...dtLines,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(`來源：${sourceUrl}`)}`,
    `URL:${eventPageUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n");
}

/** 產生 Blob 並觸發下載；iOS Safari → 行事曆、Android Chrome → Google 日曆。 */
export function downloadIcs(params: IcsEventParams, filename: string): void {
  const icsContent = generateIcs(params);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
