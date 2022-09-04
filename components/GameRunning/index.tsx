import { connect, useSelector } from 'react-redux'
import GameBoard from './GameBoard/GameBoard'
import { pause, start } from '@reducers/timer'
import { wrapper } from '@store/store'
import { selectGameRunning, selectTimeLeft } from '@store/constraints'

const GameRunning = () => {
  const gameRunning = useSelector(selectGameRunning);
  const timeLeft = useSelector(selectTimeLeft);
  return (
    <div>
      { gameRunning && <GameBoard timeLeft={timeLeft}
                                  pause={pause}
                                  start={start} /> }
    </div>
  )
}


const mapStateToProps = ({time}) => {
  return({
    timeLeft: time.timeLeft,
    gameRunning: time.gameRunning,
    gameBoard: time.gameBoard
  })
}

export default wrapper.withRedux(GameRunning)
