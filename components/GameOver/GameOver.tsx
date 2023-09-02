import { start } from "@store/controls";
import { useAppDispatch } from "@store/hooks";

const GameOver = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>GAME OVER</h1>
      <button onClick={() => dispatch(start())}>Start New Game</button>
    </div>
  );
};

export default GameOver;
