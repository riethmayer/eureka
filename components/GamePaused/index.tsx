import { resumeGame } from "@store/controls";
import { useAppDispatch } from "@store/hooks";

const GamePaused = () => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>PAUSE</h1>
      <button onClick={() => dispatch(resumeGame)}>Resume Game</button>
    </div>
  );
};

export default GamePaused;
