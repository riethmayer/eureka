import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GameBoard } from "@/types/game-board";
import { initializeGameBoard } from "@/utils/init-gameboard";
import { postGameState } from "@/utils/post-game-state";

export type Timer = ReturnType<typeof globalThis.setInterval> | null;

export const EVERY_SECOND = 1000;
export const TIME_TO_SOLVE = 800; // 800 is the original value we believe

export type State = {
  timer: Timer;
  maxTime: number;
  timePassed: number;
  levelClear: boolean;
  gameBoard: GameBoard;
  gameOver: boolean;
  score: number;
  level: number;
  name: string;
  gameId: string | null;
  isSaving: boolean;
  saveError: string | null;
  lastGameRank: number | null;
  // Separate from lastGameRank (which is cleared by RankToast).
  // Set atomically with gameOver so the game-over page always has the rank on first render.
  gameOverRank: number | null;
};

export type Action = {
  formattedTimeRemaining: () => string;
  isGameOver: () => boolean;
  isGameRunning: () => boolean;
  isLevelClear: () => boolean;
  countTilesLeft: () => number;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  start: () => Promise<void>;
  step: () => Promise<void>;
  restart: () => Promise<void>;
  allowedforSelection: (index: string) => boolean;
  clicked: (index: string) => Promise<void>;
  scoredPair: () => Promise<void>;
  levelCleared: () => Promise<void>;
  continueNextLevel: () => void;
  endGame: () => Promise<void>;
  changeName: (name: string) => void;
  withdraw: () => Promise<void>;
  saveGameState: () => Promise<void>;
  autoSave: () => Promise<void>;
};

export type TestActions = {
  __oneSecondRemaining: () => void;
};

export type GameStore = State & Action & TestActions;

const initialState: State = {
  timer: null,
  maxTime: TIME_TO_SOLVE,
  timePassed: 0,
  levelClear: false,
  gameBoard: {},
  gameOver: false,
  score: 0,
  level: 1,
  name: "",
  gameId: null,
  isSaving: false,
  saveError: null,
  lastGameRank: null,
  gameOverRank: null,
};

// Serialises all saves so concurrent calls never race on gameId.
// Each call chains onto the previous, reading the latest state when it runs.
let _saveQueue: Promise<void> = Promise.resolve();

export const useGameStore = create<GameStore>()(
  devtools((set, get) => {
    return {
      ...initialState,

      // Pauses the game by clearing the interval timer
      pause: async () => {
        const state = get();
        if (!state.isGameRunning()) return;

        clearInterval(state.timer!);
        set({ timer: null });
        await state.saveGameState();
      },

      // Resumes the game by starting the interval timer
      resume: async () => {
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
      step: async () => {
        let timedOut = false;
        set((prev) => {
          const newTimePassed = Math.min(prev.timePassed + 1, prev.maxTime);
          // Autosave every 60 seconds
          if (newTimePassed % 60 === 0) {
            get().autoSave();
          }
          const prevTimeRemaining = prev.maxTime - prev.timePassed;
          const newTimeRemaining = prev.maxTime - newTimePassed;
          if (newTimeRemaining === 0 && prevTimeRemaining !== 0) {
            if (prev.timer) {
              globalThis.clearInterval(prev.timer);
            }
            timedOut = true;
            return { timePassed: newTimePassed, timer: null };
          }
          return { timePassed: newTimePassed };
        });
        // endGame is async (save + rank fetch). Call it outside set() so it
        // can be properly awaited and won't conflict with the set() callback.
        if (timedOut) {
          await get().endGame();
        }
      },

      // Starts the game by resetting the state and starting the timer
      start: async () => {
        set((prev) => ({
          ...initialState,
          gameBoard: initializeGameBoard(),
          name: prev.name,
          timer:
            prev.timer ||
            globalThis.setInterval(() => get().step(), EVERY_SECOND),
        }));
      },

      withdraw: async () => {
        set(() => ({ timePassed: 0 }));
        get().saveGameState();
        get().pause();
        set(() => ({
          timer: null,
          maxTime: TIME_TO_SOLVE,
          timeRemaining: TIME_TO_SOLVE,
          levelClear: false,
          gameBoard: {},
          gameOver: false,
        }));
      },

      restart: async () => {
        await get().endGame();
        get().start();
      },


      allowedforSelection: (index: string) => {
        const { gameBoard: board } = get();
        const { row, layer, column } = board[index];

        // Check for a tile on a higher layer that visually covers the clicked tile.
        // Two tiles overlap vertically when row_j + layer_j === row + layer
        // (both map to the same topFactor). Only the same column can cover a tile
        // because adjacent columns are spaced 1.02× tile-width apart — no visual overlap.
        const coveringItem = (row: number, layer: number, column: number) => {
          return Object.keys(board).filter((j) => {
            return (
              board[j].layer > layer &&
              board[j].column === column &&
              board[j].row + board[j].layer === row + layer
            );
          });
        };

        const rowItems = (row: number, layer: number) => {
          return Object.keys(board)
            .filter((i) => {
              return board[i].row === row && board[i].layer == layer;
            });
        };

        // Check if covering tile exists
        if (coveringItem(row, layer, column).length !== 0) {
          return false;
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

      clicked: async (index: string) => {
        set((state) => {
          const gameBoard = { ...state.gameBoard };
          const tile = gameBoard[index];

          // Ignore clicks on tiles mid-animation
          if (tile.animating) return state;

          if (tile.active) {
            // Deselect
            gameBoard[index] = { ...tile, active: false };
            return { gameBoard };
          }

          if (!get().allowedforSelection(index)) {
            console.debug("Not allowed to select this tile", index);
            return state;
          }

          const otherActiveTileIds = Object.keys(gameBoard).filter((i) => {
            return gameBoard[i].active && i !== index;
          });

          const otherActiveTile = otherActiveTileIds.map((i) => gameBoard[i])[0];
          const otherActiveId = otherActiveTileIds[0];

          if (otherActiveTile && otherActiveTile.token === tile.token) {
            // MATCH — animate pop, then delete after animation completes
            get().scoredPair();
            gameBoard[index] = { ...tile, active: false, animating: 'match' };
            gameBoard[otherActiveId] = { ...otherActiveTile, active: false, animating: 'match' };

            setTimeout(() => {
              set((state) => {
                const board = { ...state.gameBoard };
                delete board[index];
                delete board[otherActiveId];
                if (Object.keys(board).length === 0) {
                  get().levelCleared();
                  return { gameBoard: initializeGameBoard() };
                }
                return { gameBoard: board };
              });
            }, 350);

            return { gameBoard };
          }

          // No prior selection — just select this tile
          if (!otherActiveTile) {
            gameBoard[index] = { ...tile, active: true };
            return { gameBoard };
          }

          // MISMATCH — deselect and shake the first tile, leave the second unselected
          gameBoard[otherActiveId] = { ...otherActiveTile, active: false, animating: 'mismatch' };
          gameBoard[index] = { ...tile, active: false };

          setTimeout(() => {
            set((state) => {
              const board = { ...state.gameBoard };
              if (board[otherActiveId]) {
                board[otherActiveId] = { ...board[otherActiveId], animating: null };
              }
              return { gameBoard: board };
            });
          }, 400);

          return { gameBoard };
        });
      },

      scoredPair: async () => {
        set((state) => ({ score: state.score + 2 }));
      },

      levelCleared: async () => {
        const state = get();
        set((state) => ({
          levelClear: true,
          level: state.level + 1,
          maxTime: TIME_TO_SOLVE * (state.level + 1),
        }));
        await state.pause();
      },

      isLevelClear: () => get().levelClear,

      continueNextLevel: () => {
        set(() => ({
          levelClear: false,
          timer: globalThis.setInterval(() => get().step(), EVERY_SECOND),
        }));
      },

      endGame: async () => {
        // Save first, then look up rank, then set gameOver + both rank fields
        // atomically. This ensures the game-over page always mounts with the
        // correct rank on its first render — no flicker of "Didn't make top 10".
        await get().saveGameState();
        let rank: number | null = null;
        try {
          const res = await fetch("/api/highscores");
          const json = await res.json();
          if (json.success) {
            const gameId = get().gameId;
            rank = (json.data as Array<{ id: string; rank: number }>).find(
              (h) => h.id === gameId
            )?.rank ?? null;
          }
        } catch {
          // non-critical — rank display is best-effort
        }
        // lastGameRank triggers RankToast (then gets cleared by it).
        // gameOverRank is never cleared by the toast — game-over page uses this.
        set({ gameOver: true, lastGameRank: rank, gameOverRank: rank });
      },

      changeName: (name: string) => {
        set(() => ({ name }));
        // If a game is already saved (has a gameId), backfill the name so it
        // isn't stored as empty when the user enters their name mid-session.
        const { gameId } = get();
        if (name && gameId) {
          get().saveGameState();
        }
      },

      // Returns true if the game is currently running
      isGameRunning: () => get().timer !== null,

      // Returns true if the game is over
      isGameOver: () => get().gameOver,

      // Returns the number of tiles left in the game
      countTilesLeft: () => Object.keys(get().gameBoard).length,

      formattedTimeRemaining: () => {
        const timeRemaining = get().maxTime - get().timePassed;
        return new Date(timeRemaining * 1000).toISOString().substring(14, 19);
      },

      __oneSecondRemaining: () => {
        set(() => ({ timePassed: get().maxTime - 1 }));
      },

      saveGameState: async () => {
        const doSave = async () => {
          try {
            set({ isSaving: true, saveError: null });
            const state = get();
            const savedGame = await postGameState({
              id: state.gameId,
              board: state.gameBoard,
              name: state.name,
              level: state.level,
              score: state.score,
              maxTime: state.maxTime,
              timePassed: state.timePassed,
            });
            set({ gameId: savedGame.id });
          } catch (error) {
            set({ saveError: (error as Error).message });
            console.error("Failed to save game state:", error);
          } finally {
            set({ isSaving: false });
          }
        };

        _saveQueue = _saveQueue.then(doSave);
        await _saveQueue;
      },

      autoSave: async () => {
        const state = get();
        if (state.isGameRunning() && !state.gameOver && !state.levelClear) {
          await get().saveGameState();
        }
      },
    };
  })
);

/**
 * This function subscribes to the game store and provides logs.
 * I'd like to understand how exactly subscribers work in Zustand.
 * TODO: review the docs and write a blog post about it.
 * TODO: consider moving logic to subscribers?
 *  */
export const unsubscribe = () => {
  const unsub = useGameStore.subscribe(({ timePassed, gameOver }) => {
    const formattedTimeRemaining = useGameStore
      .getState()
      .formattedTimeRemaining();
    console.log({ timePassed, formattedTimeRemaining, gameOver });
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
