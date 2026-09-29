export type GameResult<T> = { data: T; error: null } | { data: null; error: string };

const GAMING_ERROR_CODES: Record<string, string> = {
  'CONN_LOST': 'Your controller connection dropped to the abyss',
  'ASSET_MISSING': 'The pixels refused to load',
  'LAG_SPIKE': 'Time has dilated, try reconnecting',
};

export const safeExecute = async <T>(
  task: () => Promise<T>,
  fallback: T
): Promise<GameResult<T>> => {
  try {
    const result = await task();
    return { data: result, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown glitch';
    const friendly = GAMING_ERROR_CODES[message] || 'An unexpected game state occurred';
    console.warn(`[dev-toolkit-91] ${friendly}`);
    return { data: fallback, error: friendly };
  }
};

export const fetchGameState = async (id: string): Promise<GameResult<Record<string, any>>> => {
  return safeExecute(async () => {
    const response = await fetch(`/api/game/${id}`);
    if (!response.ok) throw new Error('CONN_LOST');
    return response.json();
  }, { status: 'idle', players: [] });
};

export class GlitchBoundary {
  static handle(err: any): string {
    const code = String(err).split(':')[0] || 'CRASH_UNKNOWN';
    return GAMING_ERROR_CODES[code] || 'Game engine kernel panic';
  }
}