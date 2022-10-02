import colour from "./Colours";
import { TokenTile } from "@store/gameBoard";

interface Props {
  tokenColor: string;
}

export type TileProps = {
  onClick: () => void;
  className: string;
  id: number;
} & Omit<TokenTile, "index">;

const top = (row, layer, id) => {
  const tileHeight = 5.1;
  // crooked tiles are 0.5 higher than the rest
  const crookedFactor = [42, 55, 56, 143].includes(id) ? 0.5 : 0;
  return tileHeight * (layer + row - crookedFactor);
};

const StyledTile: React.FC<TileProps> = ({
  onClick,
  token,
  id,
  layer,
  column,
  row,
  active,
}) => {
  const classes = [
    "tile",
    "rect",
    `layer-${layer}`,
    `column-${column}`,
    `row-${row}`,
    `${active ? "active" : ""}`,
  ]
    .filter(Boolean)
    .join(" ");

  const tokenColor = colour(token);
  return (
    <div
      id={`tile_${id}`}
      onClick={onClick}
      className={classes}
      style={{
        top: `${top(row, layer, id)}rem`,
        // display: layer < 5 ? "block" : "none",
      }}
    >
      <div
        className="w-16 h-20 text-6xl font-bold border-2 
          border-t-gray-200 border-r-gray-800 border-b-gray-800 border-l-gray-200 
          bg-gray-300 drop-shadow-md shadow-black flex justify-center items-center"
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

export default StyledTile;
