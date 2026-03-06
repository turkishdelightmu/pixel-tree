type CanvasLike = {
  toBuffer(callback: (err: Error | null | undefined, result: Buffer) => void, mimeType: 'image/png'): void
}

export function encodeCanvasToPng(canvas: CanvasLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    canvas.toBuffer((err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    }, 'image/png')
  })
}