import React, { Component } from 'react'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import Turtle from '@components/Turtle/Turtle'
import styled from 'styled-components'
import ProgressBar from '@components/ProgressBar/ProgressBar'
import { abortGame, pauseGame, resumeGame, selectGamePaused, selectTimeLeft, selectTimer, startGame, tick } from '@store/constraints'

const colors = {
  primary: 'papayawhip',
  secondary: 'tomato',
  dark: '#333333',
  light: '#efefef'
}

type ButtonProps = {
  primary?: boolean;
  secondary?: boolean;
}

const MyBoard = styled.div`
font-size: 1.2em;
background-color: #333;
width: 100%;
`

const Main = styled.div`
background-color: white;
height: 35.5em;
width: 49.5em;
padding: 0;
margin: 0 auto;
padding: 20px 0 0 12px;
`

const Controls = styled.div`
padding: 10px 0;
width: 420px;
margin: 0 auto;
display: flex;
`

const Button = styled.button<ButtonProps>`
text-align: center;
margin: 1px 1px;
font-size: 3ex;
height: 60px;
width: 198px;
border: 0px solid transparent;
color: ${props => (props.primary && colors.dark) || colors.light};
cursor: pointer;
background-color: ${(props) => (props.primary && colors.primary) || (props.secondary && colors.secondary) }
`

const Title = styled.h1`
color: white;
text-align: center;
`
const ScoreValue = styled.h2`
color: white;
text-align: center;
`

const Score = ({ score }) => {
  return (
    <ScoreValue>
      { score } Punkte
    </ScoreValue>
  )
}

const GameBoard = () => {
  const timeLeft = useAppSelector(selectTimeLeft)
  const timer = useAppSelector(selectTimer);
  const paused = useAppSelector(selectGamePaused)
  const score = 0;
  const dispatch = useAppDispatch();

  const pause = () => {
    clearInterval(timer);
    dispatch(pauseGame());
  }

  const resume = () => {
    const interval = setInterval(() => dispatch(tick()), 1000)
    dispatch(resumeGame(interval))
  }

  const restart = () => {
    clearInterval(timer);
    dispatch(abortGame())
    const interval = setInterval(() => dispatch(tick()), 1000)
    dispatch(startGame(interval))
  }

  return (
      <MyBoard>
        <div>
          <Title>Eureka</Title>
          <Score score={ score } />
        </div>
        <Main>
          <Turtle />
        </Main>
        <ProgressBar timeLeft={timeLeft} />
        <Controls>
          { paused
            ? <Button primary onClick={resume}>
                Resume
              </Button>
            : <Button primary onClick={pause}>
                Pause
              </Button>
          }
          <Button secondary onClick={restart}>
            Restart
          </Button>
        </Controls>
      </MyBoard>
    )
  }

export default GameBoard
