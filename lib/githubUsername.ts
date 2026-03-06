const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/
const MAX_GITHUB_USERNAME_LENGTH = 39

export function validateUsername(user: string): string | null {
  if (!user) {
    return 'Missing required query parameter: user'
  }
  if (user.length > MAX_GITHUB_USERNAME_LENGTH) {
    return `Invalid GitHub username: must be ${MAX_GITHUB_USERNAME_LENGTH} characters or fewer`
  }
  if (!USERNAME_RE.test(user)) {
    return `Invalid GitHub username: "${user}"`
  }

  return null
}