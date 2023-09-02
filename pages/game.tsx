import GameOver from "@components/GameOver/GameOver";
import LevelUp from "@components/LevelUp/LevelUp";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  selectGameOver,
  selectGamePaused,
  selectGameRunning,
  selectLevelClear,
  start,
} from "@store/controls";
import { useEffect } from "react";
import Layout from "@components/Layout";
import GameBoard from "@components/GameBoard";
import { useStytchUser } from "@stytch/nextjs";
import { useRouter } from "next/router";
import GamePaused from "@components/GamePaused";

const Game = () => {
  const gameRunning = useAppSelector(selectGameRunning);
  const gameOver = useAppSelector(selectGameOver);
  const gamePaused = useAppSelector(selectGamePaused);
  const levelCleared = useAppSelector(selectLevelClear);
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isInitialized && !user) {
      router.replace("/");
    }
    dispatch(start());
  }, [user, isInitialized, router, dispatch]);

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
