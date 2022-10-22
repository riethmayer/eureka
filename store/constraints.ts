import { createAction, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "@store/store";
import { resetScore, selectScore } from "@store/score";
import { increaseLevel, resetLevel, selectLevel } from "@store/level";
import Router from "next/router";
import { resetTiles } from "./tilesLeft";

// declaring the types for our state
export type Timer = NodeJS.Timeout | undefined;

export type ConstraintsState = {
  timer: Timer;
  gameRunning: boolean;
  timeLeft: number;
  gameOver: boolean;
  gamePaused: boolean;
  levelClear: boolean;
};

// initial state
const INITIAL_TIME = 0;
export const TIME_TO_SOLVE = 800;
const initialState: ConstraintsState = {
  timer: undefined,
  gameRunning: false,
  timeLeft: INITIAL_TIME,
  gameOver: true,
  gamePaused: false,
  levelClear: false,
};

// actions (constraints)
export const startGame = createAction<Timer>("constraints/GAME_START");
export const ticked = createAction("constraints/TICKED");
export const pauseGame = createAction("constraints/GAME_PAUSE");
export const resumeGame = createAction<Timer>("constraints/GAME_RESUME");
export const abortGame = createAction("constraints/GAME_ABORT");
export const gameOver = createAction("constraints/GAME_OVER");
export const levelCleared = createAction("constraints/LEVEL_CLEARED")

export const constraintsSlice = createSlice({
  name: "constraints",
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
        state.levelClear = false;
      })
      .addCase(ticked, (state) => {
        if (state.timeLeft > 0) {
          state.timeLeft = state.timeLeft - 1;
        } else {
          state.timeLeft = 0;
        }
      })
      .addCase(pauseGame, (state) => {
        state.gamePaused = true;
        state.gameRunning = false;
        state.timer = undefined;
      })
      .addCase(resumeGame, (state, action: PayloadAction<Timer>) => {
        state.timer = action.payload;
        state.gamePaused = false;
        state.gameRunning = true;
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
      })
      .addCase(levelCleared, (state) => {
        state.levelClear = true;
        state.gameRunning = false;
        state.timeLeft = 0; // TODO: Store remaining time to add in next level;
        state.gamePaused = false;
      })
      .addDefaultCase((state) => state);
  },
});

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectGamePaused = (state: AppState) =>
  state.constraints.gamePaused;
export const selectTimer = (state: AppState) => state.constraints.timer;
export const selectTimeLeft = (state: AppState) => state.constraints.timeLeft;
export const selectGameOver = (state: AppState) => state.constraints.gameOver;
export const selectGameRunning = (state: AppState) =>
  state.constraints.gameRunning;
export const selectLevelClear = (state: AppState) =>
  state.constraints.levelClear;

export const pause = () => async (dispatch, getState) => {
  const timer = selectTimer(getState());
  clearInterval(timer);
  dispatch(pauseGame());
};

export const resume = () => async (dispatch) => {
  const interval = setInterval(() => dispatch(tick()), 1000);
  dispatch(resumeGame(interval));
};

export const restart = () => async (dispatch, getState) => {
  const timer = selectTimer(getState());
  clearInterval(timer);
  dispatch(abortGame());
  const interval = setInterval(() => dispatch(tick()), 1000);
  dispatch(startGame(interval));
};

export const checkGameFinished = () => async (dispatch, getState) => {
  const {
    constraints: { timeLeft, tilesLeft },
  } = getState();
  if (timeLeft <= 0 && tilesLeft > 0) {
    const timer = selectTimer(getState());
    const score = selectScore(getState());
    const level = selectLevel(getState());
    clearInterval(timer);
    dispatch(gameOver());
    dispatch(recordHighscore(score, level));
    dispatch(resetTiles())
    dispatch(resetScore());
    dispatch(resetLevel());
    Router.push("/highscore");
  }
};

export const checkLevelCleared = () => async (dispatch, getState) => {
  const {
    constraints: { timer, tilesLeft },
  } = getState();
  if (tilesLeft === 0 && !selectLevelClear(getState())) {
    clearInterval(timer); //TODO: add time left to new timer;
    dispatch(resetTiles());
    dispatch(increaseLevel());
    dispatch(levelCleared());
  }
}

export const recordHighscore =
  (score: number, level: number) => async (dispatch, getState) => {
    const name = "Jan R."; // TODO: selectName(getState());
    await fetch("/api/highscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score, level }),
    });
  };

export const tick = () => async (dispatch) => {
  dispatch(ticked());
  dispatch(checkGameFinished());
};

// exporting the reducer here, as we need to add this to the store
export default constraintsSlice.reducer;
