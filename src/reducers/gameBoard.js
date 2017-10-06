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

export const clicked = (name,index) => {
  return ((dispatch, state) => {
    // 0. nothing is selected:
    // 1. click tile with caption 'A' and id=5
    dispatch(selected({index, name}))
    // 1.1 tile with id 5 becomes active
    // 1.2 tiles with caption 'A' become solvable  // maybe?
    // 1.3.1 click elem with id=5 again
    // 1.3.1.1 tile with id 5 becomes inactive
    // 1.3.1.2 tiles with caption 'A' lose solvable
    // 1.4.1 click elem with caption 'B' and id=2
    // 1.4.1.1 tile with id=2 and caption 'B' becomes active
    // 1.4.1.2 tiles with caption 'B' become solvable...
    // 1.4.1.3 tile with caption 'B' and id=38 clicked
    // 1.4.1.3.1 remove tile 38 and 2 from the board
    // 1.4.1.3.2 tiles lose solvable
  })
}

const selected = ({index, name}) => {
  return (dispatch) => {
    console.log('actionCreator', index, name)
    dispatch({
      type: actions.selected,
      index,
      name
    })
  }
}

const actions = {
  new: 'NEW',
  selected: 'SELECTED'
}

const initialState = shuffle(allTokens)
  .map((token, index) => { return [token, index] }) //
  .reduce((obj, [token, index]) => { obj[index]= token; return(obj) }, {})

const gameBoard = (state = initialState, action = {}) => {
  switch(action.type) {
    case actions.new:
      return initialState
    case actions.selected:
      console.log('reducer', action.index, action.name)
      return { ...state, index: action.index, name: action.name }
    default:
      return state
  }
}

export default gameBoard
