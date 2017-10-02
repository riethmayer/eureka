import React from 'react'

const GameOver = ({restart}) => {
  return (
    <div>
      <h1>GAME OVER</h1>
      <button onClick={restart}>Start New Game</button>
    </div>
  )
}

export default GameOver
