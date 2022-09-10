const TimeLeft = ({ timeLeft, pause }) => {
  return (
    <>
      <p>Time left {timeLeft}</p>
      <button onClick={pause}>Pause</button>
    </>
  );
};

export default TimeLeft;
