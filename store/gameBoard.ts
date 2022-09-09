import {
  createAction,
  createSlice,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, AppThunk } from '@store/store';
import { startGame } from './constraints';
import { scoredPair } from './score';

const tokens = ['0','1','2','3','4','5','6','7','8','9','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;
export type Token = typeof tokens[number];

const allTokens = [...tokens, ...tokens, ...tokens, ...tokens] as const; // 2 pairs of each token

const shuffleTiles = () => {
  const array = [...allTokens];
  for (let i = allTokens.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export type TokenTile = {
  layer: number;
  row: number;
  index: number; // to have a number as value as keys are always strings.
  column: number;
  token: Token;
  active: boolean;
}

export type TokenTileMap = Record<string, TokenTile>

const tileConfig = {
   0:  {index: 0, layer: 0, row: 0, column: 1 },
   1:  {index: 1, layer: 0, row: 0, column: 2 },
   2:  {index: 2, layer: 0, row: 0, column: 3 },
   3:  {index: 3, layer: 0, row: 0, column: 4 },
   4:  {index: 4, layer: 0, row: 0, column: 5 },
   5:  {index: 5, layer: 0, row: 0, column: 6 },
   6:  {index: 6, layer: 0, row: 0, column: 7 },
   7:  {index: 7, layer: 0, row: 0, column: 8 },
   8:  {index: 8, layer: 0, row: 0, column: 9 },
   9:  {index: 9, layer: 0, row: 0, column: 10 },
  10:  {index: 10, layer: 0, row: 0, column: 11 },
  11:  {index: 11, layer: 0, row: 0, column: 12 },
  12:  {index: 12, layer: 0, row: 1, column: 3 },
  13:  {index: 13, layer: 0, row: 1, column: 4 },
  14:  {index: 14, layer: 0, row: 1, column: 5 },
  15:  {index: 15, layer: 0, row: 1, column: 6 },
  16:  {index: 16, layer: 0, row: 1, column: 7 },
  17:  {index: 17, layer: 0, row: 1, column: 8 },
  18:  {index: 18, layer: 0, row: 1, column: 9 },
  19:  {index: 19, layer: 0, row: 1, column: 10 },
  20:  {index: 20, layer: 0, row: 2, column: 2 },
  21:  {index: 21, layer: 0, row: 2, column: 3 },
  22:  {index: 22, layer: 0, row: 2, column: 4 },
  23:  {index: 23, layer: 0, row: 2, column: 5 },
  24:  {index: 24, layer: 0, row: 2, column: 6 },
  25:  {index: 25, layer: 0, row: 2, column: 7 },
  26:  {index: 26, layer: 0, row: 2, column: 8 },
  27:  {index: 27, layer: 0, row: 2, column: 9 },
  28:  {index: 28, layer: 0, row: 2, column: 10 },
  29:  {index: 29, layer: 0, row: 2, column: 11 },
  30:  {index: 30, layer: 0, row: 3, column: 1 },
  31:  {index: 31, layer: 0, row: 3, column: 2 },
  32:  {index: 32, layer: 0, row: 3, column: 3 },
  33:  {index: 33, layer: 0, row: 3, column: 4 },
  34:  {index: 34, layer: 0, row: 3, column: 5 },
  35:  {index: 35, layer: 0, row: 3, column: 6 },
  36:  {index: 36, layer: 0, row: 3, column: 7 },
  37:  {index: 37, layer: 0, row: 3, column: 8 },
  38:  {index: 38, layer: 0, row: 3, column: 9 },
  39:  {index: 39, layer: 0, row: 3, column: 10 },
  40:  {index: 40, layer: 0, row: 3, column: 11 },
  41:  {index: 41, layer: 0, row: 3, column: 12 },
  42:  {index: 42, layer: 6, row: 4, column: 0 },  // most left tile
  43:  {index: 43, layer: 0, row: 5, column: 1 },
  44:  {index: 44, layer: 0, row: 5, column: 2 },
  45:  {index: 45, layer: 0, row: 5, column: 3 },
  46:  {index: 46, layer: 0, row: 5, column: 4 },
  47:  {index: 47, layer: 0, row: 5, column: 5 },
  48:  {index: 48, layer: 0, row: 5, column: 6 },
  49:  {index: 49, layer: 0, row: 5, column: 7 },
  50:  {index: 50, layer: 0, row: 5, column: 8 },
  51:  {index: 51, layer: 0, row: 5, column: 9 },
  52:  {index: 52, layer: 0, row: 5, column: 10 },
  53:  {index: 53, layer: 0, row: 5, column: 11 },
  54:  {index: 54, layer: 0, row: 5, column: 12 },
  55:  {index: 55, layer: 0, row: 6, column: 13 }, // two most right tiles
  56:  {index: 56, layer: 0, row: 6, column: 14 }, // two most right tiles
  57:  {index: 57, layer: 0, row: 7, column: 2 },
  58:  {index: 58, layer: 0, row: 7, column: 3 },
  59:  {index: 59, layer: 0, row: 7, column: 4 },
  60:  {index: 60, layer: 0, row: 7, column: 5 },
  61:  {index: 61, layer: 0, row: 7, column: 6 },
  62:  {index: 62, layer: 0, row: 7, column: 7 },
  63:  {index: 63, layer: 0, row: 7, column: 8 },
  64:  {index: 64, layer: 0, row: 7, column: 9 },
  65:  {index: 65, layer: 0, row: 7, column: 10 },
  66:  {index: 66, layer: 0, row: 7, column: 11 },
  67:  {index: 67, layer: 0, row: 8, column: 3 },
  68:  {index: 68, layer: 0, row: 8, column: 4 },
  69:  {index: 69, layer: 0, row: 8, column: 5 },
  70:  {index: 70, layer: 0, row: 8, column: 6 },
  71:  {index: 71, layer: 0, row: 8, column: 7 },
  72:  {index: 72, layer: 0, row: 8, column: 8 },
  73:  {index: 73, layer: 0, row: 8, column: 9 },
  74:  {index: 74, layer: 0, row: 8, column: 10 },
  75:  {index: 75, layer: 0, row: 9, column: 1 },
  76:  {index: 76, layer: 0, row: 9, column: 2 },
  77:  {index: 77, layer: 0, row: 9, column: 3 },
  78:  {index: 78, layer: 0, row: 9, column: 4 },
  79:  {index: 79, layer: 0, row: 9, column: 5 },
  80:  {index: 80, layer: 0, row: 9, column: 6 },
  81:  {index: 81, layer: 0, row: 9, column: 7 },
  82:  {index: 82, layer: 0, row: 9, column: 8 },
  83:  {index: 83, layer: 0, row: 9, column: 9 },
  84:  {index: 84, layer: 0, row: 9, column: 10 },
  85:  {index: 85, layer: 0, row: 9, column: 11 },
  86:  {index: 86, layer: 0, row: 9, column: 12 },
  87:  {index: 87, layer: 1, row: 10, column: 4 },
  88:  {index: 88, layer: 1, row: 10, column: 5 },
  89:  {index: 89, layer: 1, row: 10, column: 6 },
  90:  {index: 90, layer: 1, row: 10, column: 7 },
  91:  {index: 91, layer: 1, row: 10, column: 8 },
  92:  {index: 92, layer: 1, row: 10, column: 9 },
  93:  {index: 93, layer: 1, row: 11, column: 4 },
  94:  {index: 94, layer: 1, row: 11, column: 5 },
  95:  {index: 95, layer: 1, row: 11, column: 6 },
  96:  {index: 96, layer: 1, row: 11, column: 7 },
  97:  {index: 97, layer: 1, row: 11, column: 8 },
  98:  {index: 98, layer: 1, row: 11, column: 9 },
  99:  {index: 99, layer: 1, row: 12, column: 4 },
  100: {index: 100, layer: 1, row: 12, column: 5 },
  101: {index: 101, layer: 1, row: 12, column: 6 },
  102: {index: 102, layer: 1, row: 12, column: 7 },
  103: {index: 103, layer: 1, row: 12, column: 8 },
  104: {index: 104, layer: 1, row: 12, column: 9 },
  105: {index: 105, layer: 1, row: 13, column: 4 },
  106: {index: 106, layer: 1, row: 13, column: 5 },
  107: {index: 107, layer: 1, row: 13, column: 6 },
  108: {index: 108, layer: 1, row: 13, column: 7 },
  109: {index: 109, layer: 1, row: 13, column: 8 },
  110: {index: 110, layer: 1, row: 13, column: 9 },
  111: {index: 111, layer: 1, row: 14, column: 4 },
  112: {index: 112, layer: 1, row: 14, column: 5 },
  113: {index: 113, layer: 1, row: 14, column: 6 },
  114: {index: 114, layer: 1, row: 14, column: 7 },
  115: {index: 115, layer: 1, row: 14, column: 8 },
  116: {index: 116, layer: 1, row: 14, column: 9 },
  117: {index: 117, layer: 1, row: 15, column: 4 },
  118: {index: 118, layer: 1, row: 15, column: 5 },
  119: {index: 119, layer: 1, row: 15, column: 6 },
  120: {index: 120, layer: 1, row: 15, column: 7 },
  121: {index: 121, layer: 1, row: 15, column: 8 },
  122: {index: 122, layer: 1, row: 15, column: 9 },
  123: {index: 123, layer: 2, row: 16, column: 5 },
  124: {index: 124, layer: 2, row: 16, column: 6 },
  125: {index: 125, layer: 2, row: 16, column: 7 },
  126: {index: 126, layer: 2, row: 16, column: 8 },
  127: {index: 127, layer: 2, row: 17, column: 5 },
  128: {index: 128, layer: 2, row: 17, column: 6 },
  129: {index: 129, layer: 2, row: 17, column: 7 },
  130: {index: 130, layer: 2, row: 17, column: 8 },
  131: {index: 131, layer: 2, row: 18, column: 5 },
  132: {index: 132, layer: 2, row: 18, column: 6 },
  133: {index: 133, layer: 2, row: 18, column: 7 },
  134: {index: 134, layer: 2, row: 18, column: 8 },
  135: {index: 135, layer: 2, row: 19, column: 5 },
  136: {index: 136, layer: 2, row: 19, column: 6 },
  137: {index: 137, layer: 2, row: 19, column: 7 },
  138: {index: 138, layer: 2, row: 19, column: 8 },
  139: {index: 139, layer: 3, row: 20, column: 6 },
  140: {index: 140, layer: 3, row: 20, column: 7 },
  141: {index: 141, layer: 3, row: 21, column: 6 },
  142: {index: 142, layer: 3, row: 21, column: 7 },
  143: {index: 143, layer: 4, row: 22, column: 15 }, // top tile
} as const;


const buildTiles = (): TokenTileMap => {
  return shuffleTiles()
    .map((token: Token, index) => [token, String(index)])
    .reduce((obj, [token, index]: [Token, string]) => {
      obj[index]= {
        ...tileConfig[index],
        active: false,
        token,
      }
      return(obj)
    }, {} as TokenTileMap)
}

// initial board
const initialBoard = buildTiles();

// selectors
export const selectBoard = (state: AppState): TokenTileMap => state.gameBoard;

//actions (game board)
export const selected = createAction<number>('gameBoard/SELECTED');
export const deselected = createAction<number>('gameBoard/DESELECTED');
export const clickedInvalidTile = createAction<number>('gameBoard/CLICKED_INVALID_TILE');
export const solved = createAction<number>('gameBoard/SOLVE');

export const gameBoard = createSlice({
  name: 'gameBoard',
  initialState: initialBoard,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(startGame, () => {
      return buildTiles();
    })
    builder.addCase(selected, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      tile.active = true;
    })
    builder.addCase(deselected, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      tile.active = false;
    })
    builder.addCase(clickedInvalidTile, () => {
      console.log('invalid tile clicked');
    })
    builder.addCase(solved, (board, action: PayloadAction<number>) => {
      const tile = board[action.payload]
      delete board[action.payload]
    })
    builder.addDefaultCase((board) => {
      return board;
    })
  }
});

export const clicked = (clickedIndex): AppThunk => async (dispatch, getState) => {
  const { gameBoard } = getState();
  const { index, active } = gameBoard[clickedIndex]
  if(active) {
    dispatch(deselected(index))
  } else {
    dispatch(freeTile(index))
  }
}

export const freeTile = (clickedIndex): AppThunk => async (dispatch, getState) => {
  const { gameBoard } = getState();
  const { index, row, active, token } = gameBoard[clickedIndex]
  if(tileAllowedForSelection(index, row, gameBoard)) {
    dispatch(selected(index))
    dispatch(solveOrCleanup(index))
  } else {
    dispatch(clickedInvalidTile(index))
  }
}

const solveOrCleanup = (currentIndex): AppThunk => async(dispatch, getState) => {
  const { gameBoard } = getState()
  const selectedTile: TokenTile = gameBoard[currentIndex]
  const otherTileIds = Object.keys(gameBoard).filter((id: string) => {
    let { active, index } = gameBoard[id];
    return active && index !== currentIndex
  });
  otherTileIds.map((id: string) => {
    const { token, index } = gameBoard[id]
    if(token === selectedTile.token) {
      dispatch(solved(currentIndex))
      dispatch(solved(index))
      dispatch(scoredPair());
    } else {
      dispatch(deselected(index))
    }
  })
}

const tileAllowedForSelection = (index, row, board) => {
  const rowItems = (row, board) => {
    return Object.keys(board).filter((i) => {
      return board[i].row === row
    }).map((i) => parseInt(i, 10))
  }
  
  const items = rowItems(row, board)
  switch(true) {
    case (row === 3 && index === 30):
      return rowItems(4, board).length === 0
    case (row === 3 && index === 41):
      return rowItems(6, board).length === 0
    case (row === 5 && index === 43):
      return rowItems(4, board).length === 0
    case (row === 5 && index === 54):
      return rowItems(6, board).length === 0
    case (row === 6 && index === 56):
      return true
    case (row === 6 && index === 55):
      return rowItems(6,board).length === 1 // is last element in its row
    case (row === 20 || row === 21):
      /* 4 tiles below the top tile only clickable after top tile is gone */ 
      return rowItems(22, board).length === 0
    default:
      return (index === items[items.length- 1]) || (index === items[0])
  }
}

export default gameBoard.reducer;
