import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { postHighscore } from "@/utils/post-highscore";
import type { GameBoard } from "@/types/game-board";
import initializeGameBoard from "@/utils/init-gameboard";
// import { initializeTestGameBoard as initializeGameBoard } from "@/utils/init-gameboard";
export type Timer = ReturnType<typeof globalThis.setInterval> | null;

export const EVERY_SECOND = 1000;
export const TIME_TO_SOLVE = 800; // 800 is the original value we believe

export type State = {
  timer: Timer;
  maxTime: number;
  timeRemaining: number;
  levelClear: boolean;
  gameBoard: GameBoard;
  gameOver: boolean;
  score: number;
  level: number;
  name: string;
};

export type Action = {
  formattedTimeRemaining: () => string;
  isGameOver: () => boolean;
  isGameRunning: () => boolean;
  isLevelClear: () => boolean;
  countTilesLeft: () => number;
  pause: () => void;
  resume: () => void;
  start: () => void;
  step: () => void;
  restart: () => void;
  allowedforSelection: (index: string) => boolean;
  clicked: (index: string) => void;
  scoredPair: () => void;
  levelCleared: () => void;
  continueNextLevel: () => void;
  endGame: () => void;
  changeName: (name: string) => void;
};

export type TestActions = {
  __oneSecondRemaining: () => void;
};

export type GameState = State & Action & TestActions;

const initialState: State = {
  timer: null,
  maxTime: TIME_TO_SOLVE,
  timeRemaining: TIME_TO_SOLVE,
  levelClear: false,
  gameBoard: initializeGameBoard(),
  gameOver: false,
  score: 0,
  level: 1,
  name: "unknown",
};

export const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    ...initialState,

    // Pauses the game by clearing the interval timer
    pause: () => {
      set((state) => {
        if (state.timer) {
          globalThis.clearInterval(state.timer);
          return { timer: null };
        }
        return state;
      });
    },

    // Resumes the game by starting the interval timer
    resume: () => {
      set((state) => {
        if (!state.timer) {
          return {
            timer: globalThis.setInterval(() => get().step(), EVERY_SECOND),
          };
        }
        return state;
      });
    },

    // Steps the game forward by decreasing the time remaining
    step: () => {
      set((prev) => {
        const newTimeRemaining = Math.max(prev.timeRemaining - 1, 0);
        if (newTimeRemaining === 0 && prev.timeRemaining !== 0) {
          if (prev.timer) {
            globalThis.clearInterval(prev.timer);
          }
          get().endGame();
          return { timeRemaining: 0, timer: null };
        }
        return { timeRemaining: newTimeRemaining };
      });
    },

    // Starts the game by resetting the state and starting the timer
    start: () => {
      set((prev) => ({
        ...initialState,
        name: prev.name,
        timer:
          prev.timer ||
          globalThis.setInterval(() => get().step(), EVERY_SECOND),
      }));
    },

    restart: () => {
      get().endGame();
      get().start();
    },

    allowedforSelection: (index: string) => {
      // TODO: fix bug where you can select items in hidden layers
      const { gameBoard: board } = get();
      const { row, layer } = board[index];
      const rowItems = (row: number, layer: number) => {
        return Object.keys(board)
          .filter((i) => {
            return board[i].row === row && board[i].layer == layer;
          })
          .map((i: string) => i);
      };

      switch (true) {
        // layer 0
        // see Excalidraw diagram for level 0 edge cases
        // 30 == left-side top-left
        case index === "30":
          return board[42] === undefined;
        // 41 == right-side top-right
        case index === "41":
          return board[55] === undefined;
        // 42 == left-side left crooked
        case index === "42" || index === "56":
          // outermost crooked items, just for documentation sake
          return true;
        // 43 == left-side top-right
        case index === "43":
          return board[42] === undefined;
        // 54 == right-side bottom-right
        case index === "54":
          return board[55] === undefined;
        case index === "55": // right-side left crooked
          return board[56] === undefined;
        // layer 3
        case [139, 140, 141, 142].map(String).includes(index):
          return board[143] === undefined;
        default:
          const items = rowItems(row, layer);
          return (
            index === String(items[items.length - 1]) ||
            index === String(items[0])
          );
      }
    },

    clicked: (index: string) => {
      set((state) => {
        const gameBoard = { ...state.gameBoard };
        const tile = gameBoard[index];
        if (tile.active) {
          // already active, so they're deselecting.
          // if it's active, they were allowed to set it active.
          tile.active = false;
          gameBoard[index] = tile;
          return { gameBoard };
        }

        // if it's not active, we need to check if it's allowed to be selected
        if (!get().allowedforSelection(index)) {
          // it's not allowed to be selected so we need to return the state as is
          console.error("Not allowed to select this tile", index);
          return state;
        }

        // check if we have a pair
        const otherActiveTileIds = Object.keys(gameBoard).filter((i) => {
          return gameBoard[i].active && i !== index;
        });

        const otherActiveTile = otherActiveTileIds.map((i) => gameBoard[i])[0];

        if (otherActiveTile && otherActiveTile.token === tile.token) {
          // if we have a pair, we need to score it
          get().scoredPair();
          // we need to remove both tiles from the board
          delete gameBoard[index];
          delete gameBoard[otherActiveTileIds[0]];
          // if we have no more tiles, we need to clear the level
          if (Object.keys(gameBoard).length === 0) {
            get().levelCleared();
            return { gameBoard: initializeGameBoard() };
          }
          // if we have more tiles, we need to return the new board with the pair removed
          return { gameBoard };
        }

        // if we don't have a pair, we need to deselect the other tile
        if (otherActiveTile) {
          otherActiveTile.active = false;
          gameBoard[otherActiveTileIds[0]] = otherActiveTile;
        }

        // last case, we only need to set the tile active
        tile.active = true;
        gameBoard[index] = tile;
        return { gameBoard };
      });
    },

    scoredPair: () => {
      set((state) => ({ score: state.score + 2 }));
    },

    levelCleared: () => {
      get().pause();
      set((state) => ({
        levelClear: true,
        level: state.level + 1,
        maxTime: state.timeRemaining + TIME_TO_SOLVE,
        timeRemaining: state.timeRemaining + TIME_TO_SOLVE,
      }));
    },

    isLevelClear: () => get().levelClear,

    continueNextLevel: () => {
      set(() => ({
        levelClear: false,
        timer: globalThis.setInterval(() => get().step(), EVERY_SECOND),
      }));
    },

    endGame: async () => {
      set(() => ({ gameOver: true }));
      try {
        await postHighscore({
          name: get().name,
          score: get().score,
          level: get().level,
        });
      } catch (error) {
        console.error("Failed to store highscore", error);
      }
    },

    changeName: (name: string) => {
      set(() => ({ name }));
    },

    // Returns true if the game is currently running
    isGameRunning: () => get().timer !== null,

    // Returns true if the game is over
    isGameOver: () => get().gameOver,

    // Returns the number of tiles left in the game
    countTilesLeft: () => Object.keys(get().gameBoard).length,

    formattedTimeRemaining: () => {
      return new Date(get().timeRemaining * 1000)
        .toISOString()
        .substring(14, 19);
    },

    __oneSecondRemaining: () => {
      set(() => ({ timeRemaining: 1 }));
    },
  }))
);

/**
 * This function subscribes to the game store and provides logs.
 * I'd like to understand how exactly subscribers work in Zustand.
 * TODO: review the docs and write a blog post about it.
 * TODO: consider moving logic to subscribers?
 *  */
export const unsubscribe = () => {
  const unsub = useGameStore.subscribe(({ timeRemaining }) => {
    const gameOver = useGameStore.getState().gameOver;
    const formattedTimeRemaining = useGameStore
      .getState()
      .formattedTimeRemaining();
    console.log({ timeRemaining, formattedTimeRemaining, gameOver });
  });
  return unsub;
};

// also needed to add this
declare global {
  interface Window {
    store: any;
  }
}

if (typeof globalThis.window !== "undefined") {
  globalThis.window.store = useGameStore;
}

export default useGameStore;
