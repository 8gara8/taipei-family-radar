# 台北親子活動雷達（Taipei Family Radar）

一個自動更新的「台北親子活動雷達」靜態網站，為帶 4 歲與 2 歲幼兒的台北家長，每週精選大台北（台北市為主、含新北市）的活動：

- **利基 A — 文化機構**：各國駐台文化／代表機構的節慶與文化活動。
- **利基 B — 戶外表演**：中正紀念堂、大安森林公園露天音樂台、兩廳院藝文廣場、華山、松菸、市民廣場等。

內容由每週執行的 Claude 代理人研究並寫入 repo 內 JSON，push 後由 Vercel 自動部署。完整規格見 [`SPEC.md`](./SPEC.md)。

## Stack

Next.js 15（App Router）· TypeScript · Tailwind CSS v4 · date-fns · lucide-react · 資料存於 repo 內 JSON（無後端、無資料庫）。

## 開發

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build（全靜態 SSG）
pnpm start        # 啟動 build 後的站點
pnpm lint         # ESLint
```

## 專案結構

```
src/
  app/            # App Router 頁面（本週精選 / 月曆 / 全部活動 / 活動詳情 / 關於）
  components/     # ui/（badge、chip…）、layout/（TopNav、Tabs…）、features/（EventCard…）
  lib/            # types、schema(zod)、data、week、utils
  styles/         # globals.css（design tokens + Tailwind）
data/             # events.json / sources.json / digests.json（事實來源，代理人每週編輯）
```

## 資料

- `data/events.json`：活動清單（事實來源）。
- `data/sources.json`：每週掃描的來源清單。
- `data/digests.json`：每週摘要，最新一筆對應「本週精選」頁首。

型別定義於 `src/lib/types.ts`，並以 zod（`src/lib/schema.ts`）驗證。

## 建置進度

- **Phase 1**：Next.js + Tailwind v4 基礎、design tokens、型別與資料層、種子資料（來源／摘要／8 筆活動）、TopNav/Tabs、首頁「本週精選」，以及可部署的 Vercel 設定。
- **Phase 2（本階段）**：互動月曆（`CalendarMonth` + `DayDrawer`）、活動詳情頁（`EventDetail` + `generateStaticParams`）、`StaleDataBanner`／`EmptyState`／載入骨架等空與過期狀態。
- Phase 3：全部活動篩選、來源透明、RWD 收尾。
- Phase 4：每週自動更新（Claude Cowork / GitHub Actions）。

## 部署

採 Vercel（Next.js 零設定預設）。將 repo 連到 Vercel，push `main` 即自動 build & deploy；`vercel.json` 已加上安全標頭。站點本身不需任何環境變數。
