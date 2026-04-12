import type { GameBoard } from "@/types/game-board";

export type Game = {
  id: string;
  board: GameBoard;
  name: string;
  level: number;
  score: number;
  max_time: number;
  time_passed: number;
  created_at: string;
};

export type NewGame = Omit<Game, "id" | "created_at">;
