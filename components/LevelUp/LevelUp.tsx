import { startNextLevel } from "@store/constraints";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectLevel } from "@store/level";

const LevelUp = () => {
  const dispatch = useAppDispatch();
  const level = useAppSelector(selectLevel);

  return (
    <div>
      <h1>LEVEL {level - 1} CLEAR!</h1>
      <button onClick={() => dispatch(startNextLevel)}>Continue</button>
    </div>
  );
};

export default LevelUp;
