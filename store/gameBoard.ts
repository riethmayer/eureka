import {
  createAction,
  createSlice,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '@store/store';
import buildTiles from '@utils/buildTiles'
import checkFree from '@utils/checkFree';
import { startGame, Timer } from './constraints';

// initial board
const initialBoard = buildTiles()

// selectors
export const selectBoard = (state: AppState): typeof initialBoard => state.gameBoard;

//actions (game board)
export const select = createAction<number>('gameBoard/SELECT');
export const unselect = createAction<number>('gameBoard/UNSELECT');
export const freeTile = createAction<number>('gameBoard/FREE_TILE');
export const clickInvalidTile = createAction<number>('gameBoard/CLICK_INVALID_TILE');
export const solve = createAction<number>('gameBoard/SOLVE');
export const cleanup = createAction<number>('gameBoard/CLEANUP');


export const gameBoard = createSlice({
  name: 'gameBoard',
  initialState: initialBoard,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(startGame, (board, action: PayloadAction<Timer>) => {
      return buildTiles();
    })
    builder.addCase(select, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      tile.active = true
    })
    builder.addCase(unselect, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      tile.active = false
    })
    builder.addCase(freeTile, (board, action: PayloadAction<number>) => {
      const index = action.payload;
      const tile = board[index];
      const dispatch = useDispatch();
      const currentBoard = useSelector(selectBoard)
      /* see whether tile is free */
      const { row } = tile
      if(checkFree(index, row, board)) {
        // dispatch in reducer is an anti-pattern
          dispatch(select(index))
          dispatch(solve(index))
          dispatch(cleanup(index))
      } else {
        dispatch(clickInvalidTile(index))
      }
    })
    builder.addCase(clickInvalidTile, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      console.log('invalid tile clicked', tile, action.payload);
    })
    builder.addCase(solve, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      delete board[action.payload]
      console.log('solving', tile, board)
    })
  }
});

export default gameBoard
