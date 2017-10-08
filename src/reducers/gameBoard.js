import _ from 'lodash'

const numbers_0_to_9 = [...Array(10)].map((_, i) => String(i))
const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i+65))
const tokens = numbers_0_to_9.concat(alphabet)
const allTokens = tokens.concat(tokens).concat(tokens).concat(tokens)
const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const clicked = (clickedIndex) => {
  return (dispatch, state) => {
    const { board } = state()
    const { index, token, active } = board[clickedIndex]
    console.log(token, index, active)
    if(active) {
      dispatch(deselected(index))
    } else {
      dispatch(selected(index))
      dispatch(solve(index))
      dispatch(cleanup(index))
    }
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
  cleanup: 'CLEANUP'
}

const setupLayer = (index) => {
  switch(true) {
    case (index >= 87 && index <= 122):
      return 1
    case (index >= 123 && index <= 138):
      return 2
    case (index >= 139 && index <= 142):
      return 3
    case (index === 143):
      return 4
    default:
      return 0
  }
}

const setupRow = (index) => {
  switch(true) {
    case (index <= 11):
      return 1
    case (index >= 12 && index <= 19):
      return 2
    case (index >= 20 && index <= 29):
      return 3
    case (index >= 30 && index <= 41):
      return 4
    case (index === 42):
      return 5 // single left stone
    case (index >= 43 && index <= 54):
      return 6
    case (index >= 55 && index <= 56):
      return 7 // right two stones
    case (index >= 57 && index <= 66):
      return 8
    case (index >= 67 && index <= 74):
      return 9
    case (index >= 75 && index <= 86):
      return 10
    case (index >= 87 && index <= 92):
      return 11
    case (index >= 93 && index <= 98):
      return 12
    case (index >= 99 && index <= 104):
      return 13
    case (index >= 105 && index <= 110):
      return 14
    case (index >= 111 && index <= 116):
      return 15
    case (index >= 117 && index <= 122):
      return 16
    case (index >= 123 && index <= 126):
      return 17
    case (index >= 127 && index <= 130):
      return 18
    case (index >= 131 && index <= 134):
      return 19
    case (index >= 135 && index <= 138):
      return 20
    case (index >= 139 && index <= 140):
      return 21
    case (index >= 141 && index <= 142):
      return 22
    case (index === 143):
      return 23
    default:
      return 0
  }
}

const initialState = shuffle(allTokens)
  .map((token, index) => { return [token, index] }) //
  .reduce((obj, [token, index]) => {
    obj[index]= {
      index: index,
      token: token,
      active: false,
      layer: setupLayer(index),
      row: setupRow(index)
    }
    return(obj)
  }, {})


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
