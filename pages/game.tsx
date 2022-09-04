import type { NextPage } from 'next';
import GameOver from '@components/GameOver/GameOver'
import GamePaused from '@components/GamePaused'
import GameRunning from '@components/GameRunning'

import { useDispatch, useSelector } from 'react-redux';
import { abortGame, selectGameOver, selectGamePaused, selectGameRunning, selectTimeLeft, selectTimer } from '@store/constraints';
import { startGame, pauseGame, tick, resumeGame } from '@store/constraints';
import { wrapper } from '@store/store';
import { useEffect } from 'react';


const Game: NextPage = () => {
  const gameRunning = useSelector(selectGameRunning)
  const gameOver = useSelector(selectGameOver)
  const gamePaused = useSelector(selectGamePaused)
  const timeLeft = useSelector(selectTimeLeft)
  const timer = useSelector(selectTimer);
  const dispatch = useDispatch();

  const restart = () => {
    if(timer) {
      clearInterval(timer);
    }
    const interval = setInterval(() => dispatch(tick()), 1000)
    return dispatch(startGame(interval));
  }
  const pause = () => {
    clearInterval(timer);
    dispatch(pauseGame());
  }
  const resume = () => {
    const interval = setInterval(() => dispatch(tick()), 1000);
    () => dispatch(resumeGame(interval))
  }

  useEffect(() => {
    clearInterval(timer);
    dispatch(startGame(timer))
    return () => {
      clearInterval(timer);
      dispatch(abortGame)
    }
  }, [])

  return (
    <div>
      { gameRunning
        ? <GameRunning pause={pause} timeLeft={timeLeft} />
        : null }
      { gameOver && <GameOver restart={restart}/> }
      { gamePaused && <GamePaused resume={resume} /> }
    </div>
  )
}

export default wrapper.withRedux(Game);
