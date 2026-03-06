import { createCanvas } from 'canvas';
import { drawTree, isValidTreeTier, MAX_TREE_TIER } from './trees/index';
import { encodeCanvasToPng } from './pngEncoder';

const BASE_W = 64;
const BASE_H = 80;

export async function renderTree(tier: number, scale = 4): Promise<Buffer> {
  if (!isValidTreeTier(tier)) {
    throw new Error(`Invalid tree tier ${tier}. Expected an integer between 0 and ${MAX_TREE_TIER}.`);
  }

  const w = BASE_W * scale;
  const h = BASE_H * scale;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Scale up so pixel-art coordinates map 1-pixel → scale×scale block
  ctx.save();
  ctx.scale(scale, scale);
  drawTree(ctx, tier);
  ctx.restore();

  return encodeCanvasToPng(canvas);
}
