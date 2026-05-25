import type { Token, GameBoard } from "@/types/game-board";
import { tokens, allTokens, gameBoardLayout } from "@/types/game-board";
import { shuffleInPlace } from "@/utils/shuffle";
import {
  getOrderStrategy,
  fallbackStrategy,
  type OrderStrategy,
  type RemovalOrder,
} from "@/utils/order-strategies";

/**
 * Why this file exists in this shape
 * ----------------------------------
 * Dropping all 144 tokens onto the fixed turtle layout at random — the obvious
 * approach — frequently produces *unsolvable* boards: the player runs into a
 * deadlock where tiles remain but no two reachable tiles match. Whether a board
 * can be won at all becomes luck of the draw, which is exactly what we don't
 * want in a game meant to reward skill.
 *
 * The fix is "solvability by construction": instead of dealing tokens and
 * *hoping* a solution exists, we generate the board by recording one.
 *
 *   1. Peel the layout into a valid removal order — repeatedly take two
 *      currently-free positions and remove them, until the board is empty.
 *      Because freeness is purely geometric and monotone (see board-rules.ts),
 *      this only depends on positions, not tokens, and always empties the board.
 *   2. Lay matched token pairs onto that removal order. Replaying the order then
 *      wins the game, so the board is guaranteed solvable — for *every* token
 *      assignment, since tokens never affect freeness.
 *
 * Boards stay fully varied (the peel order and token assignment are randomised
 * per deal); only the *guarantee* of solvability is new.
 *
 * Step 1's policy lives behind a port — see order-strategies.ts — so the peel
 * order can be experimented with locally without touching this construction.
 */

// A deterministic order of the (constant) layout, computed once via the
// fallback strategy. Used if a chosen strategy strands. If this ever throws,
// the layout itself is not fully clearable and the game is broken at the root.
let fallbackOrder: RemovalOrder | undefined;
const guaranteedOrder = (): RemovalOrder => {
  if (fallbackOrder === undefined) {
    const order = fallbackStrategy.peel(() => 0);
    if (!order) {
      throw new Error(
        "gameBoardLayout is not fully clearable under the current selection rules"
      );
    }
    fallbackOrder = order;
  }
  return fallbackOrder;
};

export type SolvableDeal = {
  board: GameBoard;
  /** The removal order used to build the board — replaying it wins the game. */
  solution: RemovalOrder;
};

/**
 * Deal a board that is guaranteed solvable, together with a winning solution.
 * `random` is injectable for deterministic tests; production uses Math.random.
 * `strategy` selects the peel order policy; it defaults to the resolved active
 * strategy (production default unless overridden locally — see getOrderStrategy).
 */
export const dealSolvableBoard = (
  level = 1,
  random: () => number = Math.random,
  strategy: OrderStrategy = getOrderStrategy()
): SolvableDeal => {
  let pairs: RemovalOrder | null = null;
  for (let attempt = 0; attempt < 25 && !pairs; attempt++) {
    pairs = strategy.peel(random);
  }
  if (!pairs) pairs = guaranteedOrder();

  // 72 entries — each of the 36 tokens twice — so every token ends up on
  // exactly 4 tiles (two pairs), matching `allTokens`.
  const pairTokens = shuffleInPlace([...tokens, ...tokens], random);

  const board: GameBoard = {};
  const solution: Array<[string, string]> = [];
  pairs.forEach(([a, b], i) => {
    const token: Token = pairTokens[i];
    board[a] = { ...gameBoardLayout[a], token, active: false, animating: null, grace: false };
    board[b] = { ...gameBoardLayout[b], token, active: false, animating: null, grace: false };
    solution.push([a, b]);
  });

  // Grace tiles (takeable from anywhere) ramp slowly so higher levels don't keep
  // getting easier: 1 from level 2, 2 from level 5, 3 from level 15 onward. Grace
  // only *adds* selectability, so it can never turn a solvable board unsolvable.
  const graceCount = level >= 15 ? 3 : level >= 5 ? 2 : level >= 2 ? 1 : 0;
  if (graceCount > 0) {
    shuffleInPlace(Object.keys(board), random)
      .slice(0, graceCount)
      .forEach((idx) => {
        board[idx] = { ...board[idx], grace: true };
      });
  }

  return { board, solution };
};

// used for testing purposes, only initializes the first two tiles
export const initializeTestGameBoard = (): GameBoard => {
  return {
    0: { ...gameBoardLayout[0], active: false, animating: null, grace: false, token: allTokens[0] },
    1: { ...gameBoardLayout[1], active: false, animating: null, grace: false, token: allTokens[0] },
    12: { ...gameBoardLayout[12], active: false, animating: null, grace: false, token: allTokens[1] },
    13: { ...gameBoardLayout[13], active: false, animating: null, grace: false, token: allTokens[1] },
  } as GameBoard;
};

// Initializes a guaranteed-solvable game board, filled with matched token pairs.
// Grace tiles ramp slowly with level: 1 from L2, 2 from L5, 3 from L15+.
export const initializeGameBoard = (level = 1): GameBoard =>
  dealSolvableBoard(level).board;

export default initializeGameBoard;
