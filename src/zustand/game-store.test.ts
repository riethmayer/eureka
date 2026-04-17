import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGameStore, TIME_TO_SOLVE } from "@/zustand/game-store";
import type { GameBoard } from "@/types/game-board";
import { postGameState } from "@/utils/post-game-state";

// Add mock
vi.mock("@/utils/post-game-state", () => ({
  postGameState: vi.fn().mockResolvedValue({ id: "mock-game-id" }),
}));


describe("useGameStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    act(() => {
      useGameStore.setState(useGameStore.getInitialState(), true);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with correct default values", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.step();
      await Promise.resolve();
    });

    expect(result.current.timePassed).toBe(1);
    expect(result.current.levelClear).toBe(false);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.level).toBe(1);
    expect(result.current.timer).toBe(null);
    expect(result.current.name).toBe("");
  });

  it("starts the game correctly", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      // Wait for any pending state updates
      await Promise.resolve();
    });

    expect(result.current.timePassed).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timer).not.toBeNull();
    expect(result.current.levelClear).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it("increases timePassed on each step", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.step();
    });

    expect(result.current.timePassed).toBe(1);

    await act(async () => {
      await result.current.step();
    });

    expect(result.current.timePassed).toBe(2);
  });

  it("sets gameOver to true when time runs out", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      // Verify initial state
      expect(result.current.maxTime).toBe(800);

      // Set time to one second before game over
      result.current.__oneSecondRemaining();
    });

    expect(result.current.timePassed).toBe(799);

    await act(async () => {
      // Take the final step that should trigger game over
      await result.current.step();
    });

    // Verify final state
    expect(result.current.gameOver).toBe(true);
    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.timer).toBeNull();
  });

  it("pauses the game correctly", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      await result.current.pause();
    });

    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.timePassed).toBe(0);
  });

  it("resumes the game correctly", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      await result.current.step();
      await result.current.pause();
      await result.current.resume();
    });

    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timePassed).toBe(1);
  });

  it("does not decrease timePassed past maxTime", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
      result.current.step();
      await Promise.resolve();
    });

    expect(result.current.timePassed).toBe(800);
  });

  it("sets timer to null when gameOver is true", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
      await Promise.resolve();
    });

    expect(result.current.timer).toBeNull();
  });

  it("resets the game state on start", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      result.current.__oneSecondRemaining();
      await result.current.step();
    });

    expect(postGameState).toHaveBeenCalled();
    expect(result.current.gameOver).toBe(true);

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.timePassed).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
  });

  // Idempotence tests
  it("start action is idempotent", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.start();
      await Promise.resolve();
    });

    expect(result.current.timePassed).toBe(0);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
  });

  it("pause action is idempotent", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      await result.current.step();
      await result.current.pause();
    });

    expect(result.current.timer).toBe(null);

    await act(async () => {
      await result.current.pause();
    });

    expect(result.current.timer).toBe(null);

    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.timePassed).toBe(1);
  });

  it("resume action is idempotent", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.pause();
      result.current.resume();
      await Promise.resolve();
    });

    const timer = result.current.timer;

    await act(async () => {
      result.current.resume();
      await Promise.resolve();
    });

    const { result: secondResult } = renderHook(() => useGameStore());

    await act(async () => {
      await Promise.resolve();
    });

    const newTimer = secondResult.current.timer;
    expect(timer).toBe(newTimer);
    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timePassed).toBe(0);
  });

  it("scoredPair increases score by 2", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.scoredPair();
      await Promise.resolve();
    });

    expect(result.current.score).toBe(2);
  });

  it("levelCleared pauses the game and increases level and timeRemaining", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      await result.current.levelCleared();
    });

    expect(result.current.levelClear).toBe(true);
    expect(result.current.level).toBe(2);
    expect(result.current.maxTime).toBe(TIME_TO_SOLVE * 2);
    expect(result.current.isGameRunning()).toBe(false);
  });

  it("endGame sets gameOver to true", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.endGame();
    });

    expect(result.current.gameOver).toBe(true);
  });

  it("doesn't allow selection of covered tiles (same column, same topFactor)", () => {
    const { result } = renderHook(() => useGameStore());

    const testBoard = {
      // covered: layer 1 tile at same column with matching topFactor (row+layer)
      "10": { layer: 0, row: 1, column: 5, token: "0", active: false },
      "20": { layer: 1, row: 0, column: 5, token: "1", active: false }, // row+layer = 1 = 10's row+layer

      // not covered: different column, so no overlap
      "30": { layer: 0, row: 3, column: 8, token: "2", active: false }
    } as unknown as GameBoard;

    act(() => {
      useGameStore.setState({ gameBoard: testBoard });
    });

    expect(result.current.allowedforSelection("10")).toBe(false);

    expect(result.current.allowedforSelection("30")).toBe(true);
  });
});

describe("Highscore Rank", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    (postGameState as any).mockResolvedValue({ id: "mock-game-id" });
    await act(async () => {
      useGameStore.setState(useGameStore.getInitialState(), true);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initialises lastGameRank as null", () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.lastGameRank).toBeNull();
  });

  it("sets lastGameRank when gameId is found in highscores response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { id: "other-id", rank: 1 },
              { id: "mock-game-id", rank: 2 },
              { id: "another-id", rank: 3 },
            ],
          }),
      })
    );

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.endGame();
    });

    expect(result.current.lastGameRank).toBe(2);
  });

  it("leaves lastGameRank null when gameId is not in the top 10", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { id: "other-id-1", rank: 1 },
              { id: "other-id-2", rank: 2 },
            ],
          }),
      })
    );

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.endGame();
    });

    expect(result.current.lastGameRank).toBeNull();
  });

  it("leaves lastGameRank null when the highscores fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.endGame();
    });

    expect(result.current.lastGameRank).toBeNull();
  });

  it("clears lastGameRank and gameOverRank on start()", async () => {
    act(() => {
      useGameStore.setState({ lastGameRank: 3, gameOverRank: 3 });
    });

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
    });

    // start() resets all state — the toast fires on the play page before
    // navigation, so there's no need to preserve rank across start().
    expect(result.current.lastGameRank).toBeNull();
    expect(result.current.gameOverRank).toBeNull();
  });

  it("sets gameOverRank alongside lastGameRank on endGame()", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [{ id: "mock-game-id", rank: 3 }],
          }),
      })
    );

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.endGame();
    });

    expect(result.current.lastGameRank).toBe(3);
    expect(result.current.gameOverRank).toBe(3);
    expect(result.current.gameOver).toBe(true);
  });

  it("sets gameOver only after save and rank fetch complete", async () => {
    let resolveHighscores!: (v: unknown) => void;
    const highscoresPromise = new Promise((res) => { resolveHighscores = res; });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue({ json: () => highscoresPromise })
    );

    const { result } = renderHook(() => useGameStore());

    let endGameDone = false;
    act(() => { result.current.start(); });
    const endGamePromise = act(async () => {
      await result.current.endGame();
      endGameDone = true;
    });

    // gameOver should still be false while highscores fetch is pending
    expect(result.current.gameOver).toBe(false);

    resolveHighscores({ success: true, data: [{ id: "mock-game-id", rank: 1 }] });
    await endGamePromise;

    expect(endGameDone).toBe(true);
    expect(result.current.gameOver).toBe(true);
  });
});

describe("Restart", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    (postGameState as any).mockResolvedValue({ id: "mock-game-id" });
    await act(async () => {
      useGameStore.setState(useGameStore.getInitialState(), true);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("never sets gameOver — stays in play flow", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    }));

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.restart();
    });

    expect(result.current.gameOver).toBe(false);
  });

  it("sets lastGameRank so the toast fires on the new board (rank found)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: [{ id: "mock-game-id", rank: 2 }],
      }),
    }));

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.restart();
    });

    expect(result.current.lastGameRank).toBe(2);
    // gameOverRank must NOT be set — restart doesn't go through game-over page
    expect(result.current.gameOverRank).toBeNull();
  });

  it("does not set lastGameRank when rank is not in top 10", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] }),
    }));

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.restart();
    });

    expect(result.current.lastGameRank).toBeNull();
  });

  it("resets game state (new board, score 0) before setting the toast rank", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: [{ id: "mock-game-id", rank: 1 }],
      }),
    }));

    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      // Score a pair before restart to confirm score is reset
      await result.current.scoredPair();
      await result.current.restart();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.gameId).toBeNull();
    expect(result.current.lastGameRank).toBe(1);
  });
});

describe("Board Generation", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    (postGameState as any).mockResolvedValue({ id: "mock-game-id" });
    await act(async () => {
      useGameStore.setState(useGameStore.getInitialState(), true);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts at 0 before any game begins", () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.boardGeneration).toBe(0);
  });

  it("is set to a non-zero timestamp after start()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); });
    expect(result.current.boardGeneration).toBeGreaterThan(0);
  });

  it("changes to a new value on each call to start()", async () => {
    vi.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(2000);
    const { result } = renderHook(() => useGameStore());

    await act(async () => { await result.current.start(); });
    expect(result.current.boardGeneration).toBe(1000);

    await act(async () => { await result.current.start(); });
    expect(result.current.boardGeneration).toBe(2000);
  });

  it("is not changed by pause()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); });
    const gen = result.current.boardGeneration;

    await act(async () => { await result.current.pause(); });
    expect(result.current.boardGeneration).toBe(gen);
  });

  it("is not changed by resume()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); await result.current.pause(); });
    const gen = result.current.boardGeneration;

    await act(async () => { await result.current.resume(); });
    expect(result.current.boardGeneration).toBe(gen);
  });

  it("shouldAnimateOnMount starts false", () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.shouldAnimateOnMount).toBe(false);
  });

  it("shouldAnimateOnMount is set to true by start()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); });
    expect(result.current.shouldAnimateOnMount).toBe(true);
  });

  it("shouldAnimateOnMount is set to true by levelCleared()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); await result.current.levelCleared(); });
    expect(result.current.shouldAnimateOnMount).toBe(true);
  });

  it("shouldAnimateOnMount is not changed by pause() or resume()", async () => {
    const { result } = renderHook(() => useGameStore());
    await act(async () => { await result.current.start(); });
    // Simulate tiles clearing the flag after mount
    act(() => { useGameStore.setState({ shouldAnimateOnMount: false }); });

    await act(async () => { await result.current.pause(); });
    expect(result.current.shouldAnimateOnMount).toBe(false);

    await act(async () => { await result.current.resume(); });
    expect(result.current.shouldAnimateOnMount).toBe(false);
  });
});

describe("Game State Saving", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    (postGameState as any).mockResolvedValue({ id: "mock-game-id" });
    await act(async () => {
      useGameStore.setState(useGameStore.getInitialState(), true);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a new game on first save", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.saveGameState();
    });

    expect(postGameState).toHaveBeenCalledOnce();
    expect(result.current.gameId).toBe("mock-game-id");
  });

  it("updates existing game on subsequent saves", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      // Score two pairs then explicitly save (scoredPair no longer auto-saves)
      await result.current.scoredPair();
      await result.current.scoredPair();
      await result.current.saveGameState();
    });

    expect(postGameState).toHaveBeenCalledOnce();
    expect(postGameState).toHaveBeenCalledWith(
      expect.objectContaining({
        id: null,
        score: 4,
      })
    );
    expect(result.current.gameId).toBe("mock-game-id");

    await act(async () => {
      await result.current.scoredPair();
      await result.current.saveGameState();
    });

    expect(postGameState).toHaveBeenLastCalledWith(
      expect.objectContaining({
        id: "mock-game-id",
        score: 6,
      })
    );
  });

  it("saves game state on pause", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.pause();
    });

    expect(postGameState).toHaveBeenCalled();
  });

  it("saves game state on level clear", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await result.current.levelCleared();
    });

    expect(postGameState).toHaveBeenCalled();
  });

  it("saves game state on game over", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
    });

    expect(postGameState).toHaveBeenCalled();
  });

  it("autosaves every 60 seconds", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      await Promise.resolve();
    });

    expect(postGameState).not.toHaveBeenCalled();

    await act(async () => {
      for (let i = 0; i < 59; i++) {
        result.current.step();
      }
      await Promise.resolve();
    });

    expect(postGameState).not.toHaveBeenCalled();

    await act(async () => {
      result.current.step();
      await Promise.resolve();
    });

    expect(postGameState).toHaveBeenCalled();
  });

  it("resets gameId when starting a new game to null", async () => {
    // saving the game will set the gameId, but that happens only if progress in the game was made
    const { result } = renderHook(() => useGameStore());

    // Start and save a game
    await act(async () => {
      await result.current.start();
    });

    await act(async () => {
      await result.current.saveGameState();
    });

    expect(result.current.gameId).toBe("mock-game-id");

    // Start a new game
    await act(async () => {
      await result.current.start();
    });

    expect(result.current.gameId).toBeNull();
  });

  it("does not autosave when game is paused", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      await result.current.pause();
    });

    vi.clearAllMocks();

    // Simulate 60 steps
    for (let i = 0; i < 60; i++) {
      await act(async () => {
        await result.current.step();
      });
    }

    expect(postGameState).not.toHaveBeenCalled();
  });

  it("does not autosave when game is over", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      await result.current.start();
      result.current.__oneSecondRemaining();
      await result.current.step();
    });

    expect(result.current.gameOver).toBe(true);

    vi.clearAllMocks();

    await act(async () => {
      for (let i = 0; i < 60; i++) {
        await result.current.step();
      }
    });

    expect(postGameState).not.toHaveBeenCalled();
  });
});
