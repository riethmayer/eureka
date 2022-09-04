import { cleanup, clickInvalidTile, freeTile, select, solve, unselect } from "@store/gameBoard"
import checkFree from "@utils/checkFree"

export const clicked = (clickedIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { index, active } = board[clickedIndex]
    if(active) {
      dispatch(unselect(index))
    } else {
      dispatch(freeTile(index))
    }
  }
}

const solveX = (currentIndex) => {
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
        type: solve,
        index: currentIndex,
        solved: solved
      })
    }
  }
}

const doCleanup = (currentIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { token } = board
    const toClean = Object.keys(board).filter((id) => {
      let tile = board[id]
      return tile && (tile['token'] !== token) && tile['active'] && tile['index'] !== currentIndex
    }).map(parseInt)
    console.log("toClean",toClean)
    toClean.map((i) => dispatch(unselect(i)))
  }
}

const freeTileX = (clickedIndex) => {
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
      type: clickInvalidTile,
      index
    })
  }
}

const selected = (index) => {
  return (dispatch) => {
    dispatch({
      type: select,
      index
    })
  }
}
