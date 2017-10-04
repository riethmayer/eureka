import React from 'react'
import TimeLeft from '../TimeLeft/TimeLeft'

const GameRunning = ({timeLeft, pause}) => {
  return(
    <div>
      <TimeLeft timeLeft={timeLeft} pause={pause} />
    </div>
  )
}

export default GameRunning
