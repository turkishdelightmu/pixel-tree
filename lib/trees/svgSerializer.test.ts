import { serializeTreeToSVG } from '../svgSerializer'
import { buildSakuraLayers } from './sakuraTree'
import { buildWillowLayers } from './willowTree'
import { buildCrystalLayers } from './crystalTree'
import { buildBareLayers } from './bareTree'
import type { TreeLayer } from './layers'

describe('serializeTreeToSVG', () => {
  test('returns a valid SVG string', () => {
    const svg = serializeTreeToSVG(buildSakuraLayers())
    expect(svg).toContain('<?xml version="1.0"')
    expect(svg).toContain('<svg ')
    expect(svg).toContain('</svg>')
  })

  test('SVG dimensions match scale (default scale=6)', () => {
    const svg = serializeTreeToSVG(buildSakuraLayers())
    expect(svg).toContain('width="384"')  // 64 * 6
    expect(svg).toContain('height="480"') // 80 * 6
  })

  test('custom scale changes SVG dimensions', () => {
    const svg = serializeTreeToSVG(buildSakuraLayers(), 4)
    expect(svg).toContain('width="256"')  // 64 * 4
    expect(svg).toContain('height="320"') // 80 * 4
  })

  test('each layer becomes an SVG group with correct id', () => {
    const layers = buildSakuraLayers()
    const svg = serializeTreeToSVG(layers)
    for (const layer of layers) {
      expect(svg).toContain(`id="layer-${layer.id}"`)
    }
  })

  test('animated layers include CSS animation style', () => {
    const svg = serializeTreeToSVG(buildSakuraLayers())
    // petals layer should carry the fall animation
    expect(svg).toContain('animation:pixel-fall')
    expect(svg).toContain('@keyframes pixel-fall')
  })

  test('willow strands get sway animation', () => {
    const svg = serializeTreeToSVG(buildWillowLayers())
    expect(svg).toContain('animation:pixel-sway')
    expect(svg).toContain('@keyframes pixel-sway')
  })

  test('crystal particles get float and sparkles get twinkle', () => {
    const svg = serializeTreeToSVG(buildCrystalLayers())
    expect(svg).toContain('animation:pixel-float')
    expect(svg).toContain('animation:pixel-twinkle')
  })

  test('bare tree snow gets drift animation', () => {
    const svg = serializeTreeToSVG(buildBareLayers())
    expect(svg).toContain('animation:pixel-drift')
  })

  test('non-animated layers have no animation style', () => {
    const layers: TreeLayer[] = [
      { id: 'static', shapes: [{ kind: 'rect', x: 0, y: 0, width: 2, height: 2, color: '#fff' }] },
    ]
    const svg = serializeTreeToSVG(layers)
    expect(svg).not.toContain('animation:')
    expect(svg).not.toContain('<style>')
  })

  test('produces rect elements scaled by the scale factor', () => {
    const layers: TreeLayer[] = [
      { id: 'test', shapes: [{ kind: 'rect', x: 1, y: 2, width: 3, height: 4, color: '#abc' }] },
    ]
    const svg = serializeTreeToSVG(layers, 5)
    // x=5, y=10, width=15, height=20
    expect(svg).toContain('x="5" y="10" width="15" height="20"')
  })

  test('pixel shapes produce 1-unit rects scaled correctly', () => {
    const layers: TreeLayer[] = [
      { id: 'test', shapes: [{ kind: 'pixel', x: 3, y: 4, color: '#def' }] },
    ]
    const svg = serializeTreeToSVG(layers, 5)
    // x=15, y=20, width=5, height=5
    expect(svg).toContain('x="15" y="20" width="5" height="5"')
  })

  test('strand-tips sway animation carries a non-zero delay', () => {
    const svg = serializeTreeToSVG(buildWillowLayers())
    // strand-tips has delay: 0.4
    expect(svg).toContain('0.4s ease-in-out')
  })
})
