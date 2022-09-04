import { combineReducers } from 'redux'
import timer from './timer'
import gameBoard from './gameBoard'
import score from './score'

export default combineReducers({
  time: timer,
  board: gameBoard,
  score: score
})
