import type { CanvasRenderingContext2D } from 'canvas';
import { drawBareTree, buildBareLayers } from './bareTree';
import { drawSakuraTree, buildSakuraLayers } from './sakuraTree';
import { drawWillowTree, buildWillowLayers } from './willowTree';
import { drawOakTree, buildOakLayers } from './oakTree';
import { drawRedwoodTree, buildRedwoodLayers } from './redwoodTree';
import { drawCrystalTree, buildCrystalLayers } from './crystalTree';
import type { TreeLayer } from './layers';

type DrawFn = (ctx: CanvasRenderingContext2D) => void;
type LayerBuilderFn = () => TreeLayer[];

const treeDrawers: DrawFn[] = [
  drawBareTree,    // tier 0 — 0–49 contributions
  drawSakuraTree,  // tier 1 — 50–199
  drawWillowTree,  // tier 2 — 200–499
  drawOakTree,     // tier 3 — 500–999
  drawRedwoodTree, // tier 4 — 1000–1999
  drawCrystalTree, // tier 5 — 2000+
];

const layerBuilders: LayerBuilderFn[] = [
  buildBareLayers,
  buildSakuraLayers,
  buildWillowLayers,
  buildOakLayers,
  buildRedwoodLayers,
  buildCrystalLayers,
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

export function buildTreeLayers(tier: number): TreeLayer[] {
  if (!isValidTreeTier(tier)) {
    throw new Error(`Invalid tree tier ${tier}. Expected an integer between 0 and ${MAX_TREE_TIER}.`);
  }

  return layerBuilders[tier]();
}
