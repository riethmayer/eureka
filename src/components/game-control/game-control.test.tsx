import {
  describe,
  beforeEach,
  it,
  expect,
  vi,
  MockedFunction,
  Mocked,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { useGameStore } from "@/zustand/game-store";
import { usePathname } from "next/navigation";
import GameControl from "@/components/game-control/game-control";
import type { GameStore } from "@/zustand/game-store";

// Update the selector type
type GameStoreSelector<T> = (state: GameStore) => T;

// Mock the usePathname hook
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Update the mock implementation
vi.mock("@/zustand/game-store", () => ({
  useGameStore: vi.fn(),
}));

// Create a properly typed mock
const createMockGameStore = (overrides = {}): GameStore =>
  ({
    isGameRunning: vi.fn().mockReturnValue(false),
    isLevelClear: vi.fn().mockReturnValue(false),
    ...overrides,
  }) as unknown as GameStore;

// Update the mock type
const mockedUseGameStore = useGameStore as unknown as MockedFunction<
  typeof useGameStore
>;

describe("GameControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/play");
    mockedUseGameStore.mockImplementation(
      (selector: GameStoreSelector<unknown>) => selector(createMockGameStore())
    );
  });

  it('renders PlayButton when pathname is "/play" and game is not running', () => {
    vi.mocked(useGameStore).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isGameRunning: vi.fn().mockReturnValue(false) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it('renders PauseButton and RestartButton when pathname is "/play" and game is running', () => {
    vi.mocked(useGameStore).mockImplementation(
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
    vi.mocked(useGameStore).mockImplementation(
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
    vi.mocked(useGameStore).mockImplementation(
      (selector: GameStoreSelector<unknown>) =>
        selector(
          createMockGameStore({ isGameRunning: vi.fn().mockReturnValue(true) })
        )
    );

    render(<GameControl />);
    expect(screen.getByText("Restart")).toBeInTheDocument();
  });
});
