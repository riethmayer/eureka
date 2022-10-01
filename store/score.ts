import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

const initialState = 0;

export const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    scoredPair(state) {
      return state + 2;
    },
    resetScore() {
      return initialState;
    },
  },
});

export const { scoredPair, resetScore } = scoreSlice.actions;
export const selectScore = (state: AppState) => state.score;
export default scoreSlice.reducer;
