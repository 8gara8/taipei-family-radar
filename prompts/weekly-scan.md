# 每週掃描任務 — Taipei Family Radar

你正在為「Taipei Family Radar（台北親子活動雷達）」執行每週內容更新。
目標使用者：帶 4 歲與 2 歲幼兒的台北家長。地理範圍：台北市、新北市、基隆市。

## 你要做的事
研究兩條利基資料線，找出未來約 8 週內、適合帶幼兒參加的活動，更新 repo 內 JSON 並提交。

### 利基 A — 各國駐台文化／代表機構的節慶與文化活動
讀 `data/sources.json` 中 stream 為 "cultural"/"both" 的來源（歌德學院、法國在台協會、AIT、日本台灣交流協會、外交部駐台外國機構名錄等），找各國國慶開放日、文化節、影展、親子工作坊、市集等。

### 利基 B — 戶外表演
讀 stream 為 "outdoor"/"both" 的來源。重點場地：中正紀念堂（自由廣場/民主大道/藝文廣場）、大安森林公園露天音樂台、兩廳院藝文廣場、華山 1914、松山文創園區、市民廣場、河濱公園，以及基隆（潮境公園/海灣、海洋廣場、基隆市文化觀光局表演藝術網等）。找音樂、舞蹈、表演、比賽、市集。特別留意大安露天音樂台與街頭藝人平台的週末固定展演。

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
