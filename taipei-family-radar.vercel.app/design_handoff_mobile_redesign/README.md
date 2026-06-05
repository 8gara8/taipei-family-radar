# Handoff: 親子活動雷達 — Mobile Redesign (Direction A「暖心卡片」)

## Overview
A mobile-first visual redesign of **台北親子活動雷達 / Taipei Family Radar** — the weekly-curated
family-activity site for Taipei-area parents of a 4-year-old and 2-year-old. This handoff covers a
warm, kid-friendly evolution of the existing design system across the whole app: **今天 (This Week),
月曆 (Calendar), 全部活動 (All Events + filters), 活動詳情 (Event Detail), and 關於 (About / Sources).**

The redesign is **presentation-only**. It does **not** change the data model, the `data/*.json` files,
the zod schema, or the weekly Claude scan agent. You are re-skinning and re-structuring the UI layer;
the content pipeline (Claude Code + Claude Cowork scheduled task) is untouched.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes that
show the intended look and behavior. **They are not production code to copy directly.** The iOS device
frame, the inline-styled React components, and the standalone HTML host are all scaffolding for the mock.

Your task is to **recreate these designs inside the existing Next.js 15 / TypeScript / Tailwind v4
codebase**, using its established patterns: the design tokens in `src/styles/globals.css`, the existing
components under `src/components/`, `next/link` navigation, `lucide-react` icons, and the data helpers in
`src/lib/`. Port the *visual + structural decisions*, not the literal inline styles.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, and interactions are final and intended to
be matched closely. Exact values are listed in **Design Tokens** below; most already exist as Tailwind v4
`@theme` tokens in `globals.css`, so prefer the token over a raw hex.

---

## Key structural change vs. the current site
The current site uses a **sticky top nav** (`TopNav` + `Tabs` + an About link). The redesign moves primary
navigation to a **fixed bottom tab bar** (4 tabs) — standard for a phone-first app and friendlier for
one-handed use by busy parents. Event detail becomes a **full-screen pushed view** instead of a route the
user navigates away to (though keeping the `/events/[id]` route for deep-linking/SSG is fine — see notes).

| Area | Current component | Redesign |
|---|---|---|
| Primary nav | `layout/TopNav.tsx`, `layout/Tabs.tsx` (top) | new `layout/BottomNav.tsx` (fixed bottom, 4 tabs) |
| Event card | `features/EventCard.tsx` | softer card: r=18, accent left-bar on highlights, emoji category tile, badge row |
| Week header | `features/WeekDigestHeader.tsx` | eyebrow + big title + soft gradient digest card + stat row |
| Calendar | `features/CalendarMonth.tsx`, `features/DayDrawer.tsx` | month grid w/ stream dots + ‹ › month nav + bottom-sheet day drawer |
| Filters | `features/FilterBar.tsx` | **bottom-sheet** triggered by a 篩選 button with active-count badge |
| Event detail | `features/EventDetail.tsx`, `events/[id]/page.tsx` | full-screen view: 190px emoji header, age-fit callout, summary, tags, source CTA |
| About | `app/about/page.tsx`, `features/SourceList.tsx` | intro card + two 利基 cards + sources list with status dots |

---

## Screens / Views

### 1. 今天 — This Week (home, `app/page.tsx`)
- **Purpose:** Land the parent on this week's digest and the curated picks.
- **Layout:** Single scroll column, page padding `18px` horizontal, `8px` top. Sections stacked with
  `~24–26px` gaps.
- **Components:**
  - **Eyebrow:** `本週精選 · 第 23 週` — 13px / weight 800 / `--color-primary` / letter-spacing 0.3.
  - **Title:** the digest's `title` field — 27px / weight 900 / `--color-text` / line-height 1.18 /
    letter-spacing −0.5.
  - **Digest card:** background `linear-gradient(180deg,#ffffff,#fdfbf6)`, `1px` `--color-border`,
    radius 18, padding 15. Body = `digest.intro` at 13.5px / line-height 1.75 / `--color-text-secondary`.
    Stat row below (12.5px / 600): `📍 台北・新北・基隆` and `🗓️ 本週 N ／ 共 M 個` (bold numerals in
    `--color-text`).
  - **本週首推 section:** heading `⭐ 本週首推` (18px / 900). Cards use the **highlight** variant
    (accent left-bar). Source: `getDigestHighlights(getLatestDigest())`.
  - **其他即將到來 section:** heading (18px / 900). Default cards. Source: `getUpcomingEvents()` minus
    highlight IDs.

#### Event Card (the core repeated component)
- Container: `display:flex; gap:12px;` white surface, `1px --color-border`, **radius 18**, padding 14,
  shadow `0 1px 2px rgba(31,36,33,0.04)`, `overflow:hidden; position:relative`. Whole card is a link to
  `/events/[id]`.
- **Highlight variant:** absolutely-positioned left bar, `width:6px`, full height, `--color-accent`.
- **Category tile (thumbnail placeholder):** `56×56` (highlight `64×64`), radius 14, background = a soft
  per-category tint (see token table), centered category **emoji** at `~42%` of tile size. If
  `event.imageUrl` exists, show the image instead (`object-cover`, radius ~10) — same as current behavior.
- **Body:**
  - Meta row: `StreamDot` (7px colored dot + stream label, 12px / 700, colored) then `· 類型` in secondary.
  - Title: 15.5px / weight 800 / line-height 1.35 / letter-spacing −0.2; on hover → `--color-primary`.
  - Detail line (13px secondary): `venue` (bold, `--color-text`) · date range · start time.
  - Badge row (9px top margin): **AgeFitBadge** + **FreeBadge** (see components).

### 2. 月曆 — Calendar (`app/calendar/page.tsx`)
- **Purpose:** Browse upcoming events by date.
- **Header:** `2026 年 N 月` (22px / 900) + two `‹ › ` buttons (32×32, r10, white, `1px border`,
  secondary glyph). Months available: **June, July, Aug 2026** (clamp nav to the data range; disable
  chevrons at the ends — disabled glyph `#cfc9bf`).
- **Weekday row:** `日一二三四五六` (12px / 700, secondary; weekend columns 日/六 in `--color-accent`).
- **Grid:** 7-col, `gap:4px`, cells `aspect-ratio:1`, radius 12.
  - Default cell: number 14px / 600.
  - Has-events cell: white surface + `1px border`, plus up to 2 **stream-colored dots** (6px) under the
    number. Only event-days are tappable.
  - **Today** (`2026-06-05`): background `#e6f4ef`, number 900, color `--color-primary-dark`.
  - **Selected:** background `--color-primary`, white text, white dots.
- **Legend:** two `StreamDot`s (文化機構 / 戶外表演).
- **Day drawer (bottom sheet):** tapping an event-day opens a sheet anchored to the **phone bottom** (not
  the scroll content — see Interactions › Overlays). Dim backdrop `rgba(31,36,33,0.28)`. Panel: `--color-bg`,
  top radius 22, max-height 78%, grab-handle, title `N 月 D 日 週X` (17px / 900), `K 個活動`, then the day's
  event cards. (Maps to existing `DayDrawer.tsx`.)

### 3. 全部活動 — All Events + Filters (`app/events/page.tsx`, `features/EventsExplorer.tsx`)
- **Title:** `全部活動` (22px / 900).
- **Filter trigger row:** a **篩選** button (`⚙︎ 篩選`, r12, `1px border`, 14px / 800; turns
  `--color-primary` text + primary border when any filter active) with a circular **active-count badge**
  (min 20px, primary bg, white, 12px / 800). When active: a `↺ 清除` text button. Right-aligned count `N 個`.
- **List:** filtered + date-sorted event cards (default variant). **Empty state** when no match: 🔍, bold
  `沒有符合的活動`, hint `試著放寬篩選條件`, and a primary `清除篩選` button.
- **Filter bottom sheet** (port of `FilterBar.tsx`, mobile pattern): backdrop `rgba(31,36,33,0.32)`, panel
  `--color-bg`, top radius 24, max-height 86%, **sticky header** (grab handle + `篩選活動` 18px/900 +
  `↺ 清除全部`) and **sticky footer** with a full-width primary CTA `顯示 N 個活動`. Field groups, each a
  12px/800 label + wrapping **TogglePill** row:
  - **利基:** 全部 / 文化機構 / 戶外表演 (single-select; 全部 clears).
  - **類型:** multi-select, only categories present in data; pill shows `emoji 類型`.
  - **適合度:** 全部 / 很適合 / 可考慮 / 大小孩 (single).
  - **其他:** 只看免費 / 只看週末 (toggles).
  - **地區:** 全部 / 台北 / 新北 / 基隆 (single). When a city is chosen, a second pill row of **districts**
    appears (`全區` + districts present in that city), e.g. 台北 → 中山區 / 中正區 / 大安區 / 萬華區.
  - **TogglePill:** r=pill, `7px 13px`, 13.5px / 700. Inactive: white, `1px border`, secondary text.
    Active: `--color-primary` bg, white text, leading `✓`.
- **Filter logic** (matches current `FilterState`): AND across groups; `categories` is OR within itself;
  `weekendOnly` = startDate is Sat/Sun; city/district parsed from `event.area` (`parseArea`).

### 4. 活動詳情 — Event Detail (`features/EventDetail.tsx`, `app/events/[id]/page.tsx`)
- **Presentation:** full-screen pushed view (slide-in `translateX(16px)→0`, 0.26s
  `cubic-bezier(.2,.7,.3,1)`). Keep the `/events/[id]` route for SSG/deep-links; the "push" can be a route
  transition.
- **Header band:** 190px tall, background = the event's category tint, centered category emoji at 76px.
  Back affordance: top-left 38px circle, `rgba(255,255,255,0.9)`, `‹`. A small monospace caption
  `category placeholder` bottom-right signals where a real image goes when `imageUrl` is present.
- **Body** (padding 16/20/30): badge row (StreamDot + AgeFitBadge + FreeBadge); title 22px / 900; optional
  `titleOriginal` 13px italic secondary; info grid (14px): `📍 venue + area`, `🗓️ date · time`,
  `🎟️ 免費/需購票`. **Age-fit callout:** background `#fff7ec`, `1px #f6e2c5`, r14, text `#8a5a1c`,
  `適合 4 歲與 2 歲？` + `event.ageFitReason`. Then `summary` (14.5px / line-height 1.85) and `#tags`
  pills (12px, `--color-soft` bg).
- **Sticky footer CTA:** full-width primary button `查看原始出處 ↗` → `event.sourceUrl` (open in new tab;
  if `registrationUrl` exists, consider a secondary `報名 ↗`).

### 5. 關於 — About (`app/about/page.tsx`, `features/SourceList.tsx`)
- **Intro card:** gradient surface; explains the project (parents of 4yo + 2yo, weekly curation of Greater
  Taipei incl. New Taipei + Keelung; agent re-scans Wed evenings).
- **Two 利基 cards:** each white, r16; colored dot + bold label + description.
  - 利基 A · 文化機構 (dot = stream-cultural blue): foreign cultural/representative institutes.
  - 利基 B · 戶外表演 (dot = stream-outdoor terracotta): outdoor venues (中正紀念堂, 大安森林公園
    露天音樂台, 兩廳院藝文廣場, 華山, 松菸, 市民廣場…).
- **Sources list** (`sources.json`): white card, divided rows. Each row: status dot
  (`ok`→#2f9e7e, `partial`→#e0a100, `failed`→#d1495b), name (13.5px / 700, truncate), sub
  `來源類型 · stream` (11.5px secondary), trailing `↗` → `source.url`. Footer disclaimer + last-updated.

---

## Interactions & Behavior
- **Navigation:** bottom tab switches the active screen; active tab uses `--color-primary` + bolder label,
  inactive icons slightly desaturated. Keep tab state in the URL/route as today (`/`, `/calendar`,
  `/events`, `/about`) so back-button and SSG keep working.
- **Overlays (important):** the day drawer and filter sheet must anchor to the **phone viewport bottom**,
  not the scrolling list. In the prototype this was solved by portaling overlays into a phone-level layer;
  in your app, render sheets at the layout/root level (or a portal) with `position: fixed` + safe-area
  insets — do **not** make them `position:absolute` inside the scrolling `<main>`.
- **Detail transition:** 0.26s slide-in, transform-only (no opacity fade). Respect
  `prefers-reduced-motion`.
- **Filtering:** live (no Apply needed); the sheet's CTA just closes the sheet and shows the running count.
- **Loading / empty / stale states:** reuse existing `Skeleton`, `EmptyState`, `StaleDataBanner`
  (>8 days since `lastUpdated`). The redesign doesn't remove these — fit them into the new layouts.
- **Hit targets:** bottom-nav items and pills ≥44px touch height.

## State Management
Same shape as today — no new data layer:
- Active tab = route. Calendar: `monthIndex` (clamped to data range) + `selectedDay`. All Events:
  `FilterState { stream?, categories[], freeOnly, weekendOnly, ageFit?, city?, district? }` (already defined
  in `FilterBar.tsx`) + `sheetOpen`. Detail: event by `id` via `generateStaticParams`.
- Data via existing `src/lib/data.ts` helpers (`getLatestDigest`, `getDigestHighlights`,
  `getUpcomingEvents`, `getUpcomingEventsThisWeek`, `getLastUpdated`) and `src/lib/week.ts`.

## Design Tokens
Most already exist in `src/styles/globals.css` (`@theme`). Use the token, not the raw hex.
- **Colors:** primary `#1f8a70`, primary-dark `#156a55`, accent `#f2994a`, bg `#fbfaf7`,
  surface `#ffffff`, border `#e7e3db` (cards in mock use a slightly warmer `#ece7de`),
  text `#1f2421`, text-secondary `#5e6b64`, soft `#f3efe7`.
- **Stream:** cultural `#3d7dd6`, outdoor `#e07a5f`.
- **Age-fit:** great `#2f9e7e` (bg `#e6f4ef`), ok text `#b5810a` (bg `#fbf1d8`), older `#6f7d75` (bg `#eef0ee`).
  Labels: great 很適合 (rendered `👶 很適合`), ok 可考慮, older 大小孩.
- **Free badge:** text `#156a55` on `#e6f4ef`.
- **Status dots:** ok `#2f9e7e`, partial `#e0a100`, failed `#d1495b`.
- **Category tints (tile backgrounds):** music `#fde9d6`, dance `#f6e2ef`, performance `#e7ecfa`,
  competition `#fcecd0`, film `#e6eef0`, workshop `#e6f2ec`, market `#f3ecdd`, festival `#fbe6e1`,
  exhibition `#eceaf4`, other `#eef0ee`.
- **Category emoji (placeholders):** music 🎵, dance 🕺, performance 🎭, competition 🏆, film 🎬,
  workshop 🧩, market 🧺, festival 🎉, exhibition 🖼️, other ✨.
- **Radius:** card 18 (prototype) / token `--radius-card` is 12 today — bump the token or add an
  `--radius-card-lg`; pill 999.
- **Spacing:** 4 / 8 / 12 / 16 / 18(page) / 24 (aligns with existing `--space-*`).
- **Type:** `--font-sans` (Inter + Noto Sans TC). Weights used: 600 / 700 / 800 / 900. Title sizes
  27 (home), 22 (page), 18 (section), 15.5 (card title); body 13–14.5; meta 11.5–13.
- **Shadows:** card `0 1px 2px rgba(31,36,33,0.04)`; sheet `0 -8px 30px rgba(0,0,0,0.16–0.18)`.

## Assets
No bitmap assets. Category **emoji** are intentional placeholders for event thumbnails — when
`event.imageUrl` is present, render the real image in the tile/header instead (existing behavior).
Icons in the real app: keep using `lucide-react` (e.g. `Radar` brand mark, `MapPin`, `CalendarHeart`,
`Clock`, `Filter`, `Check`, `RotateCcw`) — the prototype used emoji only because it had no icon lib.

## Files (in this bundle)
- `親子活動雷達 App.html` — the standalone prototype host (open in a browser to interact with all 5 screens).
- `app.jsx` — all screen components (Home, Calendar, AllEvents, About, Detail, shell + bottom nav).
- `data.js` — the real event/source/digest data + helpers (mirrors `data/*.json`; do not ship — your app
  already has this data).
- `ios-frame.jsx` — the mock device bezel (scaffolding only; not for production).

> Also in the project, for reference only: `親子活動雷達 改版探索.html` is the original 3-direction
> exploration (A 暖心卡片 was chosen). Not required for implementation.

## Suggested implementation order
1. `BottomNav` + route wiring (replace `TopNav`/`Tabs`).
2. Restyle `EventCard` (card + tile + badges) — unblocks every list.
3. `WeekDigestHeader` + home sections.
4. `CalendarMonth` dots/today/selected + month nav + `DayDrawer` as a bottom sheet.
5. `FilterBar` → filter bottom sheet; verify district logic.
6. `EventDetail` full-screen layout + age-fit callout + source CTA.
7. About + `SourceList` status dots.
8. Re-fit `Skeleton` / `EmptyState` / `StaleDataBanner`; check 44px targets + safe-area insets.
