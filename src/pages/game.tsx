import GameOver from "@components/game-over";
import LevelUp from "@components/level-up";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  selectGameOver,
  selectGamePaused,
  selectGameRunning,
  selectLevelClear,
  start,
} from "@store/controls";
import { useEffect } from "react";
import Layout from "@components/layout";
import GameBoard from "@components/game-board";
import { useRouter } from "next/router";
import GamePaused from "@components/game-paused";

const Game = () => {
  const gameRunning = useAppSelector(selectGameRunning);
  const gameOver = useAppSelector(selectGameOver);
  const gamePaused = useAppSelector(selectGamePaused);
  const levelCleared = useAppSelector(selectLevelClear);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(start());
  }, [router, dispatch]);

  return (
    <>
      <Layout title="Eureka - Good luck!">
        <div className="relative">
          {gameRunning && <GameBoard />}
          {gameOver && <GameOver />}
          {levelCleared && <LevelUp />}
          {gamePaused && <GamePaused />}
        </div>
      </Layout>
    </>
  );
};

export default Game;
