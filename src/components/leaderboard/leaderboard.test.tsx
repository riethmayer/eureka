import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useGameStore } from "@/zustand/game-store";
import Leaderboard, { type HighscoreRow } from "./index";

vi.mock("@/zustand/game-store", () => ({
  useGameStore: vi.fn(),
}));

const mockedUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn>;

type StorePart = { gameId: string | null; name: string; score: number; level: number };

/** Make useGameStore(selector) read from a fixed mock state. */
const setStore = (partial: Partial<StorePart>) => {
  const state: StorePart = { gameId: null, name: "", score: 0, level: 1, ...partial };
  mockedUseGameStore.mockImplementation((selector: (s: StorePart) => unknown) => selector(state));
};

/** Build a server top-N list (already ranked, newest-ish created_at by index). */
const serverRows = (
  rows: Array<{ id: string; name: string; score: number; level?: number }>
): HighscoreRow[] =>
  rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    score: r.score,
    level: r.level ?? 1,
    created_at: `2026-01-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`,
    rank: i + 1,
  }));

describe("Leaderboard optimistic merge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setStore({}); // no game in progress by default
  });

  it("renders the server list and highlights no one when the store is empty", () => {
    render(
      <Leaderboard
        initial={serverRows([
          { id: "a", name: "Ada", score: 100 },
          { id: "b", name: "Bob", score: 50 },
        ])}
      />
    );

    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("You")).not.toBeInTheDocument();
  });

  it("optimistically inserts the player's just-finished score in the correct position", () => {
    setStore({ gameId: "me", name: "Mia", score: 80, level: 4 });

    render(
      <Leaderboard
        initial={serverRows([
          { id: "a", name: "Ada", score: 100 },
          { id: "b", name: "Bob", score: 50 },
        ])}
      />
    );

    // Mia (80) lands between Ada (100) and Bob (50) and is flagged "You".
    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();

    const ranks = screen
      .getAllByText(/^(Ada|Mia|Bob)$/)
      .map((el) => el.textContent);
    expect(ranks).toEqual(["Ada", "Mia", "Bob"]);
  });

  it("does not duplicate the player when the server list already includes them", () => {
    setStore({ gameId: "me", name: "Mia", score: 80, level: 4 });

    render(
      <Leaderboard
        initial={serverRows([
          { id: "a", name: "Ada", score: 100 },
          { id: "me", name: "Mia", score: 80 },
        ])}
      />
    );

    expect(screen.getAllByText("Mia")).toHaveLength(1);
    expect(screen.getByText("You")).toBeInTheDocument(); // existing row still highlighted
  });

  it("does not highlight when the player's score does not make the top 10", () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({
      id: `r${i}`,
      name: `Player${i}`,
      score: 100,
    }));
    setStore({ gameId: "me", name: "Loser", score: 5, level: 1 });

    render(<Leaderboard initial={serverRows(ten)} />);

    expect(screen.queryByText("Loser")).not.toBeInTheDocument();
    expect(screen.queryByText("You")).not.toBeInTheDocument();
  });

  it("ignores a zero score (nothing scored yet)", () => {
    setStore({ gameId: "me", name: "Mia", score: 0 });

    render(<Leaderboard initial={serverRows([{ id: "a", name: "Ada", score: 100 }])} />);

    expect(screen.queryByText("Mia")).not.toBeInTheDocument();
    expect(screen.queryByText("You")).not.toBeInTheDocument();
  });
});
