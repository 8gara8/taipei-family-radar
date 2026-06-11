# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-updating static site — **台北親子活動雷達 (Taipei Family Radar)** — that curates *free*, toddler-friendly events around Taipei / New Taipei / Keelung for parents of young children. Two content "streams": **cultural** (foreign cultural/representative institutes' festivals & events) and **outdoor** (open-air performances at venues like CKS Memorial Hall, Daan Forest Park, NTCH plaza, Huashan, Songshan).

There is **no backend and no database**. The entire site is statically generated (SSG) from JSON files in `data/`. Content is refreshed by a weekly Claude agent that edits those JSON files and pushes; Vercel redeploys on push. The authoritative product spec is `SPEC.md` (Chinese); `README.md` covers stack and build phases.

## Commands

Uses **pnpm**.

```bash
pnpm install
pnpm dev          # next dev → http://localhost:3000
pnpm build        # runs `prebuild` (normalize-data) then `next build` (static SSG)
pnpm start        # serve the production build
pnpm lint         # next lint (eslint-config-next / core-web-vitals)
pnpm validate     # tsx scripts/normalize-data.ts — validate + normalize data/*.json
```

There is **no test suite**. `pnpm validate` is the closest thing to a correctness gate and runs automatically as `prebuild`, so a build fails fast on bad data.

## Architecture

### Data is the source of truth

Everything renders from three files in `data/`, loaded statically at build time via JSON imports (no runtime fetch):

- `data/events.json` — the event list (the heart of the app).
- `data/sources.json` — the weekly scan source list; each row's `lastScannedAt` feeds "last updated".
- `data/digests.json` — weekly digests; the latest one drives the homepage "本週精選" header.

The data contract lives in two parallel files that **must be kept in sync**:
- `src/lib/types.ts` — TypeScript interfaces (`Event`, `Source`, `WeeklyDigest`) and enums (`Stream`, `Category`, `AgeFit`, `EventStatus`).
- `src/lib/schema.ts` — the Zod runtime schemas used by `pnpm validate`. When you add/change a field, update **both** files plus `EVENT_KEY_ORDER` in `scripts/normalize-data.ts`.

### The normalize/validate step (`scripts/normalize-data.ts`)

Run as `prebuild` and via `pnpm validate`. It:
1. Validates every event against the Zod schema (invalid → prints id + error, exits non-zero, build fails).
2. Computes `status` (`upcoming`/`past`) from today (Taipei tz) vs `endDate ?? startDate`.
3. De-duplicates by `id` (keeps earliest `discoveredAt`, merges newer fields).
4. Sorts by `startDate` then `startTime`.
5. Rewrites `events.json` with a **stable key order + 2-space indent** so diffs stay clean.

It validates (but does **not** rewrite) `sources.json` and `digests.json`. Deletion of stale events is the weekly agent's job, **not** this script's.

### Read/query layer (`src/lib/data.ts`)

The only module pages should import for data. It re-derives `status`, **filters out events more than `STALE_AFTER_DAYS` (28) past** (rendering-side safety net independent of the build script), and exposes helpers: `getAllEvents`, `getUpcomingEvents`, `getUpcomingEventsThisWeek`, `getEventsFoundThisWeek`, `getEventById`, `getSources`, `getDigests`/`getLatestDigest`, `getDigestHighlights`, `getLastUpdated`.

### Timezone correctness (important & easy to get wrong)

The site is Taiwan-facing but builds/runs on UTC servers. **All** day-boundary and ISO-week math goes through `Asia/Taipei` via `@date-fns/tz`'s `tz(...)` `in:` option (see `src/lib/week.ts` and `src/lib/data.ts`). `getUpcomingEventsThisWeek` deliberately compares formatted `yyyy-MM-dd` strings rather than calendar-day diffs to avoid the "Sunday 23:59 UTC is already Monday in Taipei" off-by-one. ISO weeks are `YYYY-Www` (e.g. `2026-W23`) and drive `weekFound` / digest `weekOf`.

### Routing & rendering (App Router, `src/app/`)

Fully static. Pages: `/` (本週精選 home), `/calendar`, `/events` (filterable explorer), `/events/[id]` (detail), `/about`. Dynamic routes use `generateStaticParams()` from `getAllEvents()` to prerender every event. `params` is a `Promise` (Next 15) — `await` it.

`/events/[id]/event.ics/route.ts` is a `force-static` route handler returning a real `text/calendar` file (server-served `.ics` is required because iOS Safari blocks top-level `data:` navigation); ICS generation logic is in `src/lib/ics.ts`.

### UI conventions

- **Mobile-first app shell**: centered `max-w-[480px]` column with `AppHeader` + `BottomNav` (`src/app/layout.tsx`). All Traditional Chinese; `lang="zh-Hant-TW"`. Inter for Latin/numbers, Noto Sans TC for CJK (`preload: false`).
- **Design tokens** are defined in `src/styles/globals.css` via Tailwind v4 `@theme` (this produces both `var(--color-*)` and utilities like `bg-surface`). Use tokens, not hard-coded colors. Spacing tokens `--space-*` map to Tailwind's default scale.
- **Per-category visuals** (label, emoji placeholder, tint) have a single source of truth in `src/lib/category.ts` (`CATEGORY_META`) — reused by cards, detail headers, filters, calendar.
- Components are grouped under `src/components/` as `ui/` (atoms), `layout/` (shell), `features/` (event-specific).
- Path alias `@/*` → `./src/*`.

## Weekly content automation

Content updates are produced by a Claude agent running `prompts/weekly-scan.md` (the full research instruction). It researches the two streams, keeps only confirmable **free** events within ~8 weeks, writes `data/*.json`, runs `pnpm validate`, and commits. Two delivery paths:

- **Path A (default)** — Claude Cowork scheduler; the agent commits *and pushes*.
- **Path B (fallback)** — `.github/workflows/weekly-scan.yml`, cron Wed 12:00 UTC (= Taipei 20:00) or manual `workflow_dispatch`. The agent only edits the working tree; the workflow **restricts changes to `data/`**, validates, then commits & pushes (the agent does **not** push here). Needs GitHub Secrets `ANTHROPIC_API_KEY` and `PAT_TOKEN`.

When editing event data by hand, follow the same rules as the agent: only free events (`isFree: true`), Traditional Chinese, `titleOriginal` for foreign names, reliable `sourceUrl` + confirmed date, dedupe by `sourceName|title|startDate`, and always run `pnpm validate`. Touch only `data/` for content changes.

## Deployment

Vercel, zero-config Next.js. Push to `main` → auto build & deploy; `vercel.json` adds security headers. **The site itself needs no environment variables at build or runtime** — `ANTHROPIC_API_KEY` / `PAT_TOKEN` exist only for the Path B GitHub Action (see `.env.example`).
