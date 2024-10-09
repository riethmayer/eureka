import { highscores } from "@/db/schema";

export type Highscore = typeof highscores.$inferSelect;
export type NewHighscore = typeof highscores.$inferInsert;
