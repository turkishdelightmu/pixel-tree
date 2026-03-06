jest.mock('@octokit/graphql', () => ({
  graphql: {
    defaults: jest.fn(),
  },
}))

import { GitHubError, mapGitHubApiError } from './github'

function getGraphqlDefaultsMock(): jest.Mock {
  const mockedModule = jest.requireMock('@octokit/graphql') as {
    graphql: {
      defaults: jest.Mock
    }
  }

  return mockedModule.graphql.defaults
}

describe('mapGitHubApiError', () => {
  test('maps abort-like errors to timeout', () => {
    const error = mapGitHubApiError({ name: 'AbortError' })

    expect(error).toBeInstanceOf(GitHubError)
    expect(error.status).toBe(504)
    expect(error.message).toBe('GitHub request timed out')
  })

  test('maps 401 to invalid credentials', () => {
    const error = mapGitHubApiError({ status: 401 })

    expect(error).toBeInstanceOf(GitHubError)
    expect(error.status).toBe(401)
    expect(error.message).toBe('GitHub credentials rejected')
  })

  test('maps 403 to forbidden access', () => {
    const error = mapGitHubApiError({ status: 403 })

    expect(error.status).toBe(403)
    expect(error.message).toBe('GitHub access forbidden')
  })

  test('maps explicit 429 to rate limit', () => {
    const error = mapGitHubApiError({ status: 429 })

    expect(error.status).toBe(429)
    expect(error.message).toBe('GitHub rate limit hit')
  })
})

describe('fetchContributions', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env.GH_PAT = 'token'
  })

  test('passes an abort signal to the GitHub request', async () => {
    const graphqlRequest = jest.fn().mockResolvedValue({
      user: {
        contributionsCollection: {
          totalCommitContributions: 1,
          totalPullRequestContributions: 2,
          totalIssueContributions: 3,
          totalRepositoryContributions: 4,
        },
      },
      rateLimit: { remaining: 4999, resetAt: new Date().toISOString() },
    })
    const graphqlDefaultsMock = getGraphqlDefaultsMock()
    graphqlDefaultsMock.mockReturnValue(graphqlRequest)

    const { fetchContributions } = await import('./github')
    const score = await fetchContributions('octocat')

    expect(score).toBe(10)
    expect(graphqlRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        request: {
          signal: expect.any(AbortSignal),
        },
      }),
    )
  })

  test('reuses the configured GraphQL client across requests', async () => {
    const graphqlRequest = jest.fn().mockResolvedValue({
      user: {
        contributionsCollection: {
          totalCommitContributions: 1,
          totalPullRequestContributions: 0,
          totalIssueContributions: 0,
          totalRepositoryContributions: 0,
        },
      },
      rateLimit: { remaining: 4999, resetAt: new Date().toISOString() },
    })
    const graphqlDefaultsMock = getGraphqlDefaultsMock()
    graphqlDefaultsMock.mockReturnValue(graphqlRequest)

    const { fetchContributions } = await import('./github')
    await fetchContributions('octocat')
    await fetchContributions('defunkt')

    expect(graphqlDefaultsMock).toHaveBeenCalledTimes(1)
    expect(graphqlRequest).toHaveBeenCalledTimes(2)
  })
})