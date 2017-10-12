import _ from 'lodash'
import actions from './actions'
import buildTiles from './buildTiles'

export const clicked = (clickedIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { index, active } = board[clickedIndex]
    if(active) {
      dispatch(deselected(index))
    } else {
      dispatch(freeTile(index))
    }
  }
}

const rowItems = (row, board) => {
  return Object.keys(board).filter((i) => {
    return board[i].row === row
  }).map((i) => parseInt(i, 10))
}

const checkFree = (index, row, board) => {
  const items = rowItems(row, board)
  switch(true) {
    case (row === 3 && index === 30):
      return rowItems(4, board).length === 0
    case (row === 3 && index === 41):
      return rowItems(6, board).length === 0
    case (row === 5 && index === 43):
      return rowItems(4, board).length === 0
    case (row === 5 && index === 54):
      return rowItems(6, board).length === 0
    case (row === 6 && index === 56):
      return true
    case (row === 6 && index === 55):
      return rowItems(6,board).length === 1 // is last element in its row
    case (row === 20 || row === 21):
      /* 4 tiles below the top tile only clickable after top tile is gone */ 
      return rowItems(22, board).length === 0
    default:
      return (index === _.last(items)) || (index === _.first(items))
  }
}

const freeTile = (clickedIndex) => {
  return (dispatch, state) => {
    /* see whether tile is free */
    const { board } = state()
    const { index, row } = board[clickedIndex]
    if(checkFree(index, row, board)) {
      dispatch(selected(index))
      dispatch(solve(index))
      dispatch(cleanup(index))
    } else {
      dispatch(invalidTileClicked(index))
    }
  }
}

const invalidTileClicked = (clickedIndex) => {
  return (dispatch,state) => {
    const { board } = state()
    const { index } = board[clickedIndex]
    dispatch({
      type: actions.invalidTileclicked,
      index
    })
  }
}

const selected = (index) => {
  return (dispatch) => {
    dispatch({
      type: actions.selected,
      index
    })
  }
}

const deselected = (index) => {
  return (dispatch) => {
    dispatch({
      type: actions.deselected,
      index
    })
  }
}

const solve = (currentIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { token } = board[currentIndex]
    const solved = Object.keys(board).filter((id) => {
      let tile = board[id]
      return tile &&
             (tile['token'] === token) &&
             tile['active'] &&
             (tile['index'] !== currentIndex)
    })
    if(solved.length > 0) {
      dispatch({
        type: actions.solved,
        index: currentIndex,
        solved: solved
      })
    }
  }
}

const cleanup = (currentIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { token } = board
    const toClean = Object.keys(board).filter((id) => {
      let tile = board[id]
      return tile && (tile['token'] !== token) && tile['active'] && tile['index'] !== currentIndex
    }).map(parseInt)
    toClean.map((i) => dispatch(deselected(i)))
  }
}

const initialState = buildTiles()

const gameBoard = (state = initialState, action = {}) => {
  const tile = state[action.index]
  switch(action.type) {
    case actions.start:
      return buildTiles()
    case actions.selected:
      return {
        ...state,
        [action.index]: {
          ...tile,
          active: true
        }
      }
    case actions.deselected:
      return {
        ...state,
        [action.index]: {
          ...tile,
          active: false
        }
      }
    case actions.solved:
      console.log('solving', action.index, ...action.solved)
      return _.omit(state, action.index, ...action.solved)
    default:
      return state
  }
}

export default gameBoard
