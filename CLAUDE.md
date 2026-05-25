# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `yarn dev` - Starts the Next.js development server
- **Build**: `yarn build` - Creates production build
- **Start**: `yarn start` - Runs the production build
- **Typecheck**: `yarn type-check` - Runs TypeScript type checking
- **Lint**: `yarn lint` - Runs ESLint
- **Test**: `yarn test` - Runs all tests using Vitest
- **Test Single File**: `yarn test src/path/to/file.test.ts` - Tests specific file
- **Database**: `yarn generate` - Generate Drizzle migrations, `yarn migrate` - Apply migrations

## Code Style Guidelines

- **Types**: Use strict TypeScript with proper type definitions for all functions, components, and state
- **Imports**: Absolute imports using `@/` paths based on module aliases defined in tsconfig.json
- **Components**: React functional components with TypeScript interfaces
- **Styling**: TailwindCSS for all styling; custom CSS only for animations and layout primitives that Tailwind cannot express (e.g. keyframe animations, CSS custom properties)
- **Testing**: Vitest with React Testing Library, follow the existing pattern of mocking zustand stores
- **State Management**: Zustand for global state (`src/zustand/game-store.ts`)
- **Naming**: camelCase for variables/functions, PascalCase for components/types, use descriptive names
- **Error Handling**: Proper error boundaries and try/catch where needed
- **Early Returns**: Use early returns for conditionals to improve readability
- **Event Handlers**: Prefix event handler functions with "handle" (e.g., handleClick)

## Key Architecture Notes

### Save Queue
`game-store.ts` serialises all DB writes through a module-level `_saveQueue` promise chain so concurrent calls never race on `gameId`. Any code that must read the final saved `gameId` (e.g. `endGame()` needs `gameId` to look up rank) must `await` the action that triggers the save before reading state.

### Board generation & order strategies
Boards are **solvable by construction** (`src/utils/init-gameboard.ts`): the fixed layout is peeled into a removal order of free pairs, then matched token pairs are laid onto it, so replaying the order always wins. Freeness is purely geometric and lives in one shared rule (`src/utils/board-rules.ts` `isSelectable`), reused by both the live game (`allowedforSelection`) and the generator.

The peel order policy is a **ports & adapters seam** (`src/utils/order-strategies.ts`). The port is `OrderStrategy.peel(random)`; selectable adapters only express *which two free tiles to take next* via `peelWith`: `tangled` (**production default**), `scatter`, `topDownRandom`, `original`, `bottomUpRandom`. The layer-greedy strategies (`topDownRandom`/`bottomUpRandom`) always self-pair the top-of-pyramid tiles — a visible "ready-made" cluster of matching pairs at the top; `scatter` (highest+lowest) avoids that but is the most forgiving (most simultaneous matches). `tangled` is the default: it peels low tiles first (fewer matches open at once → harder) but disperses each exposed upper tile into the base, so it's ~20% harder than `scatter` with no top cluster. Solvability holds for every adapter because the shared loop only ever removes currently-free tiles; a policy that strands just returns `null` and `dealSolvableBoard` retries, falling back to `canonical` — a deterministic order kept out of the selectable list (internal safety net only).

Difficulty also scales by level via grace tiles (takeable from anywhere): a slow step ramp of 1 from level 2, 2 from level 5, 3 from level 15+ (`init-gameboard.ts`).

To experiment locally, override the active strategy (resolution: runtime override → localStorage `eureka.orderStrategy` → `NEXT_PUBLIC_ORDER_STRATEGY` env → default). In dev, the `/play` screen shows a strategy badge (`src/components/strategy-switcher`): press `s` / `Shift+S` (or click) to cycle and re-deal; hover for descriptions. From the browser console (any build): `eurekaOrder.set('original')` then start a new game; `eurekaOrder.list()` to see options; `eurekaOrder.set(null)` to reset. Production play is unaffected unless one of those overrides is set.

### Tile animations
Tile animation state lives in `gameBoard[index].animating` (`'match' | 'mismatch' | null`). The `clicked()` action sets the flag and uses `setTimeout` to clear it after the CSS animation completes. CSS classes `tile.match` and `tile.mismatch` are defined in `global.css`.

### Board intro animation
When a new board is dealt, tiles cascade in with a staggered `tile-intro` keyframe (defined in `global.css`). The stagger is driven by a `--intro-delay` CSS custom property set per-tile from `column × 0.018 + row × 0.018 + layer × 0.15` seconds, producing a diagonal wave across the base layer followed by higher layers building up on top.

**How "new game only" is enforced:** `start()` sets `boardGeneration: Date.now()` and `shouldAnimateOnMount: true`. `levelCleared()` also sets `shouldAnimateOnMount: true`. `Turtle` keys each `<Tile>` by `${boardGeneration}-${idx}`, forcing a remount when a new game starts. Each `Tile` initialises its `born` state from `useGameStore.getState().shouldAnimateOnMount` (synchronous read, runs before any effect). The first tile to run its mount effect calls `useGameStore.setState({ shouldAnimateOnMount: false })`, so any later mount — including the remount that happens when the player navigates back from `/paused` — reads `false` and skips the animation. The `born` class is also removed via a `setTimeout` after its animation window has passed, preventing it from re-triggering if the `animating` prop cycles through `mismatch → null` while `born` is still set.

### RankToast
`src/components/rank-toast/index.tsx` reads `lastGameRank` from the store at mount via a `useState` lazy initialiser, copies it to local state, then clears it from the store (deferred one tick via `setTimeout(0)`) so remounts don't re-fire. A Zustand subscriber handles ranks that arrive after mount (e.g. from `restart()`). `start()` resets `lastGameRank` to null — the toast fires before navigation so the rank is already captured in local state.

### Toast CSS centering
Keyframes in `global.css` own the `translateX(-50%)` centering. Do **not** apply Tailwind's `-translate-x-1/2` to the toast element — it would conflict with the keyframe `transform` property and offset the position.

### Cookie-based name persistence
Player name is loaded from cookie in `Navigation` (`src/components/navigation/index.tsx`) via a `hasLoaded` ref guard. The home page saves to cookie only when `name` is non-empty to avoid wiping a stored name on first render.

## Routes

| Path | Description |
|---|---|
| `/` | Landing / name entry |
| `/play` | Active gameplay |
| `/game-over` | Game over with score and rank feedback |
| `/next-level` | Level-clear interstitial |
| `/highscores` | Leaderboard (top 10, server-rendered) |
| `/paused` | Paused state — hides the board so the player can't plan moves while the timer is stopped |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/game` | POST | Create or update a game record |
| `/api/highscores` | GET | Returns top-10 games with rank |