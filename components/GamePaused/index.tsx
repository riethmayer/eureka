const GamePaused = ({resume}) => {
  return (
    <div>
      <h1>PAUSE</h1>
      <button onClick={resume}>Resume Game</button>
    </div>
  )
}

export default GamePaused
