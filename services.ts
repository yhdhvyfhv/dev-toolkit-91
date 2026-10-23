export interface FrameBuffer { data: Float32Array; tick: number; }

const CACHE_CAPACITY = 1024;
const ringBuffer = new Float32Array(CACHE_CAPACITY * 16);
let cursor = 0;

export const computePhysicsBatch = (entities: Float32Array[]): Float32Array => {
  const batch = new Float32Array(entities.length * 16);
  for (let i = 0; i < entities.length; i++) {
    const offset = i * 16;
    batch.set(entities[i], offset);
  }
  return batch;
};

export const memoizeTransform = (id: string, transform: Float32Array): Float32Array => {
  const target = cursor % CACHE_CAPACITY;
  const start = target * 16;
  ringBuffer.set(transform, start);
  cursor++;
  return ringBuffer.subarray(start, start + 16);
};

export const flushBuffer = (): void => {
  ringBuffer.fill(0);
  cursor = 0;
};

export const getEngineTelemetry = () => ({
  usage: cursor / CACHE_CAPACITY,
  active: cursor > 0
});