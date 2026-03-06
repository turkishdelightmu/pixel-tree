import { encodeCanvasToPng } from './pngEncoder'

describe('encodeCanvasToPng', () => {
  test('resolves with a PNG buffer from callback-based encoding', async () => {
    const canvas = {
      toBuffer: jest.fn((callback: (err: Error | null, result: Buffer) => void, mimeType: 'image/png') => {
        expect(mimeType).toBe('image/png')
        callback(null, Buffer.from('png'))
      }),
    }

    await expect(encodeCanvasToPng(canvas)).resolves.toEqual(Buffer.from('png'))
  })

  test('rejects when encoding fails', async () => {
    const canvas = {
      toBuffer: jest.fn((callback: (err: Error | null, result: Buffer) => void) => {
        callback(new Error('encode failed'), Buffer.alloc(0))
      }),
    }

    await expect(encodeCanvasToPng(canvas)).rejects.toThrow('encode failed')
  })
})