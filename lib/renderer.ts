import { createCanvas } from 'canvas';
import { drawTree } from './trees/index';

const BASE_W = 64;
const BASE_H = 80;
const BG_COLOR = '#0a0e1a';

export async function renderTree(tier: number, scale = 4): Promise<Buffer> {
  const w = BASE_W * scale;
  const h = BASE_H * scale;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, w, h);

  // Scale up so pixel-art coordinates map 1-pixel → scale×scale block
  ctx.save();
  ctx.scale(scale, scale);
  drawTree(ctx, tier);
  ctx.restore();

  return canvas.toBuffer('image/png');
}
