import Button, { ButtonType } from "@components/common/Button";
import { resume } from "@store/controls";
import { useAppDispatch } from "@store/hooks";

const GamePaused = () => {
  const dispatch = useAppDispatch();

  return (
    <div className=" flex flex-col align-middle items-center">
      <h1 className="my-12 text-white text-5xl">PAUSE</h1>
      <Button variant={ButtonType.resume} onClick={() => dispatch(resume())}>
        Resume
      </Button>
    </div>
  );
};

export default GamePaused;
