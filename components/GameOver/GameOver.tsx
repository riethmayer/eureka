import { selectTimer, startGame, tick } from "@store/constraints";
import { useAppDispatch, useAppSelector } from "@store/hooks";

const GameOver = () => {
  const timer = useAppSelector(selectTimer);
  const dispatch = useAppDispatch();

  const restart = () => {
    clearInterval(timer);
    const interval = setInterval(() => dispatch(tick()), 1000);
    dispatch(startGame(interval));
  };

  return (
    <div>
      <h1>GAME OVER</h1>
      <button onClick={restart}>Start New Game</button>
    </div>
  );
};

export default GameOver;
