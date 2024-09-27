import Turtle from "@components/turtle-base/Turtle";

/**
 * 8 tiles high.
 * 15 tiles wide.
 * Absolute positioning doesn't allow for a grid nor flexbox.
 * w-16 is 4rem.
 * h-20 is 5rem.
 * Responsiveness of tile size would be:
 * width: "calc(100vw / 15)"
 * height: "calc(100vw / 8)"
 * The position of the tile would need be calculated based on device dimensions.
 */
const GameBoard = () => {
  return (
    <div
      className="text-xl m-auto relative"
      style={{ height: "calc(8.1*5rem)", width: "calc(15.25*4rem)" }}
    >
      <Turtle />
    </div>
  );
};

export default GameBoard;
