import type { GameBoard } from "@/types/game-board";
import { gameBoardLayout } from "@/types/game-board";
import { isSelectable } from "@/utils/board-rules";
import { shuffleInPlace } from "@/utils/shuffle";

/**
 * Order strategies — a ports & adapters seam for "how the layout is peeled
 * into a removal order".
 *
 * The board generator (init-gameboard.ts) is solvable *by construction*: it
 * peels the fixed layout into a sequence of free pairs, then lays matched
 * tokens onto that sequence. Which pairs come out, and in what order, is the
 * one interesting variable to experiment with — so it lives behind a port.
 *
 * THE PORT  — `OrderStrategy.peel(random) => RemovalOrder | null`.
 * AN ADAPTER — any policy for choosing the order. The default reproduces the
 *              current production behaviour exactly; others are for local
 *              experimentation (see `getOrderStrategy` resolution below).
 *
 * Solvability is preserved for *every* adapter, because the shared loop only
 * ever removes tiles that are currently free (see `peelWith`). The only way a
 * policy can misbehave is to *strand* (leave <2 free tiles with tiles still on
 * the board); the loop returns `null` in that case and the caller falls back to
 * the canonical adapter. So experiments can only change the *distribution* of
 * boards, never whether a board is winnable.
 */

/** An ordered list of position-pairs; replaying it (matching, in order) wins. */
export type RemovalOrder = Array<[string, string]>;

/** Chooses the next two free tiles to remove. The two returned indices must be
 *  members of `free` (both are guaranteed free at this step). */
export type PairSelector = (
  free: string[],
  board: GameBoard,
  random: () => number
) => [string, string];

export type OrderStrategy = {
  readonly name: string;
  readonly description: string;
  /** Produce a valid removal order, or `null` if this policy stranded. */
  peel: (random: () => number) => RemovalOrder | null;
};

// A throwaway board holding every layout position, used only while peeling.
const buildLayoutBoard = (): GameBoard => {
  const board: GameBoard = {};
  for (const idx of Object.keys(gameBoardLayout)) {
    board[idx] = {
      ...gameBoardLayout[idx],
      token: "0",
      active: false,
      animating: null,
      grace: false,
    };
  }
  return board;
};

/**
 * Build a strategy from a per-step `PairSelector`. The peel loop, the freeness
 * check, and the stranding guard are shared here, so an adapter only has to
 * express its *policy* — which two free tiles to take next.
 */
export const peelWith = (
  name: string,
  description: string,
  select: PairSelector
): OrderStrategy => ({
  name,
  description,
  peel(random) {
    const board = buildLayoutBoard();
    const order: RemovalOrder = [];
    while (Object.keys(board).length > 0) {
      const free = Object.keys(board).filter((i) => isSelectable(board, i));
      if (free.length < 2) return null; // stranded — caller retries / falls back
      const [a, b] = select(free, board, random);
      order.push([a, b]);
      delete board[a];
      delete board[b];
    }
    return order;
  },
});

/* ------------------------------------------------------------------ adapters */

/**
 * DEFAULT (production). Greedy: remove the two highest-layer free tiles, with a
 * random tie-break within a layer. Clearing the top first keeps a lingering
 * high tile from stranding the tiles beneath it; the random tie-break is what
 * varies the pairing — and therefore the board — between deals.
 */
export const topDownRandom = peelWith(
  "topDownRandom",
  "Greedy top-down, random tie-break within a layer (production default).",
  (free, board, random) => {
    shuffleInPlace(free, random);
    // Stable sort by layer (desc) keeps the random order within each layer.
    free.sort((a, b) => board[b].layer - board[a].layer);
    return [free[0], free[1]];
  }
);

/**
 * Original / loose: pick any two free tiles with no layer preference. Produces
 * the most varied pairings but strands more often (the generator then leans on
 * the internal fallback), so it's a good lens for comparing distributions.
 */
export const original = peelWith(
  "original",
  "Pick any two free tiles at random — no layer preference, the loosest pairing.",
  (free, _board, random) => {
    const i = Math.floor(random() * free.length);
    let j = Math.floor(random() * (free.length - 1));
    if (j >= i) j++;
    return [free[i], free[j]];
  }
);

/**
 * Deterministic top-down: highest layer, then lowest index. Ignores `random`,
 * so it yields the *same* removal order every run and never strands. Not a
 * selectable strategy — kept purely as the guaranteed fallback (see below).
 */
export const canonical = peelWith(
  "canonical",
  "Deterministic top-down (highest layer, lowest index). Internal fallback.",
  (free, board) => {
    const sorted = [...free].sort(
      (a, b) => board[b].layer - board[a].layer || Number(a) - Number(b)
    );
    return [sorted[0], sorted[1]];
  }
);

/**
 * Bottom-up: prefer the *lowest*-layer free tiles. The mirror image of the
 * default — a useful contrast to see how peel direction shapes the boards (and
 * how often a policy ends up leaning on the fallback).
 */
export const bottomUpRandom = peelWith(
  "bottomUpRandom",
  "Greedy bottom-up, random tie-break within a layer.",
  (free, board, random) => {
    shuffleInPlace(free, random);
    free.sort((a, b) => board[a].layer - board[b].layer);
    return [free[0], free[1]];
  }
);

/**
 * Scatter: pair the highest free tile with the lowest free tile each step.
 * Removing a top tile every step keeps the peel from stranding (covers cleared
 * promptly), while pairing it with a base tile spreads matches *across* layers.
 * This avoids the "ready-made" look the layer-greedy strategies produce, where
 * the small upper layers get paired within themselves and sit as obvious
 * matched pairs at the top of the pyramid.
 */
export const scatter = peelWith(
  "scatter",
  "Pair the highest free tile with the lowest — matches spread across layers (no ready-made clusters).",
  (free, board, random) => {
    shuffleInPlace(free, random); // randomise ties within a layer
    const byLayer = [...free].sort((a, b) => board[b].layer - board[a].layer);
    return [byLayer[0], byLayer[byLayer.length - 1]]; // highest + lowest
  }
);

/* ------------------------------------------------------------------ registry */

// Selectable strategies (shown in the switcher / catalogue). `canonical` is
// deliberately excluded — it's the deterministic safety net, not a play option.
export const STRATEGIES: Record<string, OrderStrategy> = {
  topDownRandom,
  scatter,
  original,
  bottomUpRandom,
};

// `scatter` is the default: layer-greedy strategies (topDown/bottomUp) always
// pair the top-of-pyramid tiles among themselves, which reads as a "ready-made"
// cluster of matching pairs at the top. scatter spreads matches across layers.
export const DEFAULT_STRATEGY = "scatter";

/** Guaranteed to complete (never strands). Used when a selectable strategy strands. */
export const fallbackStrategy: OrderStrategy = canonical;

export const listOrderStrategies = (): Array<{ name: string; description: string }> =>
  Object.values(STRATEGIES).map((s) => ({ name: s.name, description: s.description }));

/* ----------------------------------------------------- local experimentation */

// Strategy switching is a development-only affordance. In production the
// strategy is operator-controlled (env or default) so that highscores stay
// comparable and players can't change the board distribution they're scored on.
const DEV = process.env.NODE_ENV !== "production";

let runtimeOverride: string | null = null;

/**
 * Override the active strategy for this session. Pass a name from `STRATEGIES`,
 * or `null` to clear. Persists to localStorage (when available) so it survives
 * a reload; the next board dealt uses it.
 */
export const setOrderStrategy = (name: string | null): void => {
  runtimeOverride = name && STRATEGIES[name] ? name : null;
  try {
    if (typeof localStorage !== "undefined") {
      if (runtimeOverride) localStorage.setItem("eureka.orderStrategy", runtimeOverride);
      else localStorage.removeItem("eureka.orderStrategy");
    }
  } catch {
    /* localStorage unavailable (SSR / privacy mode) — in-memory override still applies */
  }
};

/**
 * Resolve the active strategy.
 *   Production: `NEXT_PUBLIC_ORDER_STRATEGY` env → DEFAULT_STRATEGY. Player
 *               overrides (runtime / localStorage) are ignored.
 *   Development: runtime override → localStorage `eureka.orderStrategy` → env →
 *               DEFAULT_STRATEGY, re-read every deal so live switching works.
 */
export const getOrderStrategy = (): OrderStrategy => {
  const fromEnv =
    typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_ORDER_STRATEGY : undefined;
  let name = fromEnv ?? DEFAULT_STRATEGY;
  if (DEV) {
    let fromStorage: string | null = null;
    try {
      if (typeof localStorage !== "undefined") fromStorage = localStorage.getItem("eureka.orderStrategy");
    } catch {
      /* ignore */
    }
    name = runtimeOverride ?? fromStorage ?? fromEnv ?? DEFAULT_STRATEGY;
  }
  return STRATEGIES[name] ?? STRATEGIES[DEFAULT_STRATEGY];
};

// Dev convenience: expose the knobs on window so you can experiment from the
// browser console, e.g. `eurekaOrder.set('original')` then start a new game.
// Not exposed in production — the strategy is locked there.
if (DEV && typeof window !== "undefined") {
  (window as unknown as { eurekaOrder?: unknown }).eurekaOrder = {
    set: setOrderStrategy,
    list: listOrderStrategies,
    current: () => getOrderStrategy().name,
  };
}
