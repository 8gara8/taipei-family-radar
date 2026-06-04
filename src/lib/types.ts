// 核心資料型別與列舉。事實來源為 repo 內 data/*.json，build 時靜態載入。
// 對應的 runtime 驗證見 src/lib/schema.ts（zod）。

export type Stream = "cultural" | "outdoor"; // A=文化機構, B=戶外表演

export type Category =
  | "music"
  | "dance"
  | "performance"
  | "competition"
  | "film"
  | "workshop"
  | "market"
  | "festival"
  | "exhibition"
  | "other";

export type AgeFit = "great" | "ok" | "older"; // 很適合 / 可考慮 / 較適合大小孩

export type EventStatus = "upcoming" | "past";

export interface Event {
  id: string; // 由 sourceName|title|startDate 產生的 slug 雜湊（去重鍵）
  title: string; // 中文標題
  titleOriginal?: string; // 原文名稱（法/德/英…），保留
  stream: Stream;
  category: Category;
  organizer?: string; // 如「歌德學院（台北）」「中正紀念堂」
  venue: string; // 場地名稱
  address?: string;
  area?: string; // 行政區，如「台北市中正區」「新北市板橋區」（篩選用）
  lat?: number;
  lng?: number;
  startDate: string; // ISO 8601 date：YYYY-MM-DD
  endDate?: string; // 跨日活動結束日
  startTime?: string; // "14:00"（24h）
  isFree: boolean;
  priceNote?: string; // 票價說明
  ageFit: AgeFit;
  ageFitReason: string; // 一句話理由（繁中），≤ 60 字
  summary: string; // Markdown，親子視角簡介，2–4 句
  sourceName: string; // 對應 sources.json 的某筆 name
  sourceUrl: string; // 原始出處（必填）
  registrationUrl?: string; // 報名連結
  imageUrl?: string; // 來源圖（可用才填，否則前端用 category 佔位）
  tags?: string[]; // 自由標籤：「室內」「需報名」「親子限定」等
  status: EventStatus; // 由 normalize 依日期計算，代理人可不填
  discoveredAt: string; // ISO datetime，首次掃描到
  weekFound: string; // 發現週次 "2026-W23"，驅動「本週精選」
}

export type SourceType =
  | "gov-calendar"
  | "cultural-institute"
  | "aggregator"
  | "venue";

export interface Source {
  id: string;
  name: string; // 對應 Event.sourceName
  type: SourceType;
  stream: Stream | "both";
  url: string;
  lastScannedAt?: string; // 代理人每週寫入
  lastStatus?: "ok" | "partial" | "failed";
}

export interface WeeklyDigest {
  weekOf: string; // "2026-W23"
  intro: string; // Markdown，代理人寫的本週一段話
  highlightEventIds: string[];
}
