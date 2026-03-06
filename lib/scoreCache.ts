import { getRedis } from './redis'

const CACHE_PREFIX = 'pixel-tree:score:'
const CACHE_TTL_SECONDS = 86_400 // 24 hours

/**
 * Returns the cached contribution score for a username, or null if not cached.
 * Fails open if Redis is unavailable.
 */
export async function getCachedScore(username: string): Promise<number | null> {
  try {
    const key = CACHE_PREFIX + username.toLowerCase()
    const value = await getRedis().get<number>(key)
    return value ?? null
  } catch (err) {
    console.warn('[scoreCache] getCachedScore Redis error — skipping cache:', err)
    return null
  }
}

/**
 * Stores a contribution score in Redis with a 24h TTL.
 * Fails silently if Redis is unavailable.
 */
export async function setCachedScore(username: string, score: number): Promise<void> {
  try {
    const key = CACHE_PREFIX + username.toLowerCase()
    await getRedis().set(key, score, { ex: CACHE_TTL_SECONDS })
  } catch (err) {
    console.warn('[scoreCache] setCachedScore Redis error — skipping cache write:', err)
  }
}