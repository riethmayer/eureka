import type { Token, GameBoard } from "@/types/game-board";
import { allTokens, gameBoardLayout } from "@/types/game-board";

// Shuffles `allTokens` in a flat array using the Fisher-Yates algorithm.
export const shuffleTiles = (): Token[] => {
  const array = [...allTokens];
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
};

// used for testing purposes, only initializes the first two tiles
export const initializeTestGameBoard = (): GameBoard => {
  return {
    0: { ...gameBoardLayout[0], active: false, animating: null, grace: false, token: allTokens[0] },
    1: { ...gameBoardLayout[1], active: false, animating: null, grace: false, token: allTokens[0] },
    12: { ...gameBoardLayout[12], active: false, animating: null, grace: false, token: allTokens[1] },
    13: { ...gameBoardLayout[13], active: false, animating: null, grace: false, token: allTokens[1] },
  } as GameBoard;
};

// Initializes the game board by filling it with shuffled tokens.
// From level 2 onward, `level` random tiles are marked as grace tiles.
export const initializeGameBoard = (level = 1): GameBoard => {
  const result: GameBoard = {};

  shuffleTiles().forEach((token, index) => {
    result[String(index)] = {
      ...gameBoardLayout[index],
      active: false,
      animating: null,
      grace: false,
      token,
    };
  });

  if (level >= 2) {
    const graceCount = level - 1;
    const indices = Object.keys(result);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.slice(0, graceCount).forEach((idx) => {
      result[idx] = { ...result[idx], grace: true };
    });
  }

  return result;
};

export default initializeGameBoard;
