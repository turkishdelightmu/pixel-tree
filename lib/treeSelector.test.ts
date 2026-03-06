import { __testing__, getTier } from './treeSelector'

describe('getTier', () => {
  beforeEach(() => {
    delete process.env.TIER_BOUNDARIES
    __testing__.resetTierBoundaryCache()
  })

  // Tier 0: 0–49
  test('score=0  → tier 0', () => expect(getTier(0)).toBe(0))
  test('score=49 → tier 0', () => expect(getTier(49)).toBe(0))

  // Tier 1: 50–199
  test('score=50  → tier 1', () => expect(getTier(50)).toBe(1))
  test('score=199 → tier 1', () => expect(getTier(199)).toBe(1))

  // Tier 2: 200–499
  test('score=200 → tier 2', () => expect(getTier(200)).toBe(2))
  test('score=499 → tier 2', () => expect(getTier(499)).toBe(2))

  // Tier 3: 500–999
  test('score=500 → tier 3', () => expect(getTier(500)).toBe(3))
  test('score=999 → tier 3', () => expect(getTier(999)).toBe(3))

  // Tier 4: 1000–1999
  test('score=1000 → tier 4', () => expect(getTier(1000)).toBe(4))
  test('score=1999 → tier 4', () => expect(getTier(1999)).toBe(4))

  // Tier 5: 2000+
  test('score=2000 → tier 5', () => expect(getTier(2000)).toBe(5))
  test('score=9999 → tier 5', () => expect(getTier(9999)).toBe(5))

  test('uses updated boundaries only when the env value changes', () => {
    process.env.TIER_BOUNDARIES = '0,10,20,30,40,50'
    __testing__.resetTierBoundaryCache()
    expect(getTier(35)).toBe(3)

    process.env.TIER_BOUNDARIES = '0,100,200,300,400,500'
    expect(getTier(35)).toBe(0)
  })

  test('falls back to defaults for non-monotonic custom boundaries', () => {
    process.env.TIER_BOUNDARIES = '0,50,40,500,1000,2000'
    __testing__.resetTierBoundaryCache()

    expect(getTier(45)).toBe(0)
    expect(getTier(50)).toBe(1)
  })
  test('falls back to defaults when adjacent custom boundaries are equal', () => {
    process.env.TIER_BOUNDARIES = '0,50,50,500,1000,2000'
    __testing__.resetTierBoundaryCache()

    expect(getTier(50)).toBe(1)
    expect(getTier(199)).toBe(1)
  })
})
