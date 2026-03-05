import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Redis client — instantiated lazily so the module loads even without env vars
// ---------------------------------------------------------------------------
let _redis: Redis | null = null

function getRedis(): Redis {
  if (_redis) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token || url === 'your_upstash_url_here' || token === 'your_upstash_token_here') {
    throw new Error('Upstash Redis env vars not configured')
  }
  _redis = new Redis({ url, token })
  return _redis
}

// ---------------------------------------------------------------------------
// Rate limiter — 10 requests per minute per IP, sliding window
// ---------------------------------------------------------------------------
let _ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit {
  if (_ratelimit) return _ratelimit
  _ratelimit = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'pixel-tree:rl',
  })
  return _ratelimit
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number // unix timestamp ms of window reset
}

/**
 * Checks the per-IP rate limit (10 req/min, sliding window).
 * Fails open if Redis is unavailable — logs a warning and allows the request.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const result = await getRatelimit().limit(ip)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (err) {
    // Fail open: if Upstash is down, don't block legitimate traffic
    console.warn('[rateLimiter] Redis unavailable — failing open:', err)
    return { success: true, remaining: 9, reset: Date.now() + 60_000 }
  }
}

// ---------------------------------------------------------------------------
// Per-username score cache — 24h TTL
// ---------------------------------------------------------------------------
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
    console.warn('[rateLimiter] getCachedScore Redis error — skipping cache:', err)
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
    console.warn('[rateLimiter] setCachedScore Redis error — skipping cache write:', err)
  }
}
