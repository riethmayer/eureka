import { describe, it, expect } from "vitest";
import { allTokens, gameBoardLayout } from "@/types/game-board";
import initializeGameBoard from "@/utils/init-gameboard";

describe("initialiseGameBoard", () => {
  it("should return an object", () => {
    const result = initializeGameBoard();
    expect(typeof result).toBe("object");
  });

  it("should return an object with the correct structure", () => {
    const result = initializeGameBoard();
    expect(Object.keys(result)).toHaveLength(allTokens.length);
    Object.values(result).forEach((tile, index) => {
      expect(tile).toHaveProperty("layer", gameBoardLayout[index].layer);
      expect(tile).toHaveProperty("row", gameBoardLayout[index].row);
      expect(tile).toHaveProperty("column", gameBoardLayout[index].column);
      expect(tile).toHaveProperty("active", false);
      expect(tile).toHaveProperty("token");
    });
  });

  it("should shuffle tokens and assign them correctly", () => {
    const initialTokens = [...allTokens]; // Copy the tokens in original sorted order
    const result = initializeGameBoard();
    const tokensInResult = Object.values(result).map((tile) => tile.token);
    expect(tokensInResult).toHaveLength(allTokens.length);
    expect(tokensInResult).toEqual(expect.arrayContaining(allTokens));
    expect(tokensInResult.join(",")).not.toEqual(initialTokens.join(",")); // order should be different
  });
});

describe("grace tiles", () => {
  const graceCount = (level: number) =>
    Object.values(initializeGameBoard(level)).filter((t) => t.grace).length;

  it("level 1 (default) has no grace tiles", () => {
    expect(graceCount(1)).toBe(0);
  });

  it("omitting the level argument has no grace tiles", () => {
    expect(Object.values(initializeGameBoard()).filter((t) => t.grace)).toHaveLength(0);
  });

  // Grace tiles ramp slowly: 1 from level 2, 2 from level 5, 3 from level 15+.
  it("levels 2–4 have exactly 1 grace tile", () => {
    expect(graceCount(2)).toBe(1);
    expect(graceCount(4)).toBe(1);
  });

  it("levels 5–14 have exactly 2 grace tiles", () => {
    expect(graceCount(5)).toBe(2);
    expect(graceCount(14)).toBe(2);
  });

  it("levels 15+ have exactly 3 grace tiles", () => {
    expect(graceCount(15)).toBe(3);
    expect(graceCount(30)).toBe(3);
  });

  it("all non-grace tiles have grace: false", () => {
    const board = initializeGameBoard(3);
    Object.values(board).forEach((tile) => {
      expect(typeof tile.grace).toBe("boolean");
    });
  });
});
