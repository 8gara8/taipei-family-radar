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
- **Phase 4（本階段）**：每週自動更新流程 — `prompts/weekly-scan.md` 研究指令、`.github/workflows/weekly-scan.yml`（GitHub Actions cron 備援），詳見下方〈自動化〉。

## 自動化（內容每週更新）

內容由一個每週執行的 Claude 代理人產生：研究兩條利基資料線、篩出適合幼兒的活動、寫入 `data/*.json`、commit 後觸發 Vercel 重新部署。研究指令全文見 [`prompts/weekly-scan.md`](./prompts/weekly-scan.md)。

兩種執行方式（擇一）：

- **方式 A（預設）— Claude Cowork Scheduler**：在 Claude Cowork 建立每週重複任務，指示內容＝`prompts/weekly-scan.md` 全文，並授予該 repo 存取與 web 搜尋能力。建議排程每週三 20:00（台北時間）。任務會 commit 後直接 push。
- **方式 B（備援）— GitHub Actions cron**：`.github/workflows/weekly-scan.yml`，每週三 12:00 UTC（＝台北 20:00）觸發，亦可由 `workflow_dispatch` 手動執行。需在 GitHub → Settings → Secrets 設定 `ANTHROPIC_API_KEY` 與 `PAT_TOKEN`（讓機器人 push 能觸發 Vercel 部署）。workflow 會先 `pnpm validate` 驗證資料再 push。

資料驗證可隨時本機執行：

```bash
pnpm validate     # 以 zod 驗證 events、計算 status、去重、排序、穩定寫回
```

## 部署

採 Vercel（Next.js 零設定預設）。將 repo 連到 Vercel，push `main` 即自動 build & deploy；`vercel.json` 已加上安全標頭。站點本身不需任何環境變數。自動化所需的 `ANTHROPIC_API_KEY`／`PAT_TOKEN` 僅供方式 B 的 GitHub Actions，設定於 GitHub Secrets（見 `.env.example`），站點 runtime 不使用。
