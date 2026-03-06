import type { CanvasRenderingContext2D } from 'canvas';
import { drawBareTree } from './bareTree';
import { drawSakuraTree } from './sakuraTree';
import { drawWillowTree } from './willowTree';
import { drawOakTree } from './oakTree';
import { drawRedwoodTree } from './redwoodTree';
import { drawCrystalTree } from './crystalTree';

type DrawFn = (ctx: CanvasRenderingContext2D) => void;

const treeDrawers: DrawFn[] = [
  drawBareTree,    // tier 0 — 0–49 contributions
  drawSakuraTree,  // tier 1 — 50–199
  drawWillowTree,  // tier 2 — 200–499
  drawOakTree,     // tier 3 — 500–999
  drawRedwoodTree, // tier 4 — 1000–1999
  drawCrystalTree, // tier 5 — 2000+
];

export const MAX_TREE_TIER = treeDrawers.length - 1;

export function isValidTreeTier(tier: number): boolean {
  return Number.isInteger(tier) && tier >= 0 && tier <= MAX_TREE_TIER;
}

export function drawTree(ctx: CanvasRenderingContext2D, tier: number): void {
  if (!isValidTreeTier(tier)) {
    throw new Error(`Invalid tree tier ${tier}. Expected an integer between 0 and ${MAX_TREE_TIER}.`);
  }

  const draw = treeDrawers[tier];
  draw(ctx);
}
