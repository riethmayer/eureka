import type { GameBoard } from "@/types/game-board";

/**
 * Whether a tile may currently be picked up.
 *
 * This is the single source of truth for "freeness". Both the live game
 * (`allowedforSelection` in the store) and the solvable-board generator depend
 * on it, so they can never disagree about which tiles are reachable.
 *
 * Crucially, freeness is *purely geometric*: it looks only at a tile's
 * layer/row/column and which tiles are still on the board — never at the token
 * value. It is also *monotone*: removing tiles can only ever free more tiles,
 * never cover one back up. Those two properties are what make
 * solvability-by-construction possible (see init-gameboard.ts).
 *
 * A tile is selectable when:
 *   1. No higher-layer tile in the same column covers it (same `row + layer`
 *      "topFactor" ⇒ visual overlap), and
 *   2. It is exposed on a side — either a special-cased edge tile of the
 *      crooked layer-0 rows / the apex, or the left- or right-most remaining
 *      tile of its (row, layer).
 *
 * (The special-cased indices mirror the original board's hand-tuned edge cases;
 * see the Excalidraw diagram referenced in the store.)
 */
export const isSelectable = (board: GameBoard, index: string): boolean => {
  const tile = board[index];
  if (!tile) return false;
  const { row, layer, column } = tile;

  // 1. Covered by a higher tile in the same column with matching topFactor?
  const isCovered = Object.keys(board).some(
    (j) =>
      board[j].layer > layer &&
      board[j].column === column &&
      board[j].row + board[j].layer === row + layer
  );
  if (isCovered) return false;

  // 2. Exposed on a side.
  switch (true) {
    // layer 0 hand-tuned edge cases
    case index === "30": // left-side top-left
      return board["42"] === undefined;
    case index === "41": // right-side top-right
      return board["55"] === undefined;
    case index === "42" || index === "56": // outermost crooked tiles
      return true;
    case index === "43": // left-side top-right
      return board["42"] === undefined;
    case index === "54": // right-side bottom-right
      return board["55"] === undefined;
    case index === "55": // right-side left crooked
      return board["56"] === undefined;
    // layer 3 — covered by the apex (tile 143) which lives in a sentinel column
    case index === "139" ||
      index === "140" ||
      index === "141" ||
      index === "142":
      return board["143"] === undefined;
    default: {
      const rowItems = Object.keys(board).filter(
        (i) => board[i].row === row && board[i].layer === layer
      );
      return (
        index === rowItems[rowItems.length - 1] || index === rowItems[0]
      );
    }
  }
};

export default isSelectable;
