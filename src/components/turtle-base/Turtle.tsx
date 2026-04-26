"use client";
import { useGameStore } from "@/zustand/game-store";
import Tile from "../tile";

const Turtle = () => {
  const board = useGameStore((state) => state.gameBoard);
  const clicked = useGameStore((state) => state.clicked);
  const boardGeneration = useGameStore((state) => state.boardGeneration);

  return (
    <div className="turtle mt-4">
      <div>
        {Object.keys(board).map((idx) => {
          const { active, column, layer, row, token, grace } = board[idx];
          return (
            <Tile
              token={token}
              row={row}
              column={column}
              layer={layer}
              active={active}
              animating={board[idx].animating}
              grace={grace}
              className={`${token}`}
              id={idx}
              onClick={() => clicked(idx)}
              key={`${boardGeneration}-${idx}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Turtle;
