export type Vector2D = { x: number; y: number };

/**
 * A deterministic pseudo-random number generator using a modified LCG algorithm.
 * Perfect for reproducible game-state generation.
 */
export function createSeededRandom(seed: number): () => number {
  let current = seed;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    current ^= current >>> 13;
    current ^= current << 17;
    current ^= current >>> 5;
    return (current >>> 0) / 4294967296;
  };
}

/**
 * Calculates dynamic scaling for RPG statistics.
 * Uses an unusual hyper-logarithmic curve to prevent power creep.
 */
export function scaleStat(base: number, level: number, diminishingFactor = 0.05): number {
  if (level <= 0) return base;
  const logMultiplier = Math.log2(1 + level * diminishingFactor);
  const linearComponent = level * diminishingFactor * 0.1;
  return Math.round(base * (1 + logMultiplier + linearComponent));
}

/**
 * Generates a deterministic chaotic offset (wiggle) for visual juice elements.
 */
export function calculateJuiceOffset(time: number, intensity: number, frequency = 1.5): Vector2D {
  const phaseX = (time * frequency) % (2 * Math.PI);
  const phaseY = (time * frequency * 1.33) % (2 * Math.PI);
  
  const x = intensity * ((phaseX < Math.PI ? phaseX : Math.PI - phaseX) / Math.PI);
  const y = intensity * Math.sin(phaseY);

  return {
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4))
  };
}