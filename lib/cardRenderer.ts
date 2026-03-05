import { createCanvas } from 'canvas';
import { drawTree } from './trees';

type CardSize = 'sm' | 'md';

interface CardRenderOptions {
  username: string;
  score: number;
  tier: number;
  size?: CardSize;
}

const TREE_NAMES = ['BARE TREE', 'SAKURA TREE', 'WILLOW TREE', 'OAK TREE', 'REDWOOD', 'CRYSTAL TREE'] as const;
const TREE_COLORS = ['#aac4d8', '#ff9ec7', '#7dd9a8', '#d4a017', '#ff6030', '#c060ff'] as const;

const SIZE_PRESETS: Record<CardSize, { width: number; height: number; treeScale: number }> = {
  sm: { width: 560, height: 180, treeScale: 2 },
  md: { width: 720, height: 220, treeScale: 2 },
};

export async function renderTreeCard(options: CardRenderOptions): Promise<Buffer> {
  const size = options.size ?? 'sm';
  const preset = SIZE_PRESETS[size];
  const tier = Math.max(0, Math.min(5, options.tier));

  const canvas = createCanvas(preset.width, preset.height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, preset.width, preset.height);

  // CRT-like scan lines for subtle texture
  ctx.fillStyle = 'rgba(0, 255, 157, 0.035)';
  for (let y = 0; y < preset.height; y += 3) {
    ctx.fillRect(0, y, preset.width, 1);
  }

  // Card border
  ctx.strokeStyle = '#1e2d50';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, preset.width - 2, preset.height - 2);

  // Tree frame
  const treeFrameX = 16;
  const treeFrameY = 16;
  const treeFrameW = 152;
  const treeFrameH = preset.height - 32;

  ctx.fillStyle = '#050a14';
  ctx.fillRect(treeFrameX, treeFrameY, treeFrameW, treeFrameH);
  ctx.strokeStyle = '#1e2d50';
  ctx.strokeRect(treeFrameX, treeFrameY, treeFrameW, treeFrameH);

  // Draw pixel tree (64x80 @ 2x = 128x160)
  const treeX = treeFrameX + 12;
  const treeY = treeFrameY + 8;
  ctx.save();
  ctx.translate(treeX, treeY);
  ctx.scale(preset.treeScale, preset.treeScale);
  drawTree(ctx, tier);
  ctx.restore();

  // Text area
  const infoX = treeFrameX + treeFrameW + 18;
  const titleColor = TREE_COLORS[tier];

  ctx.fillStyle = titleColor;
  ctx.font = "bold 20px 'Courier New', monospace";
  ctx.fillText(TREE_NAMES[tier], infoX, 40);

  ctx.fillStyle = '#6a9fd8';
  ctx.font = "16px 'Courier New', monospace";
  ctx.fillText(`@${options.username}`, infoX, 68);

  // Stats blocks
  const statTop = 88;
  const statW = 112;
  const statH = 56;
  const statGap = 12;

  const stats: Array<{ label: string; value: string }> = [
    { label: 'COMMITS/YEAR', value: options.score.toLocaleString() },
    { label: 'TIER', value: `${tier + 1} / 6` },
    { label: 'TYPE', value: TREE_NAMES[tier].replace(' TREE', '') },
  ];

  stats.forEach((stat, index) => {
    const x = infoX + index * (statW + statGap);

    ctx.fillStyle = '#050a14';
    ctx.fillRect(x, statTop, statW, statH);
    ctx.strokeStyle = '#1e2d50';
    ctx.strokeRect(x, statTop, statW, statH);

    ctx.fillStyle = '#6a9fd8';
    ctx.font = "10px 'Courier New', monospace";
    ctx.fillText(stat.label, x + 8, statTop + 18);

    ctx.fillStyle = '#00ff9d';
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillText(stat.value, x + 8, statTop + 43);
  });

  // Footer signature for readability in README
  ctx.fillStyle = '#4a6080';
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillText('github pixel tree', infoX, preset.height - 16);

  return canvas.toBuffer('image/png');
}
