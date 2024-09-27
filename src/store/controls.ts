"use client";
import { createAction, createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppState, AppThunk } from "@store/store";
import { resetScore, selectScore } from "@store/score";
import { levelCleared, resetLevel, selectLevel } from "@store/level";
import { resetTiles } from "./tiles-left";

export type Timer = NodeJS.Timeout | undefined;
// declaring the types for our state
export type controlsState = {
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
const initialState: controlsState = {
  timer: undefined,
  gameRunning: false,
  timeLeft: INITIAL_TIME,
  gameOver: false,
  gamePaused: false,
  levelClear: false,
};

// actions (controls)
export const startGame = createAction("controls/GAME_START");
export const ticked = createAction("controls/TICKED");
export const pauseGame = createAction("controls/GAME_PAUSE");
export const resumeGame = createAction("controls/GAME_RESUME");
export const abortGame = createAction("controls/GAME_ABORT");
export const gameOver = createAction("controls/GAME_OVER");

export const startTimer = createAction<Timer>("controls/START_TIMER");
export const stopTimer = createAction("controls/STOP_TIMER");

export const controlsSlice = createSlice({
  name: "controls",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions.
  // Redux Toolkit allows us to write "mutating" logic in reducers.
  // It doesn't actually mutate the state because it uses the Immer library, which detects changes to a "draft state" and produces a brand new immutable state based off those changes
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startGame, (state) => {
        console.log("startGame", state);
        state.gameRunning = true;
        state.timeLeft = state.timeLeft + TIME_TO_SOLVE;
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
      })
      .addCase(resumeGame, (state) => {
        state.gamePaused = false;
        state.gameRunning = true;
      })
      .addCase(abortGame, () => {
        return initialState;
      })
      .addCase(gameOver, (state) => {
        state.gameOver = true;
        state.gameRunning = false;
        state.timeLeft = 0;
      })
      .addCase(levelCleared, (state) => {
        state.levelClear = true;
        state.gameRunning = false;
      })
      .addCase(startTimer, (state, action: PayloadAction<Timer>) => {
        state.timer = action.payload;
      })
      .addCase(stopTimer, (state) => {
        state.timer = undefined;
      })
      .addDefaultCase((state) => state);
  },
});

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectGamePaused = (state: AppState) => state.controls.gamePaused;
export const selectTimeLeft = (state: AppState) => state.controls.timeLeft;
export const selectGameOver = (state: AppState) => state.controls.gameOver;
export const selectGameRunning = (state: AppState) =>
  state.controls.gameRunning;
export const selectLevelClear = (state: AppState) => state.controls.levelClear;
export const selectTimer = (state: AppState) => state.controls.timer;

export const start = (): AppThunk => async (dispatch, getState) => {
  const timer = selectTimer(getState());
  const levelCleared = selectLevelClear(getState());
  if (timer) {
    clearInterval(timer);
  }
  dispatch(resetTiles());
  if (!levelCleared) {
    dispatch(abortGame());
    dispatch(resetScore());
  }
  dispatch(startGame());
  dispatch(startTimer(setInterval(() => dispatch(tick()), 1000)));
};

export const pause = (): AppThunk => async (dispatch, getState) => {
  const timer = selectTimer(getState());
  dispatch(pauseGame());

  if (timer) {
    clearInterval(timer);
  }
  dispatch(stopTimer());
};

export const resume = (): AppThunk => async (dispatch, getState) => {
  dispatch(resumeGame());
  dispatch(startTimer(setInterval(() => dispatch(tick()), 1000)));
};

export const restart = (): AppThunk => async (dispatch, getState) => {
  const timer = selectTimer(getState());
  if (timer) {
    dispatch(stopTimer());
    clearInterval(timer);
  }
  dispatch(abortGame());
  dispatch(startGame());
  dispatch(startTimer(setInterval(() => dispatch(tick()), 1000)));
};

export const checkRunOutOfTime = (): AppThunk => async (dispatch, getState) => {
  const {
    controls: { timeLeft, timer },
  } = getState();
  if (timeLeft <= 0) {
    console.log("timeLeft", timeLeft);
    const score = selectScore(getState());
    const level = selectLevel(getState());
    if (timer) {
      dispatch(stopTimer());
      clearInterval(timer);
    }
    dispatch(gameOver());
    dispatch(recordHighscore(score, level));
    dispatch(resetTiles());
    dispatch(resetScore());
    dispatch(resetLevel());
    Router.push("/highscore");
  }
};

export const checkLevelCleared = (): AppThunk => async (dispatch, getState) => {
  const { tilesLeft } = getState();
  if (tilesLeft <= 0) {
    const timer = selectTimer(getState());
    if (timer) {
      dispatch(stopTimer());
      clearInterval(timer);
    }
    dispatch(resetTiles());
    dispatch(levelCleared());
  }
};

export const recordHighscore =
  (score: number, level: number): AppThunk => async (dispatch, getState) => {
    const name = "Jan R."; // TODO: selectName(getState());
    await fetch("/api/highscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score, level }),
    });
  };

/**
 * Careful, tick is not ticked.
 * @returns undefined
 */
export const tick = (): AppThunk => async (dispatch) => {
  dispatch(ticked());
  dispatch(checkRunOutOfTime());
  dispatch(checkLevelCleared());
};

export const startNextLevel = (): AppThunk => async (dispatch, getState) => {
  dispatch(startGame());
  dispatch(startTimer(setInterval(() => dispatch(tick()), 1000)));
};

// exporting the reducer here, as we need to add this to the store
export default controlsSlice.reducer;
