const initialState = {
  timer: undefined,
  gameRunning: false,
  timeLeft: 0,
  gameOver: false,
  gamePaused: false,
}

const initialTimeLeft = 180

const actions = {
  start: 'GAME_START',
  pause: 'GAME_PAUSE',
  tick: 'TICK',
  resume: 'GAME_RESUME',
  abort: 'GAME_ABORT',
  gameOver: 'GAME_OVER'
}

export const start = () => {
  return (dispatch) => {
    const timer = setInterval(() => dispatch(tick()), 1000)
    dispatch({
      type: actions.start,
      timer: timer,
      timeLeft: initialTimeLeft,
      gameRunning: true
    })
  }
}

export const pause = () => {
  return (dispatch, state) => {
    const { timer } = state().time
    clearInterval(timer)
    dispatch({ type: actions.pause })
  }
}

export const resume = () => {
  return (dispatch) => {
    dispatch({
      type: actions.resume,
      timer: setInterval(() => dispatch(tick()), 1000)
    })
  }
}

export const abort = () => {
  return (dispatch) => {
    dispatch({type: actions.abort})
  }
}
export const gameOver = () => {
  return (dispatch, state) => {
    const { timer } = state().time
    clearInterval(timer)
    dispatch({ type: actions.gameOver })
  }
}

export const checkGameFinished = () => {
  return (dispatch, state) => {
    const { timeLeft } = state().time
    if(timeLeft <= 0) {
      dispatch(gameOver())
    }
  }
}

export const tick = () => {
  return (dispatch) => {
    dispatch({ type: actions.tick })
    dispatch(checkGameFinished())
  }
}

const timer = (state = initialState, action = {}) => {
  switch(action.type) {
    case actions.start:
      return {...state,
              timer: action.timer,
              timeLeft: action.timeLeft,
              gameOver: false,
              gameRunning: true }
    case actions.tick:
      return {...state, timeLeft: state.timeLeft - 1 }
    case actions.pause:
      return {...state,
              timer: undefined,
              gamePaused: true,
              gameRunning: false}
    case actions.resume:
      return {...state,
              timer: action.timer,
              gamePaused: false,
              gameRunning: true }
    case actions.abort:
      return initialState;
    case actions.gameOver:
      return {...state,
              timer: undefined,
              timeLeft: 0,
              gameOver: true,
              gameRunning: false }
    default:
      return state
  }
}

export default timer
