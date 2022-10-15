import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

const initialState = 1;

export const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {
    increaseLevel(state) {
      return state + 1;
    },
    resetLevel() {
      return initialState;
    },
  },
});

export const { increaseLevel, resetLevel } = levelSlice.actions;
export const selectLevel = (state: AppState) => state.level;
export default levelSlice.reducer;
