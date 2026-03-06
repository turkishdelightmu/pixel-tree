require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
})
const { checkRateLimit } = require('../lib/rateLimiter.ts')
const { getCachedScore, setCachedScore } = require('../lib/scoreCache.ts')

async function main() {
  // With placeholder env vars, Redis will throw on connect.
  // checkRateLimit should fail closed; score cache operations should fail open.

  // Test 1: checkRateLimit fails closed → success: false
  const r = await checkRateLimit('127.0.0.1')
  console.log('checkRateLimit fails closed:', r.success === false ? 'PASS' : 'FAIL got ' + JSON.stringify(r))

  // Test 2: getCachedScore fails open → null
  const score = await getCachedScore('torvalds')
  console.log('getCachedScore fails open:', score === null ? 'PASS' : 'FAIL got ' + score)

  // Test 3: setCachedScore fails open → no throw
  try {
    await setCachedScore('torvalds', 1234)
    console.log('setCachedScore fails open: PASS')
  } catch (e) {
    console.log('setCachedScore fails open: FAIL – threw ' + e)
  }
}
main()
