export type GameResult<T> = { success: true; data: T } | { success: false; error: ErrorCode; context: string };

export enum ErrorCode {
  MEMORY_LEAK = 'MEM_001',
  FRAME_DROP = 'FRM_404',
  ASSET_CORRUPTION = 'GPU_999',
  STATE_DESYNC = 'NET_505'
}

export class ToolkitError extends Error {
  constructor(public code: ErrorCode, message: string, public metadata?: Record<string, unknown>) {
    super(`[dev-toolkit-91] ${code}: ${message}`);
    Object.setPrototypeOf(this, ToolkitError.prototype);
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): GameResult<T> => {
  try {
    return { success: true, data: fn() };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return {
      success: false,
      error: ErrorCode.STATE_DESYNC,
      context: error.message
    };
  }
};

export type EngineHook = (id: string) => GameResult<void>;

export const validateFrame = (id: string): GameResult<void> => {
  if (!id.startsWith('gfx_')) {
    return { success: false, error: ErrorCode.FRAME_DROP, context: 'Invalid frame signature' };
  }
  return { success: true, data: undefined };
};