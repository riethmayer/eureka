import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";

vi.mock("@/db/select-game", () => ({
  default: vi.fn(),
  getHighscores: vi.fn(),
}));

import getHighscores from "@/db/select-game";

describe("GET /api/highscores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with highscores data on success", async () => {
    const mockHighscores = [
      { id: "1", name: "Alice", score: 20, level: 3, created_at: "2024-01-01", rank: 1 },
      { id: "2", name: "Bob", score: 10, level: 2, created_at: "2024-01-02", rank: 2 },
    ];
    (getHighscores as ReturnType<typeof vi.fn>).mockResolvedValue(mockHighscores);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockHighscores);
  });

  it("returns 500 when getHighscores throws", async () => {
    (getHighscores as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("DB connection failed")
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Internal Server Error");
  });

  it("returns an empty data array when there are no highscores", async () => {
    (getHighscores as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });
});
