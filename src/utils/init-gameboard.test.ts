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
