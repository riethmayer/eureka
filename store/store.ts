import { Action, AnyAction, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { constraints } from "./constraints";
import { createWrapper, HYDRATE, Context } from "next-redux-wrapper";
import logger from "redux-logger";
import { gameBoard } from "./gameBoard";
import { ThunkMiddleware } from "redux-thunk";
import { CurriedGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";

// Redux implementation
const combineReducer = combineReducers({
  [constraints.name]: constraints.reducer,
  [gameBoard.name]: gameBoard.reducer
})

const reducer = (state: ReturnType<typeof combineReducer>, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    return nextState
  } else {
    return combineReducer(state, action)
  }
}

const makeStore = () => {
  const s = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== "production",
  })
  return s;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = ReturnType<AppStore["dispatch"]>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: true });