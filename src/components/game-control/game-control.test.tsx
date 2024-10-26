import { describe, beforeEach, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useGameStore } from "@/zustand/game-store";
import { usePathname } from "next/navigation";

import GameControl from "@/components/game-control/game-control";

// Replace the GameStore type with a more precise interface
interface GameStore {
  isGameRunning: () => boolean;
  isLevelClear: () => boolean;
  start: () => void;
  resume: () => void;
  continueNextLevel: () => void;
  restart: () => void;
  pause: () => void;
}

// Add a type for the selector function
type GameStoreSelector<T> = (state: GameStore) => T;

// Mock the usePathname hook
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock the useGameStore hook
vi.mock("@/zustand/game-store", () => ({
  useGameStore: vi.fn(),
}));

// Improve the mock implementation
const createMockGameStore = (
  overrides: Partial<GameStore> = {}
): GameStore => ({
  isGameRunning: vi.fn().mockReturnValue(false),
  isLevelClear: vi.fn().mockReturnValue(false),
  start: vi.fn(),
  resume: vi.fn(),
  continueNextLevel: vi.fn(),
  restart: vi.fn(),
  pause: vi.fn(),
  ...overrides,
});

describe("GameControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/play");
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: GameStoreSelector<unknown>) => selector(createMockGameStore())
    );
  });

  it('renders PlayButton when pathname is "/play" and game is not running', () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isGameRunning: vi.fn().mockReturnValue(false) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it('renders PauseButton and RestartButton when pathname is "/play" and game is running', () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isGameRunning: vi.fn().mockReturnValue(true) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });

  it('renders NextLevelButton when pathname is "/play" and level is clear', () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isLevelClear: vi.fn().mockReturnValue(true) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it('renders ResumeButton when pathname is "/paused"', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/paused");

    render(<GameControl />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("renders RestartButton when game is running", () => {
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isGameRunning: vi.fn().mockReturnValue(true) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });
});
