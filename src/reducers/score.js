import actions from './actions'

const score = (state = 0, action = {}) => {
  switch(action.type) {
    case(actions.solved):
      return state + 100
    case(actions.start):
      return 0
    default:
      return state
  }
}

export default score
