import { createAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

export const levelCleared = createAction("constraints/LEVEL_CLEARED");

const initialState: number = 1;

export const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {
    resetLevel() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(levelCleared, (state) => {
      return state + 1;
    }),
      builder.addDefaultCase((state) => {
        return state;
      });
  },
});

export const { resetLevel } = levelSlice.actions;
export const selectLevel = (state: AppState) => state.level;
export default levelSlice.reducer;
