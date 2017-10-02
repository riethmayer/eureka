import React from 'react'
import TimeLeft from '../TimeLeft/TimeLeft'

const GameRunning = ({timeLeft, pause}) => {
  return(
    <TimeLeft timeLeft={timeLeft} pause={pause} />
  )
}

export default GameRunning
