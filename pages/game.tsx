import type { NextPage } from "next";
import GameOver from "@components/GameOver/GameOver";
import GamePaused from "@components/GamePaused";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  abortGame,
  selectGameOver,
  selectGamePaused,
  selectGameRunning,
  selectTimeLeft,
  selectTimer,
} from "@store/constraints";
import { startGame, tick, resumeGame } from "@store/constraints";
import { useEffect } from "react";
import Layout from "@components/Layout";
import GameBoard from "@components/GameBoard";

const Game: NextPage = () => {
  const gameRunning = useAppSelector(selectGameRunning);
  const gameOver = useAppSelector(selectGameOver);
  const gamePaused = useAppSelector(selectGamePaused);
  const timer = useAppSelector(selectTimer);
  const dispatch = useAppDispatch();

  const resume = () => {
    const interval = setInterval(() => dispatch(tick()), 1000);
    dispatch(resumeGame(interval));
  };

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

    start();
    return () => {
      abort();
    };
  }, []);

  return (
    <Layout title="Eureka - Good luck!">
      {gameRunning && <GameBoard />}
      {gameOver && <GameOver />}
      {gamePaused && <GamePaused resume={resume} />}
    </Layout>
  );
};

export default Game;
