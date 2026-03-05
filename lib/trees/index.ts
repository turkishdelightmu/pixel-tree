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

export function drawTree(ctx: CanvasRenderingContext2D, tier: number): void {
  const draw = treeDrawers[tier];
  if (!draw) throw new Error(`No tree drawer for tier ${tier}`);
  draw(ctx);
}
