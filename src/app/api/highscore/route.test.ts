import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/highscore/route";
import insertHighscore from "@/db/insert-game";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/db/insert-game");
vi.mock("next/cache");

// Mock database client
vi.mock("@/db/client", () => ({
  default: {
    insert: vi.fn(),
    select: vi.fn(),
  },
}));

describe("POST /api/highscore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle valid highscore submission", async () => {
    const mockRequest = new Request("http://localhost:3000/api/highscore", {
      method: "POST",
      body: JSON.stringify({
        name: "Player1",
        score: "100",
        level: "2",
      }),
    });
    const mockHighscore = [
      {
        id: "1",
        name: "Player1",
        score: 100,
        level: 2,
        board: {},
        maxTime: 60,
        timeRemaining: 30,
        createdAt: new Date().toISOString(),
      },
    ];
    vi.mocked(insertHighscore).mockResolvedValue(mockHighscore);

    const response = await POST(mockRequest as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(mockHighscore);
    expect(insertHighscore).toHaveBeenCalledWith({
      name: "Player1",
      score: 100,
      level: 2,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/highscores");
  });

  it("should handle invalid score", async () => {
    const mockRequest = new Request("http://localhost/api/highscore", {
      method: "POST",
      body: JSON.stringify({
        name: "Player1",
        score: "0",
        level: "1",
      }),
    });

    const response = await POST(mockRequest as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toContain("Ignoring request");
    expect(insertHighscore).not.toHaveBeenCalled();
  });

  it("should use default name if not provided", async () => {
    const mockRequest = new Request("http://localhost/api/highscore", {
      method: "POST",
      body: JSON.stringify({
        score: "100",
        level: "1",
      }),
    });
    const mockHighscore = [
      {
        id: "1",
        name: "unknown",
        score: 100,
        level: 1,
        board: {},
        maxTime: 60,
        timeRemaining: 30,
        createdAt: new Date().toISOString(),
      },
    ];
    vi.mocked(insertHighscore).mockResolvedValue(mockHighscore);

    const response = await POST(mockRequest as NextRequest);

    expect(insertHighscore).toHaveBeenCalledWith({
      name: "unknown",
      score: 100,
      level: 1,
    });
  });

  it("should handle server errors", async () => {
    const mockRequest = new Request("http://localhost/api/highscore", {
      method: "POST",
      body: JSON.stringify({
        name: "Player1",
        score: "100",
        level: "1",
      }),
    });

    vi.mocked(insertHighscore).mockRejectedValue(new Error("Database error"));

    const response = await POST(mockRequest as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal Server Error");
  });
});
