describe('cardRenderer font initialization', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('registers the DM Sans font once at module load when the font file exists', async () => {
    const registerFont = jest.fn()

    jest.doMock('node:fs', () => ({
      existsSync: jest.fn(() => true),
    }))
    jest.doMock('canvas', () => ({
      createCanvas: jest.fn(),
      registerFont,
    }))

    const cardRenderer = await import('./cardRenderer')

    expect(registerFont).toHaveBeenCalledTimes(1)
    expect(cardRenderer.hasDmSansFontRegistered()).toBe(true)
  })

  test('falls back cleanly when the font file is missing', async () => {
    const registerFont = jest.fn()

    jest.doMock('node:fs', () => ({
      existsSync: jest.fn(() => false),
    }))
    jest.doMock('canvas', () => ({
      createCanvas: jest.fn(),
      registerFont,
    }))

    const cardRenderer = await import('./cardRenderer')

    expect(registerFont).not.toHaveBeenCalled()
    expect(cardRenderer.hasDmSansFontRegistered()).toBe(false)
  })

  test('renders cards through async PNG encoding and uses precompiled glyph pixels', async () => {
    const fillRect = jest.fn()
    const context = {
      fillRect,
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1,
      textBaseline: 'top',
      font: '12px sans-serif',
    }
    const canvas = {
      getContext: jest.fn(() => context),
      toBuffer: jest.fn((callback: (err: Error | null, buffer: Buffer) => void) => callback(null, Buffer.from('png'))),
    }
    const registerFont = jest.fn()

    jest.doMock('node:fs', () => ({
      existsSync: jest.fn(() => true),
    }))
    jest.doMock('canvas', () => ({
      createCanvas: jest.fn(() => canvas),
      registerFont,
    }))
    jest.doMock('./trees', () => ({
      drawTree: jest.fn(),
    }))

    const cardRenderer = await import('./cardRenderer')
    const buffer = await cardRenderer.renderTreeCard({ username: 'octocat', score: 12, tier: 1 })

    expect(buffer.equals(Buffer.from('png'))).toBe(true)
    expect(canvas.toBuffer).toHaveBeenCalledTimes(1)
    expect(cardRenderer.getGlyphPixels('A')).toEqual(expect.arrayContaining([[1, 0], [2, 0], [3, 0]]))
    expect(fillRect).toHaveBeenCalled()
  })
})