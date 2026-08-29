export type GameErrorType = 'BOUNDARY' | 'COLLISION' | 'RESOURCE' | 'STATE';

export interface GamingError {
  type: GameErrorType;
  message: string;
  metadata: {
    timestamp: number;
    severity: 1 | 2 | 3 | 4 | 5;
    gameId: string;
  };
}

export type ErrorResolution = 'retry' | 'abort' | 'fallback' | 'ignore';

export interface ErrorContext {
  playerId: string;
  level: number;
  action: string;
}

export function createGamingError(type: GameErrorType, msg: string, gameId: string): GamingError {
  return {
    type,
    message: msg,
    metadata: {
      timestamp: Date.now(),
      severity: type === 'BOUNDARY' ? 3 : 2,
      gameId
    }
  };
}

export function handleEdgeCaseError(error: GamingError, context: ErrorContext): ErrorResolution {
  if (error.metadata.severity > 4) {
    return 'abort';
  }
  switch (error.type) {
    case 'BOUNDARY':
      console.warn(`Player ${context.playerId} hit boundary in level ${context.level}`);
      return 'fallback';
    case 'COLLISION':
      console.warn(`Collision detected for ${context.action}`);
      return 'retry';
    case 'RESOURCE':
      console.error(`Resource issue: ${error.message}`);
      return 'ignore';
    case 'STATE':
      if (context.level < 1) {
        return 'abort';
      }
      return 'fallback';
    default:
      return 'abort';
  }
}

export function warpErrorContext(error: GamingError, context: ErrorContext): ErrorContext {
  const warped = { ...context };
  if (error.type === 'BOUNDARY') {
    warped.level = Math.max(1, warped.level - 1);
  } else if (error.type === 'COLLISION') {
    warped.action = 'deflect';
  }
  return warped;
}

export function safeGameAction<T>(action: () => T, errorHandler: (e: GamingError) => void): T | null {
  try {
    return action();
  } catch (e) {
    const gamingErr = createGamingError('STATE', e instanceof Error ? e.message : 'unknown', 'default');
    errorHandler(gamingErr);
    return null;
  }
}