// Seeded PRNG for deterministic mock data generation
// Uses mulberry32 algorithm for fast, reproducible random numbers

function mulberry32(seed: number): () => number {
  let s = seed | 0;

  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = ((hash << 5) - hash + char) | 0;
  }

  return Math.abs(hash);
}

export function createSeededRandom(key: string): () => number {
  return mulberry32(hashString(key));
}
