import type { CanvasRenderingContext2D } from 'canvas'

export function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  if (!color || color === 'T') return
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

export function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}