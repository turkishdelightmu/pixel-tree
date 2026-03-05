import { graphql } from '@octokit/graphql'

// GitHub username regex per their documented constraints
const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/

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

// Holds the rate limit remaining from the last GitHub API call
let _rateLimitRemaining = 5000

/**
 * Returns the X-RateLimit-Remaining value from the most recent GitHub API call.
 * Defaults to 5000 before any call has been made.
 */
export function getRateLimitRemaining(): number {
  return _rateLimitRemaining
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

  const token = process.env.GITHUB_PAT
  if (!token || token === 'your_github_pat_here') {
    throw new GitHubError(500, 'GitHub PAT not configured')
  }

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)

  const graphqlWithAuth = graphql.defaults({
    headers: { authorization: `token ${token}` },
  })

  try {
    const data = await graphqlWithAuth<ContributionsResponse>(
      CONTRIBUTIONS_QUERY,
      {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    )

    // Update stored rate limit
    if (data.rateLimit?.remaining !== undefined) {
      _rateLimitRemaining = data.rateLimit.remaining
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

    const e = err as { status?: number; message?: string }

    if (e.status === 401 || e.status === 403) {
      throw new GitHubError(429, 'GitHub rate limit hit or bad credentials')
    }
    if (e.status === 404 || (e.message && e.message.includes('Could not resolve to a User'))) {
      throw new GitHubError(404, 'User not found')
    }
    if (e.status === 429) {
      throw new GitHubError(429, 'GitHub rate limit hit')
    }

    throw new GitHubError(500, 'Internal server error')
  }
}
