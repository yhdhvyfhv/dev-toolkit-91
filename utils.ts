export const lerp = (start: number, end: number, amt: number): number => (1 - amt) * start + amt * end;

export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

export const normalizeVector = (x: number, y: number): { x: number; y: number } => {
  const len = Math.sqrt(x * x + y * y);
  return len > 0 ? { x: x / len, y: y / len } : { x: 0, y: 0 };
};

export const rng = (min: number, max: number): number => Math.random() * (max - min) + min;

export const uuid = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

export const throttle = <T extends (...args: any[]) => void>(fn: T, ms: number) => {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? {
    r: parseInt(res[1], 16),
    g: parseInt(res[2], 16),
    b: parseInt(res[3], 16)
  } : { r: 0, g: 0, b: 0 };
};