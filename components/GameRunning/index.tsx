import { useSelector } from 'react-redux'
import GameBoard from './GameBoard/GameBoard'
import { selectGameRunning } from '@store/constraints'

const GameRunning = () => {
  const gameRunning = useSelector(selectGameRunning);
  return (
    <div>
      { gameRunning && <GameBoard /> }
    </div>
  )
}

export default GameRunning
