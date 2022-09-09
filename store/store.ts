// @refresh reset
// why when I change the store.ts file, /game becomes blank?
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import constraintsReducer, { ConstraintsState } from "./constraints";
import gameBoardReducer, { TokenTileMap } from "./gameBoard";
import scoreReducer from "./score";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    constraints: constraintsReducer,
    gameBoard: gameBoardReducer,
    score: scoreReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
})

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;



export default store;