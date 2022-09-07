const TimeLeft = ({timeLeft, pause}) => {
  return (
    <div>
      <p>
        Time left {timeLeft}
      </p>
      <button onClick={pause}>Pause</button>
    </div>
  )
}

export default TimeLeft
