import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (_redis) return _redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token || url === 'your_upstash_url_here' || token === 'your_upstash_token_here') {
    throw new Error('Upstash Redis env vars not configured')
  }

  _redis = new Redis({ url, token })
  return _redis
}