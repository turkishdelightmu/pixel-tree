import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from './redis'

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
  reason: 'ok' | 'rate_limited' | 'unavailable'
}

/**
 * Checks the per-IP rate limit (10 req/min, sliding window).
 * Fails closed if Redis is unavailable so rate limiting cannot be bypassed.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const result = await getRatelimit().limit(ip)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      reason: result.success ? 'ok' : 'rate_limited',
    }
  } catch (err) {
    console.error('[rateLimiter] Redis unavailable — failing closed:', err)
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + 60_000,
      reason: 'unavailable',
    }
  }
}
