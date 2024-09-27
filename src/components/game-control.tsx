import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  pause,
  resume,
  selectGameOver,
  selectGameRunning,
  selectLevelClear,
  selectTimeLeft,
  start,
} from "@store/controls";
import Button, { ButtonType } from "@components/common/button";

const GameControl = () => {
  const dispatch = useAppDispatch();
  const gameOver = useAppSelector(selectGameOver);
  const timeLeft = useAppSelector(selectTimeLeft);
  const gameRunning = useAppSelector(selectGameRunning);
  const levelCleared = useAppSelector(selectLevelClear);
  const timeLeftFormatted = new Date(timeLeft * 1000)
    .toISOString()
    .substring(14, 19);

  return (
    <>
      {levelCleared
        ? (
          <Button variant={ButtonType.play} handler={() => dispatch(start())}>
            Continue
          </Button>
        )
        : (
          <>
            {gameOver
              ? (
                <Button
                  variant={ButtonType.play}
                  handler={() => dispatch(start())}
                >
                  Play
                </Button>
              )
              : (
                <>
                  {gameRunning
                    ? (
                      <Button
                        variant={ButtonType.pause}
                        handler={() => dispatch(pause())}
                      >
                        {timeLeftFormatted}
                      </Button>
                    )
                    : (
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
