import { isValidTreeTier, buildTreeLayers } from './index'
import { buildCrystalLayers } from './crystalTree'
import { buildSakuraLayers } from './sakuraTree'
import { buildWillowLayers } from './willowTree'
import { buildBareLayers } from './bareTree'
import { buildOakLayers } from './oakTree'
import { buildRedwoodLayers } from './redwoodTree'

describe('isValidTreeTier', () => {
  test('accepts integer tiers in range', () => {
    expect(isValidTreeTier(0)).toBe(true)
    expect(isValidTreeTier(5)).toBe(true)
  })

  test('rejects out-of-range and non-integer tiers', () => {
    expect(isValidTreeTier(-1)).toBe(false)
    expect(isValidTreeTier(6)).toBe(false)
    expect(isValidTreeTier(1.5)).toBe(false)
  })

  test('exposes layered shapes for animated tree tiers', () => {
    expect(buildSakuraLayers().map((layer) => layer.id)).toEqual([
      'ground',
      'trunk',
      'canopy-shadow',
      'canopy-highlight',
      'petals',
    ])
    expect(buildWillowLayers().map((layer) => layer.id)).toEqual([
      'ground',
      'trunk',
      'canopy',
      'strands',
      'strand-tips',
    ])
    expect(buildCrystalLayers().map((layer) => layer.id)).toEqual([
      'ground',
      'trunk',
      'roots',
      'canopy',
      'particles',
      'sparkles',
    ])
    expect(buildSakuraLayers().every((layer) => layer.shapes.length > 0)).toBe(true)
    expect(buildWillowLayers().every((layer) => layer.shapes.length > 0)).toBe(true)
    expect(buildCrystalLayers().every((layer) => layer.shapes.length > 0)).toBe(true)
  })

  test('all newly migrated trees produce non-empty layers', () => {
    expect(buildBareLayers().map((l) => l.id)).toEqual(['ground', 'trunk', 'branches', 'snow'])
    expect(buildOakLayers().map((l) => l.id)).toEqual(['ground', 'trunk', 'canopy', 'highlights'])
    expect(buildRedwoodLayers().map((l) => l.id)).toEqual(['ground', 'trunk', 'branches', 'crown'])

    expect(buildBareLayers().every((l) => l.shapes.length > 0)).toBe(true)
    expect(buildOakLayers().every((l) => l.shapes.length > 0)).toBe(true)
    expect(buildRedwoodLayers().every((l) => l.shapes.length > 0)).toBe(true)
  })

  test('animation specs are attached to animated layers', () => {
    const sakura = buildSakuraLayers()
    expect(sakura.find((l) => l.id === 'petals')?.animation?.type).toBe('fall')

    const willow = buildWillowLayers()
    expect(willow.find((l) => l.id === 'strands')?.animation?.type).toBe('sway')
    expect(willow.find((l) => l.id === 'strand-tips')?.animation?.type).toBe('sway')

    const crystal = buildCrystalLayers()
    expect(crystal.find((l) => l.id === 'particles')?.animation?.type).toBe('float')
    expect(crystal.find((l) => l.id === 'sparkles')?.animation?.type).toBe('twinkle')

    const bare = buildBareLayers()
    expect(bare.find((l) => l.id === 'snow')?.animation?.type).toBe('drift')

    const oak = buildOakLayers()
    expect(oak.find((l) => l.id === 'highlights')?.animation?.type).toBe('pulse')

    const redwood = buildRedwoodLayers()
    expect(redwood.find((l) => l.id === 'crown')?.animation?.type).toBe('pulse')
  })

  test('buildTreeLayers returns correct layers for all tiers', () => {
    expect(buildTreeLayers(0).map((l) => l.id)).toEqual(['ground', 'trunk', 'branches', 'snow'])
    expect(buildTreeLayers(1).find((l) => l.id === 'petals')).toBeDefined()
    expect(buildTreeLayers(2).find((l) => l.id === 'strands')).toBeDefined()
    expect(buildTreeLayers(3).find((l) => l.id === 'highlights')).toBeDefined()
    expect(buildTreeLayers(4).find((l) => l.id === 'crown')).toBeDefined()
    expect(buildTreeLayers(5).find((l) => l.id === 'sparkles')).toBeDefined()
  })

  test('buildTreeLayers throws on invalid tier', () => {
    expect(() => buildTreeLayers(-1)).toThrow()
    expect(() => buildTreeLayers(6)).toThrow()
  })
})