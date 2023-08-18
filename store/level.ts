import { createSlice } from "@reduxjs/toolkit";
import { levelCleared, startNextLevel } from "./constraints";
import { AppState } from "./store";

const initialState: number = 1;

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
  extraReducers: (builder) => {
    builder.addCase(levelCleared, (state) => {
      return state + 1;
    }),
      builder.addDefaultCase((state) => {
        return state;
      });
  },
});

export const { increaseLevel, resetLevel } = levelSlice.actions;
export const selectLevel = (state: AppState) => state.level;
export default levelSlice.reducer;
