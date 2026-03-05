const DEFAULT_BOUNDARIES = [0, 50, 200, 500, 1000, 2000]

function parseBoundaries(): number[] {
  const raw = process.env.TIER_BOUNDARIES
  if (!raw) return DEFAULT_BOUNDARIES
  const parsed = raw.split(',').map((s) => parseInt(s.trim(), 10))
  if (parsed.length !== 6 || parsed.some(isNaN)) return DEFAULT_BOUNDARIES
  return parsed
}

/**
 * Maps a GitHub contribution score to a tree tier (0–5).
 * Boundaries are read from TIER_BOUNDARIES env var (comma-separated).
 * Default: [0, 50, 200, 500, 1000, 2000]
 *
 * tier 0: score < 50        Bare Tree
 * tier 1: 50  <= score < 200  Sakura
 * tier 2: 200 <= score < 500  Willow
 * tier 3: 500 <= score < 1000 Oak
 * tier 4: 1000 <= score < 2000 Redwood
 * tier 5: score >= 2000      Crystal
 */
export function getTier(score: number): number {
  const boundaries = parseBoundaries()
  for (let tier = 5; tier >= 1; tier--) {
    if (score >= boundaries[tier]) return tier
  }
  return 0
}
