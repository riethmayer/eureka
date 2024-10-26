/// <reference types="vitest" />
import { vi, describe, beforeEach, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { useGameStore } from "@/zustand/game-store";
import { usePathname } from "next/navigation";

import GameControl from "@/components/game-control/game-control";

// Add this type definition at the top of the file
type GameStore = {
  isGameRunning: () => boolean;
  isLevelClear: () => boolean;
  start: () => void;
  resume: () => void;
  continueNextLevel: () => void;
  restart: () => void;
  pause: () => void;
};

// Mock the usePathname hook
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock the useGameStore hook
vi.mock("@/zustand/game-store", () => ({
  useGameStore: vi.fn(),
}));

describe("GameControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PlayButton when pathname is "/play" and game is not running', () => {
    (usePathname as any).mockReturnValue("/play");
    (useGameStore as any).mockImplementation(
      (selector: (state: GameStore) => any) =>
        selector({
          isGameRunning: () => false,
          isLevelClear: () => false,
          start: vi.fn(),
          resume: vi.fn(),
          continueNextLevel: vi.fn(),
          restart: vi.fn(),
          pause: vi.fn(),
        })
    );

    render(<GameControl />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it('renders PauseButton and RestartButton when pathname is "/play" and game is running', () => {
    (usePathname as any).mockReturnValue("/play");
    (useGameStore as any).mockImplementation(
      (selector: (state: GameStore) => any) =>
        selector({
          isGameRunning: () => true,
          isLevelClear: () => false,
          start: vi.fn(),
          resume: vi.fn(),
          continueNextLevel: vi.fn(),
          restart: vi.fn(),
          pause: vi.fn(),
        })
    );

    render(<GameControl />);
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });

  it('renders NextLevelButton when pathname is "/play" and level is clear', () => {
    (usePathname as any).mockReturnValue("/play");
    (useGameStore as any).mockImplementation(
      (selector: (state: GameStore) => any) =>
        selector({
          isGameRunning: () => false,
          isLevelClear: () => true,
          start: vi.fn(),
          resume: vi.fn(),
          continueNextLevel: vi.fn(),
          restart: vi.fn(),
          pause: vi.fn(), // Add this line
        })
    );

    render(<GameControl />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it('renders ResumeButton when pathname is "/paused"', () => {
    (usePathname as any).mockReturnValue("/paused");
    (useGameStore as any).mockImplementation(
      (selector: (state: GameStore) => any) =>
        selector({
          isGameRunning: () => false,
          isLevelClear: () => false,
          start: vi.fn(),
          resume: vi.fn(),
          continueNextLevel: vi.fn(),
          restart: vi.fn(),
          pause: vi.fn(), // Add this line
        })
    );

    render(<GameControl />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("renders RestartButton when game is running", () => {
    (usePathname as any).mockReturnValue("/play");
    (useGameStore as any).mockImplementation(
      (selector: (state: GameStore) => any) =>
        selector({
          isGameRunning: () => true,
          isLevelClear: () => false,
          start: vi.fn(),
          resume: vi.fn(),
          continueNextLevel: vi.fn(),
          restart: vi.fn(),
          pause: vi.fn(), // Add this line
        })
    );

    render(<GameControl />);
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });
});
