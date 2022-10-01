import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  pause,
  resume,
  selectGameOver,
  selectGameRunning,
  selectTimeLeft,
  startGame,
} from "@store/constraints";
import Button, { ButtonType } from "@components/common/Button";

const GameControl = () => {
  const dispatch = useAppDispatch();
  const gameOver = useAppSelector(selectGameOver);
  const timeLeft = useAppSelector(selectTimeLeft);
  const gameRunning = useAppSelector(selectGameRunning);
  const timeLeftFormatted = new Date(timeLeft * 1000)
    .toISOString()
    .substr(14, 5);

  return (
    <div className="absolute top-0 right-10">
      {gameOver ? (
        <Button variant={ButtonType.play} handler={() => dispatch(startGame())}>
          Play
        </Button>
      ) : (
        <>
          {gameRunning ? (
            <Button
              variant={ButtonType.pause}
              handler={() => dispatch(pause())}
            >
              {timeLeftFormatted}
            </Button>
          ) : (
            <Button
              variant={ButtonType.resume}
              handler={() => dispatch(resume())}
            >
              Resume
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default GameControl;
