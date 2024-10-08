"use client";
import colour from "./colours";
import { TokenTile } from "@/types/game-board";

export type TileProps = {
  onClick: () => void;
  className: string;
  id: string;
} & TokenTile;

const top = (row: number, layer: number, id: string) => {
  const tileHeight = 5.1;
  // crooked tiles are 0.5 higher than the rest
  const crookedFactor = [42, 55, 56, 143].map(String).includes(id) ? 0.5 : 0;
  return tileHeight * (layer + row - crookedFactor);
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
        className="w-16 h-20 text-6xl font-bold border-4 
              border-t-gray-300 border-r-gray-600 border-b-gray-700 border-l-gray-400 
              flex justify-center items-center hover:cursor-pointer"
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
