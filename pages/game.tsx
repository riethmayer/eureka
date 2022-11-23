import GameOver from "@components/GameOver/GameOver";
import LevelUp from "@components/LevelUp/LevelUp";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  abortGame,
  selectGameOver,
  selectGamePaused,
  selectGameRunning,
  selectTimer,
  selectLevelClear,
} from "@store/constraints";
import { startGame, tick } from "@store/constraints";
import { useEffect } from "react";
import Layout from "@components/Layout";
import GameBoard from "@components/GameBoard";
import { useStytchUser } from "@stytch/nextjs";
import { useRouter } from "next/router";

const Game = () => {
  const gameRunning = useAppSelector(selectGameRunning);
  const gameOver = useAppSelector(selectGameOver);
  const gamePaused = useAppSelector(selectGamePaused);
  const levelCleared = useAppSelector(selectLevelClear);
  const timer = useAppSelector(selectTimer);
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();

  useEffect(() => {
    const start = () => {
      if (timer) {
        clearInterval(timer);
      }
      const interval = setInterval(() => dispatch(tick()), 1000);
      return dispatch(startGame(interval));
    };

    const abort = () => {
      clearInterval(timer);
      dispatch(abortGame());
    };

    if (isInitialized && !user) {
      router.replace("/");
    }

    if (isInitialized && user) {
      start();
    }

    return () => {
      abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized, router]);

  return (
    <>
      <Layout title="Eureka - Good luck!">
        <div className="relative">
          {gameRunning && <GameBoard />}
          {gameOver && <GameOver />}
          {levelCleared && <LevelUp />}
        </div>
      </Layout>
    </>
  );
};

export default Game;
