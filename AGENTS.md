# Eureka Agent Initialization

## Project Purpose
- Eureka is a Mahjong Solitaire game built with Next.js (App Router), React, TypeScript, Zustand, Tailwind, and Drizzle ORM.
- Core gameplay is client-side state-driven; game persistence and highscores are written/read via a Next API route and SQLite/Turso.

## Current Repository State (Reviewed 2026-02-18)
- Branch: `25-move-game-into-database`
- Sync status vs upstream branch: ahead `1`, behind `0` (`origin/25-move-game-into-database`)
- Latest local commit: `813894d` (`upgrade to nextjs 14.2.28`)

## Quick Start
1. Install dependencies: `bun install`
2. Set DB URL (local default is valid): `TURSO_DATABASE_URL="file:./local.db"`
3. Start dev server: `bun run dev`
4. Open: `http://localhost:3000`

## Useful Commands
- `bun run dev` - local development
- `bun run build` - production build
- `bun run start` - serve production build
- `bun run lint` - ESLint
- `bun run type-check` - TypeScript checks
- `bun run test:run` - run Vitest once
- `bun run generate` - generate Drizzle migrations
- `bun run migrate` - apply/push migrations

## High-Value File Map
- App shell and metadata: `src/app/layout.tsx`
- Landing/start page: `src/app/page.tsx`
- Main gameplay route: `src/app/play/page.tsx`
- Global game state/actions: `src/zustand/game-store.ts`
- Game board generation: `src/utils/init-gameboard.ts`
- Tile layout and token model: `src/types/game-board.ts`
- API persistence endpoint: `src/app/api/game/route.ts`
- DB client and schema: `src/db/client.ts`, `src/db/schema.ts`
- Save/update game state: `src/db/insert-game.ts`
- Highscores query: `src/db/select-game.ts`

## Runtime Flow
1. User starts game on `/` via `PlayButton` (calls `start()` in Zustand store).
2. `/play` renders `GameBoard` while `isGameRunning()` is true.
3. Tile clicks call `clicked(index)`, evaluate selection rules, remove pairs, and increment score.
4. Timer ticks through `step()` every second; autosave triggers every 60 seconds.
5. Save path is `postGameState()` -> `POST /api/game` -> `saveGameState()` in DB layer.
6. Level clear routes to `/next-level`; game over routes to `/game-over`; highscores at `/highscores`.

## Data Layer Notes
- Active table for game persistence/highscores: `games`.
- Additional schema tables exist (`game_moves`, `game_snapshots`, `game_states`), but current app flow primarily reads/writes `games`.
- Local fallback database is `file:./local.db` when no remote URL is configured.

## Quality Snapshot (2026-02-18)
- `bun run lint`: passes
- `bun run type-check`: passes
- `bun run test:run`: passes (32 tests)
- `bun run build`: passes
- `tsconfig` strictness includes `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`

## Known Pitfalls To Verify First
- `tsconfig.json` includes `.next/types/**/*.ts`, so stale local `.next` artifacts can affect local type checks.
- The `type-check` script is configured with `--incremental false` to avoid stale `tsbuildinfo` cache issues.

## Suggested First Checks In Any New Session
1. `git status --short --branch`
2. `bun run check`
3. Confirm DB env (`TURSO_DATABASE_URL`/`DATABASE_URL`) before testing persistence paths
