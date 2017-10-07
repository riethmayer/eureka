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
    console.log('length', solved.length, solved)
    if(solved.length > 0) {
      dispatch({
        type: actions.solved,
        index: currentIndex,
        solved: solved
      })
    }
  }
}


const actions = {
  selected: 'SELECTED',
  deselected: 'DESELECTED',
  solved: 'SOLVED'
}

const initialState = shuffle(allTokens)
  .map((token, index) => { return [token, index] }) //
  .reduce((obj, [token, index]) => {
    obj[index]= {
      index: index,
      token: token,
      active: false
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
