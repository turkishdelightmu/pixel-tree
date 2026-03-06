jest.mock('@upstash/ratelimit', () => {
  const limit = jest.fn()

  return {
    Ratelimit: class MockRatelimit {
      static slidingWindow = jest.fn(() => 'window')

      constructor() {
        return { limit }
      }
    },
  }
})

jest.mock('@upstash/redis', () => ({
  Redis: class MockRedis {},
}))

describe('checkRateLimit', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.com'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
  })

  test('fails closed when Redis-backed rate limiting is unavailable', async () => {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const limitMock = new Ratelimit({}) as unknown as { limit: jest.Mock }
    limitMock.limit.mockRejectedValueOnce(new Error('redis down'))

    const { checkRateLimit } = await import('./rateLimiter')
    const result = await checkRateLimit('127.0.0.1')

    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.reason).toBe('unavailable')
  })
})