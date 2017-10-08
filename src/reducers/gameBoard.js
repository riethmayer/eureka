import _ from 'lodash'

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

const freeTile = (clickedIndex) => {
  return (dispatch, state) => {
    /* see whether tile is free */
    const { board } = state()
    const { index, active, row } = board[clickedIndex]
    let rowItems = Object.keys(board).filter((i) => {
      return board[i].row === row
    }).map((i) => parseInt(i))
    const isFree = (index === _.last(rowItems)) || (index === _.first(rowItems))
    if(isFree) {
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
    const { index, token, active } = board[clickedIndex]
    dispatch({
      type: actions.invalidTileclicked,
      index
    })
  }
}

const selected = (index) => {
  return (dispatch) => {
    console.log('actionCreator', index)
    dispatch({
      type: actions.selected,
      index
    })
  }
}

const deselected = (index) => {
  return (dispatch) => {
    console.log('deselected', index)
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
    console.log('cleanup', toClean)
    toClean.map((i) => dispatch(deselected(i)))
  }
}

const actions = {
  selected: 'SELECTED',
  deselected: 'DESELECTED',
  solved: 'SOLVED',
  cleanup: 'CLEANUP',
  invalidTileclicked: 'INVALID_CLICK'
}

const initialState = buildTiles()

const gameBoard = (state = initialState, action = {}) => {
  const tile = state[action.index]
  switch(action.type) {
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
      return _.omit(state, action.index, ...action.solved)
    default:
      return state
  }
}

export default gameBoard
