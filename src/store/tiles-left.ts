import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";

const initialState: number = 144;

export const tileSlice = createSlice({
  name: "tiles",
  initialState,
  reducers: {
    subtractTiles(state) {
      return state - 2;
    },
    resetTiles() {
      return initialState;
    },
  },
});

export const { subtractTiles, resetTiles } = tileSlice.actions;
export const tilesLeft = (state: AppState) => state.tilesLeft;
export default tileSlice.reducer;
