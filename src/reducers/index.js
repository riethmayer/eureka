import { combineReducers } from 'redux'
import timer from './timer'
import gameBoard from './gameBoard'

export default combineReducers({
  time: timer,
  board: gameBoard
})
