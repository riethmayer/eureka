# Eureka Agent Initialization

## Project Purpose
Eureka is a Mahjong Solitaire game built with Next.js (App Router), React, TypeScript, Zustand, Tailwind, and Drizzle ORM (Turso/SQLite). Core gameplay runs in client-side Zustand state; persistence and highscores are written/read via Next.js API routes.

## Current Repository State (Reviewed 2026-04-17)
- Branch: `master`
- Test suite: **77 tests across 6 files**, all passing

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
1. User enters name on `/` and clicks Start → `start()` resets state, sets `boardGeneration: Date.now()` and `shouldAnimateOnMount: true`, starts timer.
2. `/play` always renders `GameBoard` (not gated on `isGameRunning`). Tiles cascade in with a staggered intro animation on every genuinely new board.
3. Tile clicks call `clicked(index)`, evaluate selection rules, animate and remove matched pairs, increment score.
4. Timer ticks via `step()` every second; autosave triggers every 60 seconds.
5. Save path: `postGameState()` → `POST /api/game` → DB layer. All saves are serialised through `_saveQueue` to prevent `gameId` races.
6. Level clear → `levelCleared()` sets `shouldAnimateOnMount: true`, pauses game, routes to `/next-level` interstitial. Board intro replays when returning to `/play`.
7. Time up → `endGame()` saves final state, GETs `/api/highscores` for rank, then sets `gameOver + lastGameRank + gameOverRank` atomically. Play page routes to `/game-over`.
8. Restart → `restart()` stops the timer and sets `isRestarting: true` synchronously (board hidden, "Restarting game…" shown), then saves + fetches rank in the background before calling `start()`.
9. `lastGameRank` drives `RankToast` (confetti + animated toast on the play page). `gameOverRank` drives the rank display on `/game-over` (never cleared by the toast).

## Important Invariants
- **Save queue**: `_saveQueue` is a module-level promise chain in `game-store.ts`. Do NOT bypass it or read `gameId` before the queued save resolves.
- **`restart()` saves before calling `start()`**: `start()` resets `gameId` to null. `restart()` must `await saveGameState()` before calling `start()` or the rank lookup will use a null `gameId`.
- **`endGame()` sets state atomically**: `gameOver`, `lastGameRank`, and `gameOverRank` are set in a single `set()` call after all async work completes. This prevents the game-over page from rendering with a stale null rank.
- **`lastGameRank` vs `gameOverRank`**: `RankToast` clears `lastGameRank` after displaying it. `gameOverRank` is never cleared by the toast — the `/game-over` page reads it independently.
- **Board intro animation**: `shouldAnimateOnMount` must be `true` at the moment tiles mount for the animation to play. `start()` and `levelCleared()` set it; the first tile to run its mount effect clears it. Do NOT set it on pause/resume.
- **`isRestarting` resets via `initialState`**: `start()` spreads `initialState` which contains `isRestarting: false`. No explicit reset is needed in `restart()`.
- **Toast CSS centering**: Keyframes in `global.css` own `translateX(-50%)`. Do NOT also apply Tailwind `-translate-x-1/2` on the toast element — it conflicts with keyframe `transform`.
- **Cookie loading**: Player name is loaded from cookie in `Navigation` with a `hasLoaded` ref guard. The home page only writes to cookie when `name` is non-empty.

## Data Layer Notes
- Active table: `games` (game persistence and highscores).
- Additional schema tables (`game_moves`, `game_snapshots`, `game_states`) exist but are not used in the current app flow.
- Local fallback database: `file:./local.db`.

## Quality Snapshot (2026-04-17)
- `yarn lint`: passes
- `yarn type-check`: passes
- `yarn test`: 77 tests, 6 files, all passing
- `yarn build`: passes

## Known Pitfalls
- `tsconfig.json` includes `.next/types/**/*.ts`, so stale `.next` artifacts can affect local type checks.
- The `type-check` script runs with `--incremental false` to avoid stale `tsbuildinfo` cache issues.
- Tile animation state (`animating: 'match' | 'mismatch' | null`) lives in `gameBoard[index]`. Clicks on tiles with `animating` set are silently ignored.
- Tile intro animation uses a `born` React state initialised from `shouldAnimateOnMount`. Because it's a `useState` lazy initialiser (not a selector), it only runs on mount — changing `shouldAnimateOnMount` in the store after a tile is already mounted has no effect on that tile.

## Suggested First Checks In Any New Session
1. `git status --short --branch`
2. `yarn type-check && yarn lint`
3. `yarn test --run`
4. Confirm DB env (`TURSO_DATABASE_URL`) before testing persistence paths
