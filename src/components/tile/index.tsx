"use client";
import { useState, useEffect } from "react";
import colour from "./colours";
import { TokenTile } from "@/types/game-board";
import { useGameStore } from "@/zustand/game-store";

export type TileProps = {
  onClick: () => void;
  className: string;
  id: string;
} & TokenTile;

// Returns the unitless row+layer multiplier; CSS multiplies by --tile-h in the stylesheet.
const topFactor = (row: number, layer: number, id: string): string => {
  const crookedFactor = [42, 55, 56, 143].map(String).includes(id) ? 0.5 : 0;
  // 1.02 adds a small gap between rows (matches original 5.1rem / 5rem ratio)
  return ((layer + row - crookedFactor) * 1.02).toFixed(4);
};

const Tile: React.FC<TileProps> = ({
  onClick,
  token,
  id,
  layer,
  column,
  row,
  active,
  animating,
}) => {
  // Stagger: diagonal wave across base layer, then each layer stacks on top.
  // col/row each add ~0–0.25s, layer adds 0–0.6s → total max ~1.1s.
  const introDelay = column * 0.018 + row * 0.018 + layer * 0.15;

  // Read shouldAnimateOnMount synchronously so all tiles in this render batch
  // see the same value before any effect runs.
  const [born, setBorn] = useState(() => useGameStore.getState().shouldAnimateOnMount);

  useEffect(() => {
    if (born) {
      // Clear the flag so a subsequent mount (e.g. pause → /paused → resume)
      // doesn't replay the animation. All tiles in this batch already captured
      // the value via the useState initialiser above.
      useGameStore.setState({ shouldAnimateOnMount: false });
    }
    const id = setTimeout(() => setBorn(false), (introDelay + 0.4) * 1000);
    return () => clearTimeout(id);
  // introDelay derives from props that are constant for a tile's lifetime
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = `tile rect layer-${layer} column-${column} row-${row} ${
    active ? "active" : ""
  } ${animating ?? ""} ${born ? "born" : ""}`;

  const tokenColor = colour(token);
  return (
    <div
      id={`tile_${id}`}
      onClick={onClick}
      className={classes}
      style={{
        "--tile-top-factor": topFactor(row, layer, id),
        "--intro-delay": `${introDelay.toFixed(3)}s`,
      } as React.CSSProperties}
    >
      <div
        className="tile-face flex justify-center items-center font-bold border-4
              border-t-gray-300 border-r-gray-600 border-b-gray-700 border-l-gray-400
              hover:cursor-pointer"
        style={{
          color: tokenColor,
          textShadow: "1px 1px 1px black, -1px -1px 1px white",
        }}
      >
        {token}
      </div>
    </div>
  );
};

export default Tile;
