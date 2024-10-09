"use client";
import { useGameStore } from "@/zustand/game-store";
import Tile from "../tile";

const Turtle = () => {
  const board = useGameStore((state) => state.gameBoard);
  const clicked = useGameStore((state) => state.clicked);

  return (
    <div className="turtle mt-4">
      <div>
        {Object.keys(board).map((idx) => {
          const { active, column, layer, row, token } = board[idx];
          return (
            <Tile
              token={token}
              row={row}
              column={column}
              layer={layer}
              active={active}
              className={`${token}`}
              id={idx}
              onClick={() => clicked(idx)}
              key={idx}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Turtle;
