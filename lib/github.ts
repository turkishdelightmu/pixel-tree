import { graphql } from '@octokit/graphql'

const GITHUB_API_TIMEOUT_MS = 5000

// GitHub username regex per their documented constraints
const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/
const GITHUB_PAT_FORMAT_REGEX = /^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)[A-Za-z0-9_]{10,}$|^[a-f0-9]{40}$/

// Structured error for API route to map to HTTP status codes
export class GitHubError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'GitHubError'
  }
}

interface ContributionsResponse {
  user: {
    contributionsCollection: {
      totalCommitContributions: number
      totalPullRequestContributions: number
      totalIssueContributions: number
      totalRepositoryContributions: number
    }
  } | null
  rateLimit: {
    remaining: number
    resetAt: string
  }
}

export function isAbortLikeError(err: unknown): boolean {
  const apiError = err as { name?: string; message?: string }

  return apiError.name === 'AbortError' || apiError.message === 'The operation was aborted'
}

export function mapGitHubApiError(err: unknown): GitHubError {
  if (isAbortLikeError(err)) {
    return new GitHubError(504, 'GitHub request timed out')
  }

  const apiError = err as { status?: number; message?: string }

  if (apiError.status === 401) {
    return new GitHubError(401, 'GitHub credentials rejected')
  }
  if (apiError.status === 403) {
    return new GitHubError(403, 'GitHub access forbidden')
  }
  if (apiError.status === 404 || (apiError.message && apiError.message.includes('Could not resolve to a User'))) {
    return new GitHubError(404, 'User not found')
  }
  if (apiError.status === 429) {
    return new GitHubError(429, 'GitHub rate limit hit')
  }

  return new GitHubError(500, 'Internal server error')
}

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
      }
    }
    rateLimit {
      remaining
      resetAt
    }
  }
`

/**
 * Fetches the total GitHub contribution score for a user over the past 365 days.
 * Score = totalCommitContributions + totalPullRequestContributions
 *       + totalIssueContributions + totalRepositoryContributions
 *
 * @throws GitHubError(400) if username format is invalid
 * @throws GitHubError(404) if the GitHub user does not exist
 * @throws GitHubError(429) if the GitHub PAT is rate limited
 * @throws GitHubError(500) on any unexpected error
 */
export async function fetchContributions(username: string): Promise<number> {
  if (!USERNAME_REGEX.test(username)) {
    throw new GitHubError(400, 'Invalid username format')
  }

  const token = process.env.GH_PAT
  if (!token || token === 'your_github_pat_here') {
    throw new GitHubError(500, 'GitHub PAT not configured')
  }

  if (!GITHUB_PAT_FORMAT_REGEX.test(token)) {
    console.warn('[github] GH_PAT format looks unusual. Verify token type and scopes.')
  }

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)

  const graphqlWithAuth = graphql.defaults({
    headers: { authorization: `token ${token}` },
  })
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), GITHUB_API_TIMEOUT_MS)

  try {
    const data = await graphqlWithAuth<ContributionsResponse>(
      CONTRIBUTIONS_QUERY,
      {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
        request: {
          signal: controller.signal,
        },
      },
    )

    if (data.rateLimit?.remaining !== undefined) {
      console.info('[github] GitHub API rate limit remaining:', data.rateLimit.remaining)
    }

    if (!data.user) {
      throw new GitHubError(404, 'User not found')
    }

    const { totalCommitContributions, totalPullRequestContributions, totalIssueContributions, totalRepositoryContributions } =
      data.user.contributionsCollection

    return (
      totalCommitContributions +
      totalPullRequestContributions +
      totalIssueContributions +
      totalRepositoryContributions
    )
  } catch (err) {
    // Re-throw our own errors untouched
    if (err instanceof GitHubError) throw err

    throw mapGitHubApiError(err)
  } finally {
    clearTimeout(timeoutId)
  }
}
