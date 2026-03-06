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

/** CSS animation applied to an entire tree layer group in the SVG output. */
export type AnimationType = 'sway' | 'float' | 'twinkle' | 'fall' | 'drift' | 'pulse'

export type AnimationSpec = {
  type: AnimationType
  /** Duration in seconds (defaults vary per type). */
  duration?: number
  /** Delay in seconds before the animation starts. */
  delay?: number
}

export type TreeLayer = {
  id: string
  shapes: readonly TreeShape[]
  /** When present, this layer will be animated in the SVG serializer. */
  animation?: AnimationSpec
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