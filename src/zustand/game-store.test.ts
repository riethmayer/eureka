import { describe, it, expect, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGameStore, TIME_TO_SOLVE } from "@/zustand/game-store";
import type { GameBoard } from "@/types/game-board";

vi.mock("@/utils/post-highscore", () => {
  return {
    postHighscore: vi.fn(),
  };
});

import { postHighscore } from "@/utils/post-highscore";

describe("useGameStore", () => {
  afterEach(() => {
    // Reset the store state after each test
    useGameStore.setState(useGameStore.getState(), true);
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() => useGameStore());

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
    expect(result.current.levelClear).toBe(false);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.level).toBe(1);
    expect(result.current.timer).toBe(null);
    expect(result.current.name).toBe("");
  });

  it("starts the game correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
    });

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timer).not.toBeNull();
    expect(result.current.levelClear).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it("decreases timeRemaining on each step", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.step();
    });

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE - 1);

    act(() => {
      result.current.step();
    });

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE - 2);
  });

  it("sets gameOver to true when time runs out", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.gameOver).toBe(true);
    expect(result.current.isGameRunning()).toBe(false);
  });

  it("pauses the game correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.pause();
    });

    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
  });

  it("resumes the game correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.step();
      result.current.pause();
      result.current.resume();
    });

    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE - 1);
  });

  it("does not decrease timeRemaining below 0", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
      result.current.step();
    });

    expect(result.current.timeRemaining).toBe(0);
  });

  it("sets timer to null when gameOver is true", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
    });

    expect(result.current.timer).toBeNull();
  });

  it("resets the game state on start", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.__oneSecondRemaining();
      result.current.step();
    });

    expect(postHighscore).toHaveBeenCalledWith({
      name: "unknown",
      score: 0,
      level: 1,
    });

    expect(result.current.gameOver).toBe(true);

    act(() => {
      result.current.start();
    });

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
  });

  // Idempotence tests
  it("start action is idempotent", () => {
    const { result } = renderHook(() => useGameStore());

    let timer = result.current.timer;
    act(() => {
      result.current.start();
      timer = result.current.timer;
      result.current.start();
    });
    const newTimer = result.current.timer;

    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
    expect(result.current.gameOver).toBe(false);
    expect(result.current.isGameRunning()).toBe(true);
    expect(timer).toBe(newTimer);
  });

  it("pause action is idempotent", () => {
    const { result } = renderHook(() => useGameStore());
    let timer = result.current.timer;

    act(() => {
      result.current.start();
      result.current.step();
      result.current.pause();
    });

    expect(result.current.timer).toBe(null);

    act(() => {
      result.current.pause();
    });

    expect(result.current.timer).toBe(null);

    expect(result.current.isGameRunning()).toBe(false);
    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE - 1);
  });

  it("resume action is idempotent", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.pause();
      result.current.resume();
    });

    const timer = result.current.timer;

    act(() => {
      result.current.resume();
    });

    const { result: secondResult } = renderHook(() => useGameStore());

    const newTimer = secondResult.current.timer;
    expect(timer).toBe(newTimer);
    expect(result.current.isGameRunning()).toBe(true);
    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE);
  });

  it("scoredPair increases score by 2", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.scoredPair();
    });

    expect(result.current.score).toBe(2);
  });

  it("levelCleared pauses the game and increases level and timeRemaining", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.start();
      result.current.levelCleared();
    });

    expect(result.current.levelClear).toBe(true);
    expect(result.current.level).toBe(2);
    expect(result.current.timeRemaining).toBe(TIME_TO_SOLVE * 2);
    expect(result.current.isGameRunning()).toBe(false);
  });

  it("endGame sets gameOver to true", async () => {
    const { result } = renderHook(() => useGameStore());

    await act(async () => {
      result.current.start();
      result.current.endGame();
    });

    expect(postHighscore).toHaveBeenCalledWith({
      name: "unknown",
      score: 0,
      level: 1,
    });

    expect(result.current.gameOver).toBe(true);
  });

  it("doesn't allow selection of partially covered tiles", () => {
    const { result } = renderHook(() => useGameStore());
    
    const testBoard = {
      "10": { layer: 0, row: 1, column: 5, token: "0", active: false },
      
      "20": { layer: 1, row: 0, column: 6, token: "1", active: false },
      
      "30": { layer: 0, row: 3, column: 8, token: "2", active: false }
    } as unknown as GameBoard;
    
    act(() => {
      useGameStore.setState({ gameBoard: testBoard });
    });
    
    expect(result.current.allowedforSelection("10")).toBe(false);
    
    expect(result.current.allowedforSelection("30")).toBe(true);
  });
});
