import { describe, it, expect } from "vitest";
import { tokens, gameBoardLayout } from "@/types/game-board";
import type { GameBoard } from "@/types/game-board";
import { dealSolvableBoard } from "@/utils/init-gameboard";
import { isSelectable } from "@/utils/board-rules";

/**
 * Replays a claimed solution against the *real* selection rule. Returns true
 * only if every pair is a legal match (both tiles present, both reachable in
 * the same board state, same token) and the board ends up empty. This is the
 * independent proof that a board is genuinely winnable.
 */
const solutionWins = (
  board: GameBoard,
  solution: Array<[string, string]>
): boolean => {
  const work: GameBoard = structuredClone(board);
  for (const [a, b] of solution) {
    if (!work[a] || !work[b]) return false;
    if (work[a].token !== work[b].token) return false;
    // Both must be reachable with both still on the board (you select one, then
    // the other) — grace tiles aside, this is exactly what the game enforces.
    const reachable = (idx: string) => work[idx].grace || isSelectable(work, idx);
    if (!reachable(a) || !reachable(b)) return false;
    delete work[a];
    delete work[b];
  }
  return Object.keys(work).length === 0;
};

describe("solvable board generation", () => {
  it("deals all 144 positions with the correct token multiset", () => {
    const { board } = dealSolvableBoard();
    expect(Object.keys(board)).toHaveLength(Object.keys(gameBoardLayout).length);

    const counts = new Map<string, number>();
    for (const tile of Object.values(board)) {
      counts.set(tile.token, (counts.get(tile.token) ?? 0) + 1);
    }
    expect(counts.size).toBe(tokens.length);
    for (const token of tokens) {
      expect(counts.get(token)).toBe(4); // 4 copies of every token
    }
  });

  it("every dealt board is solvable across many random deals and levels", () => {
    for (let level = 1; level <= 6; level++) {
      for (let i = 0; i < 60; i++) {
        const { board, solution } = dealSolvableBoard(level);
        expect(solutionWins(board, solution)).toBe(true);
      }
    }
  }, 30000);

  it("is solvable even with a degenerate RNG (forces the fallback path)", () => {
    // A constant RNG makes Fisher-Yates and tie-breaking trivial; the board must
    // still be solvable, exercising the deterministic peel/fallback.
    const { board, solution } = dealSolvableBoard(1, () => 0);
    expect(solutionWins(board, solution)).toBe(true);
  });

  it("produces varied boards between deals", () => {
    const fingerprint = (b: GameBoard) =>
      Object.keys(b)
        .sort((a, c) => Number(a) - Number(c))
        .map((k) => b[k].token)
        .join("");
    const a = fingerprint(dealSolvableBoard().board);
    const b = fingerprint(dealSolvableBoard().board);
    expect(a).not.toEqual(b);
  });

  it("grace tiles never break solvability", () => {
    const { board, solution } = dealSolvableBoard(5);
    expect(Object.values(board).filter((t) => t.grace)).toHaveLength(2); // level 5 → 2 grace tiles
    expect(solutionWins(board, solution)).toBe(true);
  });
});
