import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  pause,
  resume,
  selectGameOver,
  selectGameRunning,
  selectTimeLeft,
  start,
  selectLevelClear,
} from "@store/controls";
import Button, { ButtonType } from "@components/common/Button";

const GameControl = () => {
  const dispatch = useAppDispatch();
  const gameOver = useAppSelector(selectGameOver);
  const timeLeft = useAppSelector(selectTimeLeft);
  const gameRunning = useAppSelector(selectGameRunning);
  const levelCleared = useAppSelector(selectLevelClear);
  const timeLeftFormatted = new Date(timeLeft * 1000)
    .toISOString()
    .substr(14, 5); // FIXME: replace

  return (
    <>
      {levelCleared ? (
        <Button variant={ButtonType.play} handler={() => dispatch(start())}>
          Continue
        </Button>
      ) : (
        <>
          {gameOver ? (
            <Button variant={ButtonType.play} handler={() => dispatch(start())}>
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
        </>
      )}
    </>
  );
};

export default GameControl;
