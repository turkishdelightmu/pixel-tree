import { isValidTreeTier } from './index'
import { buildCrystalLayers } from './crystalTree'
import { buildSakuraLayers } from './sakuraTree'
import { buildWillowLayers } from './willowTree'

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
})