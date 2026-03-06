require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
})
const { fetchContributions, GitHubError } = require('../lib/github.ts')

async function main() {
  // Test 1: invalid username throws GitHubError(400)
  try {
    await fetchContributions('!bad-user!')
    console.log('invalid username: FAIL (no error thrown)')
  } catch (e) {
    const ok = e.name === 'GitHubError' && e.status === 400
    console.log('invalid username → 400:', ok ? 'PASS' : 'FAIL – ' + String(e))
  }

  // Test 2: unconfigured PAT placeholder throws GitHubError(500)
  process.env.GH_PAT = 'your_github_pat_here'
  try {
    await fetchContributions('torvalds')
    console.log('missing PAT: FAIL (no error thrown)')
  } catch (e) {
    const ok = e.name === 'GitHubError' && e.status === 500
    console.log('missing PAT → 500:', ok ? 'PASS' : 'FAIL – ' + String(e))
  }
}
main()
