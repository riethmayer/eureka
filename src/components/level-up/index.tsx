import Button, { ButtonType } from "@components/common/button";
import { start } from "@store/controls";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectLevel } from "@store/level";

const LevelUp = () => {
  const dispatch = useAppDispatch();
  const level = useAppSelector(selectLevel);

  return (
    <div className= " flex flex-col align-middle items-center" >
    <h1 className="my-12 text-white text-5xl" > LEVEL { level - 1 } CLEAR! </h1>
      < Button variant = { ButtonType.resume } onClick = {() => dispatch(start())}>
        Continue
        </Button>
        </div>
  );
};

export default LevelUp;
