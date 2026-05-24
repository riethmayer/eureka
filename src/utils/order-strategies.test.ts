import { describe, it, expect, afterEach } from "vitest";
import type { GameBoard } from "@/types/game-board";
import { isSelectable } from "@/utils/board-rules";
import { dealSolvableBoard } from "@/utils/init-gameboard";
import {
  STRATEGIES,
  DEFAULT_STRATEGY,
  canonical,
  fallbackStrategy,
  getOrderStrategy,
  setOrderStrategy,
  listOrderStrategies,
} from "@/utils/order-strategies";

const solutionWins = (board: GameBoard, solution: Array<[string, string]>) => {
  const w: GameBoard = structuredClone(board);
  for (const [a, b] of solution) {
    if (!w[a] || !w[b]) return false;
    if (w[a].token !== w[b].token) return false;
    if (!isSelectable(w, a) || !isSelectable(w, b)) return false;
    delete w[a];
    delete w[b];
  }
  return Object.keys(w).length === 0;
};

describe("order strategies (port/adapter)", () => {
  afterEach(() => setOrderStrategy(null)); // never leak an override between tests

  it("every selectable strategy (and the fallback) deals solvable boards", () => {
    for (const strategy of [...Object.values(STRATEGIES), fallbackStrategy]) {
      for (let i = 0; i < 30; i++) {
        const { board, solution } = dealSolvableBoard(3, Math.random, strategy);
        expect(solutionWins(board, solution), `${strategy.name} #${i}`).toBe(true);
      }
    }
  });

  it("canonical (fallback) is deterministic; topDownRandom varies", () => {
    const c1 = canonical.peel(() => 0)!.map((p) => p.join("-")).join(",");
    const c2 = canonical.peel(() => 0)!.map((p) => p.join("-")).join(",");
    expect(c1).toEqual(c2);

    const r1 = STRATEGIES.topDownRandom.peel(Math.random)!.map((p) => p.join("-")).join(",");
    const r2 = STRATEGIES.topDownRandom.peel(Math.random)!.map((p) => p.join("-")).join(",");
    expect(r1).not.toEqual(r2);
  });

  it("resolves to the production default unless overridden", () => {
    expect(getOrderStrategy().name).toBe(DEFAULT_STRATEGY);
    expect(DEFAULT_STRATEGY).toBe("scatter");

    setOrderStrategy("original");
    expect(getOrderStrategy().name).toBe("original");

    setOrderStrategy("canonical"); // not selectable ⇒ ignored → default
    expect(getOrderStrategy().name).toBe(DEFAULT_STRATEGY);

    setOrderStrategy("nonsense"); // unknown name is ignored → default
    expect(getOrderStrategy().name).toBe(DEFAULT_STRATEGY);

    setOrderStrategy(null);
    expect(getOrderStrategy().name).toBe(DEFAULT_STRATEGY);
  });

  it("exposes a strategy catalogue without the internal fallback", () => {
    const names = listOrderStrategies().map((s) => s.name);
    expect(names).toContain("topDownRandom");
    expect(names).toContain("original");
    expect(names).not.toContain("canonical");
    expect(listOrderStrategies().every((s) => s.description.length > 0)).toBe(true);
  });

  // Informational: how often each policy strands (and leans on the fallback).
  // Not an assertion — just a lens for local experimentation.
  it("reports strand rates per strategy", () => {
    const N = 60;
    for (const strategy of Object.values(STRATEGIES)) {
      let stranded = 0;
      for (let i = 0; i < N; i++) if (strategy.peel(Math.random) === null) stranded++;
      console.log(`  ${strategy.name.padEnd(16)} strands ${((100 * stranded) / N).toFixed(1)}% of peels`);
      expect(stranded).toBeLessThanOrEqual(N);
    }
  }, 20000);
});
