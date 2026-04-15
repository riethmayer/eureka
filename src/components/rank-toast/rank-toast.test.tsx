import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useGameStore } from "@/zustand/game-store";
import confetti from "canvas-confetti";
import RankToast from "./index";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

vi.mock("@/zustand/game-store", () => ({
  useGameStore: Object.assign(vi.fn(), { setState: vi.fn() }),
}));

const mockedUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn> & {
  setState: ReturnType<typeof vi.fn>;
};

const mockRank = (lastGameRank: number | null) => {
  mockedUseGameStore.mockImplementation((selector: (s: { lastGameRank: number | null }) => unknown) =>
    selector({ lastGameRank })
  );
};

/** Finds the innermost element whose collapsed textContent contains the given string. */
const byContent = (text: string) =>
  screen.getByText((_, el) => {
    if (!el) return false;
    const normalized = (el.textContent ?? "").replace(/\s+/g, " ");
    if (!normalized.includes(text)) return false;
    // Exclude ancestors — only match if no direct child already contains the text
    return !Array.from(el.children).some((child) =>
      (child.textContent ?? "").replace(/\s+/g, " ").includes(text)
    );
  });

const VISIBLE_MS  = 5000;
const FADE_OUT_MS = 300;

describe("RankToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockRank(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Visibility ────────────────────────────────────────────────────

  it("renders nothing when lastGameRank is null", () => {
    render(<RankToast />);
    expect(screen.queryByText(/ranked/i)).not.toBeInTheDocument();
  });

  it("shows the toast when lastGameRank is set", () => {
    mockRank(5);
    render(<RankToast />);
    expect(byContent("ranked #5")).toBeInTheDocument();
  });

  // ── Podium content ────────────────────────────────────────────────

  it("shows Champion label and gold medal for rank 1", () => {
    mockRank(1);
    render(<RankToast />);
    expect(screen.getByText("Champion!")).toBeInTheDocument();
    expect(screen.getByText("🥇")).toBeInTheDocument();
    expect(byContent("ranked #1")).toBeInTheDocument();
  });

  it("shows Runner-up label and silver medal for rank 2", () => {
    mockRank(2);
    render(<RankToast />);
    expect(screen.getByText("Runner-up!")).toBeInTheDocument();
    expect(screen.getByText("🥈")).toBeInTheDocument();
    expect(byContent("ranked #2")).toBeInTheDocument();
  });

  it("shows 3rd Place label and bronze medal for rank 3", () => {
    mockRank(3);
    render(<RankToast />);
    expect(screen.getByText("3rd Place!")).toBeInTheDocument();
    expect(screen.getByText("🥉")).toBeInTheDocument();
    expect(byContent("ranked #3")).toBeInTheDocument();
  });

  it("shows non-podium toast for rank 4", () => {
    mockRank(4);
    render(<RankToast />);
    expect(byContent("ranked #4")).toBeInTheDocument();
    expect(screen.getByText(/keep playing/i)).toBeInTheDocument();
  });

  it("shows non-podium toast for rank 10", () => {
    mockRank(10);
    render(<RankToast />);
    expect(byContent("ranked #10")).toBeInTheDocument();
  });

  // ── Confetti ──────────────────────────────────────────────────────

  it("fires confetti for rank 1", () => {
    mockRank(1);
    render(<RankToast />);
    expect(confetti).toHaveBeenCalled();
  });

  it("fires confetti for rank 2", () => {
    mockRank(2);
    render(<RankToast />);
    expect(confetti).toHaveBeenCalled();
  });

  it("fires confetti for rank 3", () => {
    mockRank(3);
    render(<RankToast />);
    expect(confetti).toHaveBeenCalled();
  });

  it("does not fire confetti for rank 4", () => {
    mockRank(4);
    render(<RankToast />);
    expect(confetti).not.toHaveBeenCalled();
  });

  it("fires three confetti bursts for rank 1 after delays", async () => {
    mockRank(1);
    render(<RankToast />);
    expect(confetti).toHaveBeenCalledTimes(1);

    await act(async () => { vi.advanceTimersByTime(400); });
    expect(confetti).toHaveBeenCalledTimes(3);
  });

  // ── Store cleanup ─────────────────────────────────────────────────

  it("clears lastGameRank in the store after display (deferred to next tick)", async () => {
    mockRank(2);
    render(<RankToast />);
    // setState is deferred via setTimeout(0) to avoid synchronous setState in effect
    await act(async () => { vi.advanceTimersByTime(0); });
    expect(mockedUseGameStore.setState).toHaveBeenCalledWith({ lastGameRank: null });
  });

  it("does not re-fire when lastGameRank is already null on remount", () => {
    mockRank(null);
    render(<RankToast />);
    expect(mockedUseGameStore.setState).not.toHaveBeenCalled();
    expect(confetti).not.toHaveBeenCalled();
  });

  // ── Auto-dismiss ──────────────────────────────────────────────────

  it("hides the toast after VISIBLE_MS", async () => {
    mockRank(6);
    render(<RankToast />);
    expect(byContent("ranked #6")).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(VISIBLE_MS); });
    expect(screen.queryByText((_, el) =>
      (el?.textContent ?? "").replace(/\s+/g, " ").includes("ranked #6")
    )).not.toBeInTheDocument();
  });

  it("applies fade-out class before hiding", async () => {
    mockRank(7);
    const { container } = render(<RankToast />);

    const toastBefore = container.firstChild as HTMLElement;
    expect(toastBefore.className).toContain("animate-toast-in");

    await act(async () => { vi.advanceTimersByTime(VISIBLE_MS - FADE_OUT_MS); });
    expect(toastBefore.className).toContain("animate-toast-out");
  });
});
