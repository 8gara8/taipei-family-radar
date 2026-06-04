# Taipei Family Radar（台北親子活動雷達）— SPEC.md

> Technical build specification for Claude Code. This document is self-contained — everything needed to build the project is here.

**Version:** 1.0
**Design Doc:** `taipei-family-radar-design-doc-v1.md`（v1.1, 2026-06-04）
**Date:** 2026-06-04

---

## 1. Project Overview

一個自動更新的「台北親子活動雷達」靜態網站。內容由一個每週執行的 Claude 代理人（Claude Cowork Scheduler）產生：研究兩條利基資料線 —（A）各國駐台文化／代表機構的節慶與文化活動；（B）戶外表演（中正紀念堂、大安森林公園露天音樂台、兩廳院藝文廣場、華山、松菸、市民廣場等）— 篩出適合帶 4 歲與 2 歲幼兒參加的活動，寫入 repo 內的 JSON，push 到 GitHub 後由 Vercel 自動部署。

地理範圍：大台北（台北市為主，含新北市）。UI 純繁體中文，活動保留原文名。網站無後端、無資料庫、無登入；私人先用、設計上可隨時公開。

**Key features**
- 本週精選（This Week）：本週新研究到／即將發生的活動，含親子適合度徽章。
- 互動月曆（Calendar）：所有上雷達活動依日期分佈，點日期看當天清單。
- 全部活動（All Events）：可依利基／類型／免費／週末／適合度／行政區篩選。
- 關於與來源（About）：列出掃描來源與最後更新狀態。

- **Primary domain:** 待定（初期用 Vercel 預設 `*.vercel.app`）
- **Repo:** `github.com/<you>/taipei-family-radar`（待建）

---

## 2. Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15（App Router） | 與 Vercel 零設定整合、支援 SSG、與既有 GitHub→Vercel 流程一致 |
| Language | TypeScript | 型別即文件，schema 清楚，減少代理人寫入髒資料的風險 |
| Styling | Tailwind CSS v4 + CSS 變數 | 快速、design token 用 CSS 變數集中管理 |
| Data | repo 內 JSON 檔（無 DB） | 資料量小（數十～數百筆）、可版本控管與 diff、零基礎設施、每週由代理人編輯 |
| Dates | date-fns | 週次計算、月曆格、過期判定 |
| Icons | lucide-react | 輕量、樹搖優化 |
| Hosting | Vercel | push main 自動部署，與內容流程天然契合 |
| Auth | 無 | 私人先用、公開就緒；不放私人資料 |
| Package Manager | pnpm | 快速、lockfile 穩定（npm 亦可，全程一致即可） |

### Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "date-fns": "^4.1.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.0",
  "lucide-react": "^0.460.0"
}
```

Dev：`typescript`、`@types/node`、`@types/react`、`tailwindcss@^4`、`tsx`（跑 scripts）、`zod`（資料驗證，見 §7）。

---

## 3. Repo Layout

```
taipei-family-radar/
├── public/
│   └── images/                  # 靜態圖（佔位圖、og image）
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根 layout：TopNav、字型、metadata、全域樣式
│   │   ├── page.tsx             # 「本週精選」首頁（預設）
│   │   ├── calendar/
│   │   │   └── page.tsx         # 月曆檢視
│   │   ├── events/
│   │   │   ├── page.tsx         # 全部活動（含篩選）
│   │   │   └── [id]/
│   │   │       └── page.tsx     # 活動詳情（generateStaticParams）
│   │   └── about/
│   │       └── page.tsx         # 關於與來源
│   ├── components/
│   │   ├── ui/                  # AgeFitBadge, StreamChip, CategoryTag, FreeBadge, Pill
│   │   ├── layout/              # TopNav, Tabs, StaleDataBanner, EmptyState
│   │   └── features/            # EventCard, EventDetail, CalendarMonth, DayDrawer,
│   │                            #   FilterBar, WeekDigestHeader, SourceList
│   ├── lib/
│   │   ├── types.ts             # Event / Source / WeeklyDigest 型別 + enums
│   │   ├── data.ts              # 讀取 data/*.json、衍生欄位、過濾 helper
│   │   ├── week.ts              # 週次 (YYYY-Www) 與「本週」判定
│   │   └── utils.ts             # cn() 等共用工具
│   └── styles/
│       └── globals.css          # Tailwind 指令 + design token CSS 變數
├── scripts/
│   └── normalize-data.ts        # prebuild：驗證 schema、計算 status、排序（見 §7）
├── data/
│   ├── events.json              # 活動（事實來源，代理人每週編輯）
│   ├── sources.json             # 掃描來源清單（About 頁 + 代理人讀取）
│   └── digests.json             # 每週摘要
├── prompts/
│   └── weekly-scan.md           # Claude Cowork 每週排程任務的研究指令
├── .github/workflows/
│   └── weekly-scan.yml          # （備援）GitHub Actions cron 版自動化
├── SPEC.md                      # 本檔
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts           # Tailwind v4 多用 CSS 設定，必要時保留
├── .env.example
└── README.md
```

---

## 4. Data Schemas

定義於 `src/lib/types.ts`，並用 `zod`（`src/lib/schema.ts`）在 prebuild 驗證。

### Event

```typescript
type Stream = "cultural" | "outdoor";          // A=文化機構, B=戶外表演
type Category =
  | "music" | "dance" | "performance" | "competition"
  | "film" | "workshop" | "market" | "festival" | "exhibition" | "other";
type AgeFit = "great" | "ok" | "older";         // 很適合 / 可考慮 / 較適合大小孩
type EventStatus = "upcoming" | "past";

interface Event {
  id: string;               // 由 sourceName|title|startDate 產生的 slug 雜湊（去重鍵）
  title: string;            // 中文標題（代理人整理）
  titleOriginal?: string;   // 原文名稱（法/德/英…），保留
  stream: Stream;
  category: Category;
  organizer?: string;       // 如「歌德學院（台北）」「中正紀念堂」
  venue: string;            // 場地名稱
  address?: string;
  area?: string;            // 行政區，如「台北市中正區」「新北市板橋區」（篩選用）
  lat?: number;
  lng?: number;
  startDate: string;        // ISO 8601 date：YYYY-MM-DD
  endDate?: string;         // 跨日活動結束日
  startTime?: string;       // "14:00"（24h）
  isFree: boolean;
  priceNote?: string;       // 票價說明
  ageFit: AgeFit;
  ageFitReason: string;     // 一句話理由（繁中），≤ 60 字
  summary: string;          // Markdown，親子視角簡介，2–4 句
  sourceName: string;       // 對應 sources.json 的某筆 name
  sourceUrl: string;        // 原始出處（必填）
  registrationUrl?: string; // 報名連結
  imageUrl?: string;        // 來源圖（可用才填，否則前端用 category 佔位）
  tags?: string[];          // 自由標籤：「室內」「需報名」「親子限定」等
  status: EventStatus;      // 由 normalize 依日期計算，代理人可不填
  discoveredAt: string;     // ISO datetime，首次掃描到
  weekFound: string;        // 發現週次 "2026-W23"，驅動「本週精選」
}
```

**Validation Rules**
- `id` 唯一；新增前以 `sourceName|title|startDate` 正規化後比對去重，已存在則更新欄位而非重複新增。
- `startDate` 必為合法日期；`endDate`（若有）≥ `startDate`。
- `sourceUrl` 必為 http(s) URL。
- `ageFit` ∈ enum；`ageFitReason` 非空。
- `status` 由 normalize 計算：今天 ≤（endDate ?? startDate）→ `upcoming`，否則 `past`。
- 渲染時排除 (endDate ?? startDate) 早於今天 28 天以上者（保留月曆回顧 4 週）。

**Example**
```json
{
  "id": "daanforestpark-org-tw-lu-tian-yin-le-tai-zhou-mo-jie-tou-yi-ren-2026-06-14",
  "title": "大安森林公園露天音樂台｜週末街頭藝人展演",
  "titleOriginal": null,
  "stream": "outdoor",
  "category": "performance",
  "organizer": "臺北市街頭藝人展演平台",
  "venue": "大安森林公園露天音樂台",
  "address": "台北市大安區新生南路二段1號",
  "area": "台北市大安區",
  "lat": 25.0331, "lng": 121.5353,
  "startDate": "2026-06-14",
  "startTime": "14:00",
  "isFree": true,
  "ageFit": "great",
  "ageFitReason": "戶外、免費、可隨進隨出，幼兒走動吵鬧也沒關係。",
  "summary": "週末午後在露天音樂台的街頭藝人表演，通常有音樂或雜耍。空間開闊、有草地，適合帶推車與小小孩待一個下午。",
  "sourceName": "大安森林公園之友基金會",
  "sourceUrl": "https://www.daanforestpark.org.tw/",
  "status": "upcoming",
  "discoveredAt": "2026-06-04T12:00:00+08:00",
  "weekFound": "2026-W23"
}
```

### Source

```typescript
type SourceType = "gov-calendar" | "cultural-institute" | "aggregator" | "venue";

interface Source {
  id: string;
  name: string;             // 對應 Event.sourceName
  type: SourceType;
  stream: Stream | "both";
  url: string;
  lastScannedAt?: string;   // 代理人每週寫入
  lastStatus?: "ok" | "partial" | "failed";
}
```

`data/sources.json` 初始種子（代理人掃描清單，亦供 About 頁顯示）：

```json
[
  { "id": "mofa-offices", "name": "外交部 駐台外國機構名錄", "type": "gov-calendar", "stream": "cultural", "url": "https://www.mofa.gov.tw/OfficesInROC.aspx" },
  { "id": "goethe-taipei", "name": "歌德學院（台北）德國文化中心", "type": "cultural-institute", "stream": "cultural", "url": "https://www.goethe.de/ins/tw/" },
  { "id": "france-taipei", "name": "法國在台協會 / Alliance Française", "type": "cultural-institute", "stream": "cultural", "url": "https://france-taipei.org/" },
  { "id": "ait", "name": "美國在台協會 AIT", "type": "cultural-institute", "stream": "cultural", "url": "https://www.ait.org.tw/" },
  { "id": "japan-exchange", "name": "日本台灣交流協會", "type": "cultural-institute", "stream": "cultural", "url": "https://www.koryu.or.jp/taipei/" },
  { "id": "cksmh", "name": "國立中正紀念堂（表演/其他活動）", "type": "venue", "stream": "outdoor", "url": "https://www.cksmh.gov.tw/" },
  { "id": "culture-event", "name": "全國藝文活動資訊系統", "type": "gov-calendar", "stream": "both", "url": "https://event.culture.tw/" },
  { "id": "yii-cksmh", "name": "小藝行事曆（中正紀念堂）", "type": "aggregator", "stream": "outdoor", "url": "https://yii.tw/taipei/calendar?place=cksmh" },
  { "id": "daan-foundation", "name": "大安森林公園之友基金會（公園好活動）", "type": "venue", "stream": "outdoor", "url": "https://www.daanforestpark.org.tw/" },
  { "id": "tpbusker", "name": "臺北市街頭藝人展演申請平台", "type": "venue", "stream": "outdoor", "url": "https://tpbusker.gov.taipei/" },
  { "id": "opentix", "name": "OPENTIX 兩廳院文化生活（藝文廣場）", "type": "aggregator", "stream": "outdoor", "url": "https://www.opentix.life/" },
  { "id": "huashan", "name": "華山 1914 文創園區", "type": "venue", "stream": "outdoor", "url": "https://www.huashan1914.com/" },
  { "id": "songshan", "name": "松山文創園區", "type": "venue", "stream": "outdoor", "url": "https://www.songshanculturalpark.org/" },
  { "id": "majorevent-taipei", "name": "臺北市大型群聚活動行事曆（市民廣場等）", "type": "gov-calendar", "stream": "both", "url": "https://majorevent.gov.taipei/" },
  { "id": "travel-taipei", "name": "台北旅遊網 活動", "type": "gov-calendar", "stream": "both", "url": "https://www.travel.taipei/zh-tw/event/calendar" },
  { "id": "ntpc-culture", "name": "新北市政府文化局 / 新北旅客活動", "type": "gov-calendar", "stream": "both", "url": "https://www.tourism.ntpc.gov.tw/" },
  { "id": "accupass", "name": "Accupass（親子/戶外）", "type": "aggregator", "stream": "both", "url": "https://www.accupass.com/" }
]
```

### WeeklyDigest

```typescript
interface WeeklyDigest {
  weekOf: string;            // "2026-W23"
  intro: string;            // Markdown，代理人寫的本週一段話
  highlightEventIds: string[];
}
```

`data/digests.json` 為 `WeeklyDigest[]`，最新一筆對應「本週精選」頁首。

### Relationships
- `Event.sourceName` → `Source.name`。
- `WeeklyDigest.highlightEventIds[]` → `Event.id`。
- 全部讀自 repo JSON，build 時靜態載入。

---

## 5. API Routes

**無。** 站點為純靜態（SSG）。資料於 build 時自 `data/*.json` 讀取；篩選與月曆互動在 client 端對已載入的事件陣列進行（資料量小，整包送到 client 可接受）。日後若資料量變大，再加 `app/api/events/route.ts` 做分頁，但 v1 不需要。

---

## 6. Component Specs

統一以 Tailwind class + §Appendix 的 design token CSS 變數（透過 `tailwind.config` 對應或直接用 `var(--token)`）。預設為 Server Component；標 (client) 者需 `"use client"`。

### EventCard
**File:** `src/components/features/EventCard.tsx`
```typescript
interface EventCardProps {
  event: Event;
  variant?: "default" | "compact" | "highlight";
  className?: string;
}
```
**Behavior:** 左側縮圖（無 `imageUrl` 時依 `category` 顯示 emoji/icon 佔位）；右上排 StreamChip + CategoryTag + AgeFitBadge；粗體中文標題，必要時下方小字 `titleOriginal`；下排 `venue · 格式化日期 · startTime` 與 FreeBadge。整張連結到 `/events/[id]`。`highlight` 變體左側加 `--color-accent` 色條。hover 浮起＋邊框轉 `--color-primary`。`compact` 為單行，供 DayDrawer 使用。
**Styling:** `rounded-[12px] bg-surface shadow-sm`，內距 `--space-4`。

### AgeFitBadge
**File:** `src/components/ui/AgeFitBadge.tsx`
```typescript
interface AgeFitBadgeProps { fit: AgeFit; reason?: string; }
```
`great`→綠「很適合」、`ok`→琥珀「可考慮」、`older`→灰「大小孩」。pill 樣式；有 `reason` 時 title/tooltip 顯示。

### StreamChip / CategoryTag / FreeBadge / Pill
**File:** `src/components/ui/*.tsx`。StreamChip 用 `--stream-cultural`(藍)／`--stream-outdoor`(珊瑚)，標示「文化機構」／「戶外表演」。CategoryTag 中性灰底，顯示類型中文。FreeBadge：`isFree` 顯示綠底「免費」，否則顯示 `priceNote`。

### WeekDigestHeader
**File:** `src/components/features/WeekDigestHeader.tsx`
```typescript
interface WeekDigestHeaderProps { digest?: WeeklyDigest; total: number; lastUpdated: string; }
```
顯示本週摘要（`intro`，markdown 轉純文字或簡單 render）、本週活動數、最後更新時間。`lastUpdated` 距今 > 8 天時，於上方掛 `<StaleDataBanner days={...} />`。

### CalendarMonth (client) + DayDrawer (client)
**File:** `src/components/features/CalendarMonth.tsx`, `DayDrawer.tsx`
```typescript
interface CalendarMonthProps { events: Event[]; initialMonth?: string; } // "2026-06"
```
date-fns 產生月格（含跨月補格）。每格顯示當天事件數的小圓點（依 stream 上色）。可左右換月。點某天 → `DayDrawer` 列出當天 `EventCard variant="compact"`。手機縮為精簡格 + 底部 drawer。

### FilterBar (client)
**File:** `src/components/features/FilterBar.tsx`
```typescript
interface FilterState {
  stream?: Stream; categories: Category[];
  freeOnly: boolean; weekendOnly: boolean;
  ageFit?: AgeFit; city?: "taipei" | "newTaipei"; district?: string;
}
interface FilterBarProps { events: Event[]; value: FilterState; onChange: (s: FilterState) => void; }
```
控制項：利基、類型（多選）、只看免費、只看週末（依 startDate 週六日）、適合度、城市＋行政區（由現有事件的 `area` 動態產生選項）。手機收進「篩選」按鈕展開。

### EventDetail
**File:** `src/components/features/EventDetail.tsx`
渲染完整 `summary`(markdown)、場地/地址/時間、AgeFitBadge＋理由、票價、`sourceUrl`／`registrationUrl` 連結。地圖：v1 用「在 Google 地圖開啟」連結（`https://www.google.com/maps/search/?api=1&query={lat},{lng}` 或 `query={address}`），不嵌入互動地圖、不需金鑰（嵌入式地圖列為日後選項）。

### TopNav / Tabs
**File:** `src/components/layout/TopNav.tsx`
品牌名 + 三頁籤（本週精選／月曆／全部活動）+ About 連結。當前頁籤用 `--color-primary` 底線。手機維持頁籤、About 收進選單。

### StaleDataBanner / EmptyState
**File:** `src/components/layout/*.tsx`。StaleDataBanner：淡琥珀提示條「資料可能未更新（上次更新 X 天前）」。EmptyState：本週無適合活動時顯示，附下次更新日與「即將到來」連結。

---

## 7. Build Scripts

### `scripts/normalize-data.ts`
**Purpose:** 在 build 前驗證並正規化 `data/events.json`：
1. 用 zod 驗證每筆 Event；不合法則 build 失敗並印出該筆 `id`。
2. 計算 `status`（依今日與 `endDate ?? startDate`）。
3. 去重（`id` 重複時保留 `discoveredAt` 較早者，合併較新欄位）。
4. 依 `startDate` 升冪排序。
5. 寫回 `data/events.json`（穩定格式，2-space 縮排）。

> 注意：**不在這裡刪除**逾期資料；逾 28 天的清除由每週代理人負責（見 §10），確保被清除的變更有 commit 紀錄。渲染端另以「逾 28 天不顯示」做保險。

**Runs:** prebuild · **Input:** `data/events.json` · **Output:** 正規化後的同檔
```bash
pnpm tsx scripts/normalize-data.ts
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "tsx scripts/normalize-data.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "validate": "tsx scripts/normalize-data.ts"
  }
}
```
（Next.js 會在 `build` 前自動執行 `prebuild`。）

---

## 8. Deployment

### Platform: Vercel（Pattern 1：Vercel + GitHub）
- 將 repo 連到 Vercel；push `main` → 自動 build & deploy。
- Framework preset：Next.js（零設定）。
- 之後要公開再於 Vercel → Settings → Domains 綁網域。

### vercel.json（加安全標頭）
```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" }
    ]}
  ]
}
```

### Environment Variables
網站本身**不需要**任何 env。自動化情境見下。

| Variable | Description | Where |
|----------|-------------|-------|
| `ANTHROPIC_API_KEY` | 僅「GitHub Actions cron 備援」自動化需要 | GitHub → Settings → Secrets |
| `PAT_TOKEN` | 僅備援需要：讓機器人 push 能觸發 Vercel 部署 | GitHub PAT（repo 權限） |

`.env.example` 留空殼即可（站點無 runtime env）。

### 自動化（內容每週更新）— 兩種方式

**方式 A（預設，依你的需求）：Claude Cowork Scheduler**
在 Claude Cowork 建立一個**每週重複任務**，指示內容＝`prompts/weekly-scan.md` 全文，並給它：
- 該 repo 的存取（GitHub 連接器，或本機 working copy）。
- Web 搜尋/瀏覽能力。
任務每週執行：研究 → 編輯 `data/*.json` → `git commit && git push`。push 觸發 Vercel 部署。
建議排程：**每週三 20:00（台北時間）**，讓你週四／五先看到週末規劃。

**方式 B（備援）：GitHub Actions cron**（`.github/workflows/weekly-scan.yml`）
若想要全託管、不依賴桌面 App：
```yaml
name: Weekly Scan
on:
  schedule:
    - cron: '0 12 * * 3'   # 每週三 12:00 UTC = 台北 20:00
  workflow_dispatch:
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { token: ${{ secrets.PAT_TOKEN }} }
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run weekly scan
        env: { ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }} }
        run: |
          claude -p "$(cat prompts/weekly-scan.md)" \
            --allowedTools "Bash(git*),Read,Write,Edit,Glob,Grep,WebSearch,WebFetch"
      - name: Commit & push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --staged --quiet || git commit -m "weekly-scan: $(date +%Y-%m-%d)"
          git push
```

---

## 9. Phased Build Plan

### Phase 1：Foundation（MVP）
**Goal:** 跑得起來、看得到本週精選、部署上線。
**Tasks:**
1. `pnpm create next-app`（TS、App Router、Tailwind v4、無 src 別名問題則用 `src/`）。
2. 在 `src/styles/globals.css` 寫入 §Appendix design tokens（CSS 變數）並接上 Tailwind。
3. 定義 `src/lib/types.ts`（Event/Source/WeeklyDigest + enums）與 `src/lib/schema.ts`（zod）。
4. `src/lib/data.ts`、`week.ts`、`utils.ts`：讀 JSON、本週判定、`cn()`。
5. 建立 `data/sources.json`（§4 種子）、`data/digests.json`（一筆本週）、`data/events.json`（**產生約 8 筆真實感 seed 活動**，橫跨 A/B 兩線與不同 ageFit/area，給 UI 有料可顯示）。
6. layout：`TopNav`、`Tabs`、root `layout.tsx`（Noto Sans TC + Inter、metadata、og）。
7. 首頁 `app/page.tsx`：`WeekDigestHeader` + 本週 `EventCard` 清單（含 `ui/` 小元件）。
8. 連 Vercel 部署。
**Milestone:** 線上可開啟首頁，看到 8 筆 seed 活動、適合度徽章、最後更新時間。

### Phase 2：Core Views
**Goal:** 月曆、活動詳情、狀態頁完整。
**Tasks:**
1. `CalendarMonth` + `DayDrawer`（client），`app/calendar/page.tsx`。
2. `app/events/[id]/page.tsx` + `EventDetail` + `generateStaticParams`。
3. `EventCard` 三變體、`StaleDataBanner`、`EmptyState`、載入骨架。
**Milestone:** 三頁籤可切換；月曆點日期看當天活動；點活動進詳情頁；空/過期狀態正確顯示。

### Phase 3：Filters & Polish
**Goal:** 全部活動可篩選、來源透明、RWD 收尾。
**Tasks:**
1. `app/events/page.tsx` + `FilterBar`（利基／類型／免費／週末／適合度／城市＋行政區）+「即將到來」。
2. `app/about/page.tsx` + `SourceList`（讀 `sources.json`，顯示 lastScannedAt/狀態）。
3. `scripts/normalize-data.ts` + prebuild 接線；手機版月曆與卡片排版微調。
**Milestone:** 在全部活動頁能用各條件篩到正確結果；About 頁列出來源與更新狀態；手機/桌機皆好用。

### Phase 4：Automation & Operations
**Goal:** 內容每週自動更新並上線。
**Tasks:**
1. 寫 `prompts/weekly-scan.md`（§10 全文）。
2. 設定 Claude Cowork 每週任務（方式 A），或啟用 `.github/workflows/weekly-scan.yml`（方式 B）。
3. 端到端測試：手動觸發一次 → 確認 `data/*.json` 被更新並 commit → Vercel 重新部署 → 網站出現新活動、`lastScannedAt` 更新。
**Milestone:** 一次完整自動跑通：研究 → 寫資料 → push → 部署，網站反映本週新內容。

---

## 10. Routine Prompt

### `prompts/weekly-scan.md`

```markdown
# 每週掃描任務 — Taipei Family Radar

你正在為「Taipei Family Radar（台北親子活動雷達）」執行每週內容更新。
目標使用者：帶 4 歲與 2 歲幼兒的台北家長。地理範圍：大台北（台北市為主，含新北市）。

## 你要做的事
研究兩條利基資料線，找出未來約 8 週內、適合帶幼兒參加的活動，更新 repo 內 JSON 並提交。

### 利基 A — 各國駐台文化／代表機構的節慶與文化活動
讀 `data/sources.json` 中 stream 為 "cultural"/"both" 的來源（歌德學院、法國在台協會、AIT、日本台灣交流協會、外交部駐台外國機構名錄等），找各國國慶開放日、文化節、影展、親子工作坊、市集等。

### 利基 B — 戶外表演
讀 stream 為 "outdoor"/"both" 的來源。重點場地：中正紀念堂（自由廣場/民主大道/藝文廣場）、大安森林公園露天音樂台、兩廳院藝文廣場、華山 1914、松山文創園區、市民廣場。找音樂、舞蹈、表演、比賽、市集。特別留意大安露天音樂台與街頭藝人平台的週末固定展演。

## 適合度判定（每筆都要給 ageFit + 一句 ageFitReason）
- great：戶外/開放空間、免費或低價、可隨進隨出、容忍幼兒走動吵鬧、時間不長、推車友善、週末或白天。
- ok：室內或稍有形式、時間夠短、家長陪同下 2–4 歲尚可、可能小額付費/需報名。
- older：需久坐安靜、時間長、正式售票、對象學齡以上。仍收錄但標清楚。

## 步驟
1. 讀取現有 `data/events.json` 與 `data/sources.json`。
2. 逐一研究來源（用 web 搜尋/瀏覽）。每找到一筆活動，比對是否已存在（以 sourceName|title|startDate 去重）：
   - 新的 → 依 §4 Event schema 新增（id 用該鍵的 slug 化雜湊；discoveredAt=現在；weekFound=本週 ISO 週次，如 2026-W23；status 可留空由 build 計算）。
   - 已存在但有更新（如日期確定、票價變動）→ 更新該筆欄位。
3. 為每筆寫 2–4 句親子視角 `summary`、判定 `ageFit` 與 `ageFitReason`、盡量填 `area`/`venue`/`startTime`/`isFree`/`sourceUrl`。
4. 移除 (endDate ?? startDate) 早於今天 28 天以上的活動（保留月曆回顧 4 週）。
5. 更新 `data/sources.json` 每筆的 lastScannedAt（現在）與 lastStatus（ok/partial/failed）。
6. 在 `data/digests.json` 新增/更新本週 WeeklyDigest：weekOf=本週、intro=2–3 句本週重點、highlightEventIds=本週首推 2–4 筆。
7. 跑 `pnpm validate` 確認資料合法。

## 資料正確性
- 只收錄有可靠來源 URL、且能確認日期的活動；日期不明確就先不收，或標 tags:["日期待確認"] 並不放入本週首推。
- 不要杜撰活動。找不到就讓本週新增較少，沒關係。
- 全部繁體中文；活動原名若是外文，填入 titleOriginal 保留。

## 提交
- 只更動 `data/` 目錄。
- commit 訊息："weekly-scan: <YYYY-MM-DD>（新增 N 筆 / 更新 M 筆）"。
- 方式 A（Cowork）：commit 後直接 push。
- 方式 B（GitHub Actions）：只 commit，不要 push（workflow 會 push）。
```

---

## Appendix: Design Tokens

寫入 `src/styles/globals.css`：

```css
:root {
  /* Colors */
  --color-primary: #1F8A70;
  --color-primary-dark: #156A55;
  --color-accent: #F2994A;
  --color-bg: #FBFAF7;
  --color-surface: #FFFFFF;
  --color-border: #E7E3DB;
  --color-text: #1F2421;
  --color-text-secondary: #5E6B64;
  --color-success: #2F9E7E;
  --color-warning: #E0A100;
  --color-error: #D1495B;
  --stream-cultural: #3D7DD6;   /* 利基 A 文化機構 */
  --stream-outdoor: #E07A5F;    /* 利基 B 戶外表演 */
  --agefit-great: #2F9E7E;
  --agefit-ok: #E0A100;
  --agefit-older: #94A39B;
  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
  /* Radius */
  --radius-card: 12px; --radius-pill: 999px;
}
```

**Typography:** Noto Sans TC（標題/內文）+ Inter（數字/英文）。H1 32/700、H2 24/600、H3 20/600、Body 16/400（行高 1.7）、Small 14/500。
**Layout:** 頂部導覽 + 置中單欄，內容 `max-w-5xl`（~1100px），行動優先；月曆手機縮精簡格 + 底部 drawer。
**Dark mode：** v2 再做。
```
