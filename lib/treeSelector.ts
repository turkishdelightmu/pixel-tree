const DEFAULT_BOUNDARIES = [0, 50, 200, 500, 1000, 2000] as const
const DEFAULT_BOUNDARY_KEY = ''

let cachedBoundaryKey = DEFAULT_BOUNDARY_KEY
let cachedBoundaries: readonly number[] = DEFAULT_BOUNDARIES

function parseBoundaries(raw: string | undefined): readonly number[] {
  if (!raw) return DEFAULT_BOUNDARIES
  const parsed = raw.split(',').map((s) => parseInt(s.trim(), 10))
  if (parsed.length !== 6 || parsed.some(Number.isNaN)) return DEFAULT_BOUNDARIES
  if (parsed.some((value, index) => index > 0 && value <= parsed[index - 1])) return DEFAULT_BOUNDARIES
  return parsed
}

function getBoundaries(): readonly number[] {
  const boundaryKey = process.env.TIER_BOUNDARIES ?? DEFAULT_BOUNDARY_KEY

  if (boundaryKey !== cachedBoundaryKey) {
    cachedBoundaryKey = boundaryKey
    cachedBoundaries = parseBoundaries(process.env.TIER_BOUNDARIES)
  }

  return cachedBoundaries
}

export const __testing__ = {
  resetTierBoundaryCache(): void {
    cachedBoundaryKey = DEFAULT_BOUNDARY_KEY
    cachedBoundaries = DEFAULT_BOUNDARIES
  },
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
  const [, sakura, willow, oak, redwood, crystal] = getBoundaries()

  if (score >= crystal) return 5
  if (score >= redwood) return 4
  if (score >= oak) return 3
  if (score >= willow) return 2
  if (score >= sakura) return 1
  return 0
}
