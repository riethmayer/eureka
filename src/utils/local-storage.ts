import type { Game, NewGame } from '@/types/game'

const CURRENT_GAME_KEY = 'eureka:current-game'
const HIGH_SCORES_KEY = 'eureka:high-scores'
const MAX_HIGH_SCORES = 10

export type HighScoreEntry = {
  id: string
  name: string
  score: number
  level: number
  createdAt: string
}

const safeGet = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const safeSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Failed to write localStorage key "${key}"`, e)
  }
}

export const saveGame = (
  gameState: NewGame & { id?: string | null }
): Game => {
  const id = gameState.id || crypto.randomUUID()
  const game: Game = {
    ...gameState,
    id,
    createdAt: new Date().toISOString(),
  }
  safeSet(CURRENT_GAME_KEY, game)
  return game
}

export const loadGame = (): Game | null => {
  return safeGet<Game>(CURRENT_GAME_KEY)
}

export const addHighScore = (game: {
  id: string
  name: string
  score: number
  level: number
}): void => {
  if (game.score <= 0) return

  const existing = getHighScores()
  const entry: HighScoreEntry = {
    id: game.id,
    name: game.name || 'unknown',
    score: game.score,
    level: game.level,
    createdAt: new Date().toISOString(),
  }

  const updated = [...existing, entry]
    .sort((a, b) => b.score - a.score || b.level - a.level)
    .slice(0, MAX_HIGH_SCORES)

  safeSet(HIGH_SCORES_KEY, updated)
}

export const getHighScores = (): HighScoreEntry[] => {
  return safeGet<HighScoreEntry[]>(HIGH_SCORES_KEY) || []
}
