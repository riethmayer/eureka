import type { GameBoard } from "@/types/game-board";

export type Game = {
  id: string;
  board: GameBoard;
  name: string;
  level: number;
  score: number;
  max_time: number;
  time_passed: number;
  // Order strategy the board was dealt with. Historical rows default to 'random'.
  strategy: string;
  created_at: string;
};

export type NewGame = Omit<Game, "id" | "created_at">;
