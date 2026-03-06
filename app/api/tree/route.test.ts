import { NextRequest } from 'next/server'

jest.mock('@/lib/github', () => ({
  GitHubError: class GitHubError extends Error {
    constructor(public readonly status: number, message: string) {
      super(message)
    }
  },
  fetchContributions: jest.fn(),
}))

jest.mock('@/lib/treeSelector', () => ({
  getTier: jest.fn(() => 0),
}))

jest.mock('@/lib/renderer', () => ({
  renderTree: jest.fn(async () => Buffer.from('png')),
}))

jest.mock('@/lib/cardRenderer', () => ({
  renderTreeCard: jest.fn(async () => Buffer.from('png')),
}))

jest.mock('@/lib/rateLimiter', () => ({
  checkRateLimit: jest.fn(),
}))

jest.mock('@/lib/scoreCache', () => ({
  getCachedScore: jest.fn(),
  setCachedScore: jest.fn(),
}))

const mockedRateLimiter = jest.requireMock('@/lib/rateLimiter') as {
  checkRateLimit: jest.Mock
}

const mockedScoreCache = jest.requireMock('@/lib/scoreCache') as {
  getCachedScore: jest.Mock
  setCachedScore: jest.Mock
}

describe('GET /api/tree', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedRateLimiter.checkRateLimit.mockResolvedValue({
      success: true,
      remaining: 9,
      reset: Date.now() + 60_000,
      reason: 'ok',
    })
    mockedScoreCache.getCachedScore.mockResolvedValue(0)
  })

  test('rejects usernames longer than 39 characters', async () => {
    const { GET } = await import('./route')
    const req = new NextRequest('http://localhost/api/tree?user=' + 'a'.repeat(40))

    const res = await GET(req)

    expect(res.status).toBe(400)
    await expect(res.text()).resolves.toContain('39 characters or fewer')
  })

  test('returns 503 when rate limiting service is unavailable', async () => {
    mockedRateLimiter.checkRateLimit.mockResolvedValueOnce({
      success: false,
      remaining: 0,
      reset: Date.now() + 60_000,
      reason: 'unavailable',
    })

    const { GET } = await import('./route')
    const req = new NextRequest('http://localhost/api/tree?user=octocat')
    const res = await GET(req)

    expect(res.status).toBe(503)
    await expect(res.text()).resolves.toBe('Rate limiting service unavailable. Try again shortly.')
  })
  test('returns 400 for unsupported formats', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/tree?user=octocat&format=gif')

    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Unsupported format')
  })

  test('renders preview tiers without hitting rate limiting or GitHub', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/tree?previewTier=2')

    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/png')
    expect(mockedRateLimiter.checkRateLimit).not.toHaveBeenCalled()
  })

  test('returns 400 for invalid preview tiers', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/tree?previewTier=99')

    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Invalid preview tier')
  })

  test('returns 400 for non-numeric preview tiers', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/tree?previewTier=abc')

    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Invalid preview tier')
  })

  test('uses last x-forwarded-for address for rate limiting fallback', async () => {
    const { GET } = await import('./route')
    const request = new NextRequest('http://localhost:3000/api/tree?user=octocat', {
      headers: {
        'x-forwarded-for': '1.2.3.4, 9.9.9.9',
      },
    })

    await GET(request)

    expect(mockedRateLimiter.checkRateLimit).toHaveBeenCalledWith('9.9.9.9')
  })
})