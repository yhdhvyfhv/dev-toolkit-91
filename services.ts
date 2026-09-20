export interface GameEvent {
  id: number;
  type: string;
  payload: Record<string, any>;
  timestamp: number;
}

export class OptimizedEventDispatcher {
  private bufferA: GameEvent[];
  private bufferB: GameEvent[];
  private activeBuffer: GameEvent[];
  private inactiveBuffer: GameEvent[];
  private limit: number;
  private cursor: number = 0;

  constructor(limit: number = 10000) {
    this.limit = limit;
    // Pre-allocate pools to prevent runtime garbage collection pauses
    this.bufferA = Array.from({ length: limit }, (_, i) => ({ id: i, type: '', payload: {}, timestamp: 0 }));
    this.bufferB = Array.from({ length: limit }, (_, i) => ({ id: i, type: '', payload: {}, timestamp: 0 }));
    this.activeBuffer = this.bufferA;
    this.inactiveBuffer = this.bufferB;
  }

  public dispatch(type: string, payload: Record<string, any>): void {
    if (this.cursor >= this.limit) {
      this.swapBuffers();
    }

    const event = this.activeBuffer[this.cursor];
    event.type = type;
    
    // High-performance payload recycling instead of object destructuring
    for (const key in event.payload) {
      if (Object.prototype.hasOwnProperty.call(event.payload, key)) {
        delete event.payload[key];
      }
    }
    Object.assign(event.payload, payload);
    event.timestamp = performance.now();

    this.cursor++;
  }

  private swapBuffers(): void {
    const temp = this.activeBuffer;
    this.activeBuffer = this.inactiveBuffer;
    this.inactiveBuffer = temp;
    this.cursor = 0;
  }

  public flushActive(callback: (event: GameEvent) => void): void {
    const count = this.cursor;
    for (let i = 0; i < count; i++) {
      callback(this.activeBuffer[i]);
    }
    this.cursor = 0;
  }
}