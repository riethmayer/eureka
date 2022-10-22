import { selectTimer, startGame, tick, selectLevelClear } from "@store/constraints";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectLevel } from "@store/level";

const LevelUp = () => {
  const timer = useAppSelector(selectTimer);
  const dispatch = useAppDispatch();
  const levelCleared = useAppSelector(selectLevelClear);
  const level = useAppSelector(selectLevel);

  const nextLevel = () => {
    if (levelCleared) {
        clearInterval(timer);
        const interval = setInterval(() => dispatch(tick()), 1000);
      return dispatch(startGame(interval));
    }
  };

  return (
    <div>
      <h1>LEVEL {level - 1} CLEAR!</h1>
      <button onClick={nextLevel}>Continue</button>
    </div>
  );
};

export default LevelUp;