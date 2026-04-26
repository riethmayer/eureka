"use client";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import Tile from "./index";
import { useGameStore } from "@/zustand/game-store";

describe("Tile intro animation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Signal that tiles mounting in this test should play the intro animation.
    useGameStore.setState({ shouldAnimateOnMount: true });
  });
  afterEach(() => {
    vi.useRealTimers();
    useGameStore.setState(useGameStore.getInitialState(), true);
  });

  const defaults = {
    onClick: vi.fn(),
    className: "",
    id: "5",
    token: "A" as const,
    layer: 0,
    column: 3,
    row: 2,
    active: false,
    animating: null as null,
    grace: false,
  };

  it("has the born class on initial render", () => {
    const { container } = render(<Tile {...defaults} />);
    expect((container.firstChild as HTMLElement).className).toContain("born");
  });

  it("removes the born class after the intro animation completes", async () => {
    // column=3, row=2, layer=0 → introDelay = 3×0.018 + 2×0.018 + 0 = 0.09s
    // timeout = (0.09 + 0.4) × 1000 = 490 ms
    const { container } = render(<Tile {...defaults} />);
    expect((container.firstChild as HTMLElement).className).toContain("born");
    await act(async () => { vi.advanceTimersByTime(500); });
    expect((container.firstChild as HTMLElement).className).not.toContain("born");
  });

  it("sets --intro-delay on the outer div based on column, row, and layer", () => {
    // column=3, row=2, layer=0 → 3×0.018 + 2×0.018 + 0×0.15 = 0.090s
    const { container } = render(<Tile {...defaults} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.getPropertyValue("--intro-delay")).toBe("0.090s");
  });

  it("produces a longer delay for higher layers", () => {
    // column=0, row=0, layer=2 → 0 + 0 + 2×0.15 = 0.300s
    const { container } = render(
      <Tile {...defaults} column={0} row={0} layer={2} />
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.getPropertyValue("--intro-delay")).toBe("0.300s");
  });

  it("born class timeout accounts for longer delays on deep-layer tiles", async () => {
    // column=13, row=7, layer=4 → 13×0.018 + 7×0.018 + 4×0.15 = 0.960s
    // timeout = (0.960 + 0.4) × 1000 = 1360 ms
    const { container } = render(
      <Tile {...defaults} column={13} row={7} layer={4} />
    );
    await act(async () => { vi.advanceTimersByTime(1350); });
    expect((container.firstChild as HTMLElement).className).toContain("born");

    await act(async () => { vi.advanceTimersByTime(20); });
    expect((container.firstChild as HTMLElement).className).not.toContain("born");
  });
});
