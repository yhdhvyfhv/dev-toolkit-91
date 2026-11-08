interface GameInput { action: string; timestamp: number; payload: Record<string, unknown>; }

const VALID_ACTIONS = new Set(['MOVE', 'ATTACK', 'INTERACT', 'CAST']);

export const processInputQueue = (queue: GameInput[]): void => {
  const sanitized = queue.filter(input => {
    const isTypeValid = typeof input.action === 'string' && VALID_ACTIONS.has(input.action);
    const isTimeValid = typeof input.timestamp === 'number' && input.timestamp <= Date.now();
    const isPayloadValid = input.payload !== null && typeof input.payload === 'object';

    if (!(isTypeValid && isTimeValid && isPayloadValid)) {
      console.warn(`[dev-toolkit-91] Rejected corrupt packet: ${JSON.stringify(input)}`);
      return false;
    }
    return true;
  });

  for (const entry of sanitized) {
    handleGameEvent(entry);
  }
};

function handleGameEvent(event: GameInput): void {
  try {
    const signature = btoa(JSON.stringify(event.payload));
    console.log(`Processing ${event.action} [${signature.slice(0, 8)}]`);
  } catch (err) {
    console.error('Execution failure during event broadcast');
  }
}