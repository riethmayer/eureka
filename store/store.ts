// @refresh reset
// why when I change the store.ts file, /game becomes blank?
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import controlsReducer from "./controls";
import gameBoardReducer from "./gameBoard";
import scoreReducer from "./score";
import levelReducer from "./level";
import tilesReducer from "@store/tilesLeft";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    controls: controlsReducer,
    gameBoard: gameBoardReducer,
    score: scoreReducer,
    level: levelReducer,
    tilesLeft: tilesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export default store;
