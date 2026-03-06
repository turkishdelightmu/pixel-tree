import type { CanvasRenderingContext2D } from 'canvas'

export type TreeRectShape = {
  kind: 'rect'
  x: number
  y: number
  width: number
  height: number
  color: string
}

export type TreePixelShape = {
  kind: 'pixel'
  x: number
  y: number
  color: string
}

export type TreeShape = TreeRectShape | TreePixelShape

export type TreeLayer = {
  id: string
  shapes: readonly TreeShape[]
}

export function rect(x: number, y: number, width: number, height: number, color: string): TreeRectShape {
  return { kind: 'rect', x, y, width, height, color }
}

export function pixel(x: number, y: number, color: string): TreePixelShape {
  return { kind: 'pixel', x, y, color }
}

export function drawTreeLayers(ctx: CanvasRenderingContext2D, layers: readonly TreeLayer[]): void {
  for (const layer of layers) {
    for (const shape of layer.shapes) {
      ctx.fillStyle = shape.color
      if (shape.kind === 'pixel') {
        ctx.fillRect(shape.x, shape.y, 1, 1)
        continue
      }

      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
  }
}