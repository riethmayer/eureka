"use client";
import colour from "./colours";
import { TokenTile } from "@/types/game-board";

export type TileProps = {
  onClick: () => void;
  className: string;
  id: string;
} & TokenTile;

const top = (row: number, layer: number, id: string): string => {
  // crooked tiles are 0.5 row-heights higher than their nominal row
  const crookedFactor = [42, 55, 56, 143].map(String).includes(id) ? 0.5 : 0;
  // 1.02 adds a small gap between rows (matches original 5.1rem / 5rem ratio)
  const factor = ((layer + row - crookedFactor) * 1.02).toFixed(4);
  return `calc(${factor} * var(--tile-h))`;
};

const Tile: React.FC<TileProps> = ({
  onClick,
  token,
  id,
  layer,
  column,
  row,
  active,
}) => {
  const classes = `tile rect layer-${layer} column-${column} row-${row} ${
    active ? "active" : ""
  }`;

  const tokenColor = colour(token);
  return (
    <div
      id={`tile_${id}`}
      onClick={onClick}
      className={classes}
      style={{
        top: `${top(row, layer, id)}rem`,
      }}
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
