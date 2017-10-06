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
  return (() => {
    console.log('clicked', name, index)
  })
}


const initialState = shuffle(allTokens)
  .map((token, index) => { return [token, index] }) //
  .reduce((obj, [token, index]) => { obj[index]= token; return(obj) }, {})

const gameBoard = (state = initialState, action = {}) => {
  switch(action.type) {
    case action.new:
      return initialState
    default:
      return state
  }
}

export default gameBoard
