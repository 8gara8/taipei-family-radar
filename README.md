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
- **Phase 2**：互動月曆（`CalendarMonth` + `DayDrawer`）、活動詳情頁（`EventDetail` + `generateStaticParams`）、`StaleDataBanner`／`EmptyState`／載入骨架等空與過期狀態。
- **Phase 3**：全部活動篩選（利基／類型／免費／週末／適合度／城市＋行政區）、About 來源頁、`scripts/normalize-data.ts` 與 prebuild 接線、RWD 收尾。
- **Phase 4（本階段）**：每週自動更新流程 — `prompts/weekly-scan.md` 研究指令、`.github/workflows/weekly-scan.yml`（GitHub Actions 手動備援），詳見下方〈自動化〉。

## 自動化（內容每週更新）

內容由兩個既有 Claude Cowork 任務分流研究、篩選活動、更新 `data/*.json`，commit 與 push 後觸發 Vercel 重新部署。已發布內容與現行排程一致，時間皆為 **Asia/Taipei**：

| 任務 | 每週開始時間 |
|------|-------------|
| Cultural（文化機構活動） | 週一 02:00 |
| Outdoor（戶外表演與體驗） | 週二 02:00 |

02:00 是掃描開始時間；內容完成後才發布，網站另顯示實際資料更新日期。網站使用 `src/lib/scan-schedule.ts` 統一產生時間標籤與下次掃描日期；它只反映既有排程，不會設定或修改 Claude 的觸發器。

- **主要執行方式 — Claude Cowork Scheduler**：保留既有 Cultural 與 Outdoor 任務及其完整研究／發布指令。`prompts/weekly-scan.md` 是涵蓋兩條資料線的通用研究指令，不代表目前只有一個合併任務。
- **手動備援 — GitHub Actions**：`.github/workflows/weekly-scan.yml` 僅開放 `workflow_dispatch`，自 2026-06-11 起沒有 cron。需要備援時手動執行，避免與 Cowork 重複發布。所需 `ANTHROPIC_API_KEY` 與 `PAT_TOKEN` 設於 GitHub Secrets；workflow 驗證資料後才 push。

修改這些文件或網站顯示不會改動上述排程。遷移時應先核對帳號中的既有任務，避免建立重複工作。

下次掃描日期的邊界測試（含 UTC 伺服器與台北跨日）：

```bash
TZ=UTC node --import tsx --test src/lib/scan-schedule.test.ts
```

資料驗證可隨時本機執行：

```bash
pnpm validate     # 以 zod 驗證 events、計算 status、去重、排序、穩定寫回
```

## 部署

採 Vercel（Next.js 零設定預設）。將 repo 連到 Vercel，push `main` 即自動 build & deploy；`vercel.json` 已加上安全標頭。站點本身不需任何環境變數。自動化所需的 `ANTHROPIC_API_KEY`／`PAT_TOKEN` 僅供方式 B 的 GitHub Actions，設定於 GitHub Secrets（見 `.env.example`），站點 runtime 不使用。
