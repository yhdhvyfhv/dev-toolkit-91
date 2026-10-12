export type GameTick = number;
export type EntityId = string;

export interface PerformanceBuffer {
  readonly capacity: number;
  readonly pointer: number;
  readonly data: Float64Array;
}

export const createFrameBuffer = (capacity: number = 64): PerformanceBuffer => ({
  capacity,
  pointer: 0,
  data: new Float64Array(capacity).fill(-1),
});

export function recordFrameTime(buffer: PerformanceBuffer, duration: number): void {
  buffer.data[buffer.pointer] = duration;
  buffer.pointer = (buffer.pointer + 1) % buffer.capacity;
}

export function getAverageLatency(buffer: PerformanceBuffer): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < buffer.capacity; i++) {
    if (buffer.data[i] !== -1) {
      sum += buffer.data[i];
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

export type EngineState = {
  readonly fps: number;
  readonly frameLatency: PerformanceBuffer;
  readonly memoryPressure: boolean;
};