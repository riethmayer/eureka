# Eureka Agent Initialization

## Project Purpose
Eureka is a Mahjong Solitaire game built with Next.js (App Router), React, TypeScript, Zustand, Tailwind, and Drizzle ORM (Turso/SQLite). Core gameplay runs in client-side Zustand state; persistence and highscores are written/read via Next.js API routes.

## Current Repository State (Reviewed 2026-04-13)
- Branch: `master`
- Latest commits: `ddbb619` (test: add RankToast tests and serialise save queue), `94d6c9a` (feat: highscores, rank toast with confetti, navigation improvements)
- Test suite: **57 tests across 5 files**, all passing

## Quick Start
1. Install dependencies: `yarn install`
2. Set DB URL (local default is valid): `TURSO_DATABASE_URL="file:./local.db"`
3. Start dev server: `yarn dev`
4. Open: `http://localhost:3000`

## Useful Commands
- `yarn dev` - local development
- `yarn build` - production build
- `yarn start` - serve production build
- `yarn lint` - ESLint
- `yarn type-check` - TypeScript checks
- `yarn test` - run Vitest (watch mode)
- `yarn test src/path/to/file.test.ts` - run a single test file
- `yarn generate` - generate Drizzle migrations
- `yarn migrate` - apply/push migrations

## High-Value File Map
- App shell and metadata: `src/app/layout.tsx`
- Landing/start page: `src/app/page.tsx`
- Main gameplay route: `src/app/play/page.tsx`
- Game over page: `src/app/game-over/page.tsx`
- Highscores page (server-rendered): `src/app/highscores/page.tsx`
- Global game state/actions: `src/zustand/game-store.ts`
- Game board generation: `src/utils/init-gameboard.ts`
- Tile layout and token model: `src/types/game-board.ts`
- API persistence endpoint: `src/app/api/game/route.ts`
- API highscores endpoint: `src/app/api/highscores/route.ts`
- DB client and schema: `src/db/client.ts`, `src/db/schema.ts`
- Save/update game state: `src/db/insert-game.ts`
- Highscores query: `src/db/select-game.ts`
- Navigation bar (cookie load, pause on nav): `src/components/navigation/index.tsx`
- Rank toast (confetti, fade): `src/components/rank-toast/index.tsx`
- Global styles + keyframe animations: `src/styles/global.css`

## Runtime Flow
1. User enters name on `/` and clicks Start → `start()` in Zustand store resets state and starts timer.
2. `/play` renders `GameBoard` while `isGameRunning()` is true.
3. Tile clicks call `clicked(index)`, evaluate selection rules, animate and remove matched pairs, increment score.
4. Timer ticks via `step()` every second; autosave triggers every 60 seconds.
5. Save path: `postGameState()` → `POST /api/game` → DB layer. All saves are serialised through `_saveQueue` to prevent `gameId` races.
6. Level clear → `levelCleared()` pauses game and routes to `/next-level` interstitial.
7. Time up or board cleared → `endGame()` saves final state, then GETs `/api/highscores` to determine `lastGameRank`.
8. `lastGameRank` drives `RankToast` (overlay confetti + animated toast) and the `/game-over` page rank display.

## Important Invariants
- **Save queue**: `_saveQueue` is a module-level promise chain in `game-store.ts`. Do NOT bypass it or read `gameId` before the queued save resolves.
- **`restart()` must `await endGame()`**: `endGame()` snapshots score/gameId before `start()` resets state. Missing the `await` causes saves to capture the reset (score 0, gameId null).
- **`start()` preserves `lastGameRank`**: So the `RankToast` can render after a restart. The toast clears it from the store on first render (not `start()`).
- **Toast CSS centering**: Keyframes in `global.css` own `translateX(-50%)`. Do NOT also apply Tailwind `-translate-x-1/2` on the toast element — it conflicts with keyframe `transform`.
- **Cookie loading**: Player name is loaded from cookie in `Navigation` with a `hasLoaded` ref guard. The home page only writes to cookie when `name` is non-empty.

## Data Layer Notes
- Active table: `games` (game persistence and highscores).
- Additional schema tables (`game_moves`, `game_snapshots`, `game_states`) exist but are not used in the current app flow.
- Local fallback database: `file:./local.db`.

## Quality Snapshot (2026-04-13)
- `yarn lint`: passes
- `yarn type-check`: passes
- `yarn test`: 57 tests, 5 files, all passing
- `yarn build`: passes

## Known Pitfalls
- `tsconfig.json` includes `.next/types/**/*.ts`, so stale `.next` artifacts can affect local type checks.
- The `type-check` script runs with `--incremental false` to avoid stale `tsbuildinfo` cache issues.
- Tile animation state (`animating: 'match' | 'mismatch' | null`) lives in `gameBoard[index]`. Clicks on tiles with `animating` set are silently ignored.

## Suggested First Checks In Any New Session
1. `git status --short --branch`
2. `yarn type-check && yarn lint`
3. `yarn test --run`
4. Confirm DB env (`TURSO_DATABASE_URL`) before testing persistence paths
