import {
  createAction,
  createSlice,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@store/store';

// declaring the types for our state
export type Timer = NodeJS.Timeout | undefined

export type ConstraintsState = {
    timer: Timer;
    gameRunning: boolean;
    timeLeft: number;
    gameOver: boolean;
    gamePaused: boolean;
}

// initial state
const INITIAL_TIME = 0
const TIME_TO_SOLVE = 400
const initialState : ConstraintsState = {
  timer: undefined,
  gameRunning: false,
  timeLeft: INITIAL_TIME,
  gameOver: false,
  gamePaused: false,
}

// actions (constraints)
export const startGame = createAction<Timer>('constraints/GAME_START');
export const tick = createAction('constraints/TICK');
export const pauseGame = createAction('constraints/GAME_PAUSE');
export const resumeGame = createAction<Timer>('constraints/GAME_RESUME');
export const abortGame = createAction('constraints/GAME_ABORT');
export const gameOver = createAction('constraints/GAME_OVER');

export const constraints = createSlice({
  name: 'constraints',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions.
  // Redux Toolkit allows us to write "mutating" logic in reducers.
  // It doesn't actually mutate the state because it uses the Immer library, which detects changes to a "draft state" and produces a brand new immutable state based off those changes
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startGame, (state, action: PayloadAction<Timer>) => {
        state.timer = action.payload;
        state.gameRunning = true;
        state.timeLeft = TIME_TO_SOLVE;
        state.gameOver = false;
        state.gamePaused = false;
        return state;
      })
      .addCase(tick, (state) => {
        if(state.timeLeft > 0) {
          state.timeLeft = state.timeLeft - 1;
        } else {
          // game over, time's up.
        }
        return state;
      })
      .addCase(pauseGame, (state) => {
        state.gamePaused = true;
        state.timer = undefined;
        return state;
      })
      .addCase(resumeGame, (state, action: PayloadAction<Timer>) => {
        state.timer = action.payload;
        state.gamePaused = false;
        return state;
      })
      .addCase(abortGame, () => {
        return initialState;
      })
      .addCase(gameOver, (state) => {
        state.gameOver = true;
        state.gameRunning = false;
        state.timeLeft = 0;
        state.gamePaused = false;
        state.timer = undefined; // clearInterval(state.timer);
        return state;
      })
      .addDefaultCase((state) => state);
  },
});

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectGamePaused = (state: AppState) => state.constraints.gamePaused;
export const selectTimer = (state: AppState) => state.constraints.timer;
export const selectTimeLeft = (state: AppState) => state.constraints.timeLeft;
export const selectGameOver = (state: AppState) => state.constraints.gameOver;
export const selectGameRunning = (state: AppState) => state.constraints.gameRunning;

// exporting the reducer here, as we need to add this to the store
export default constraints.reducer;