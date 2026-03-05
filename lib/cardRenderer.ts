import { createCanvas } from 'canvas';
import type { CanvasRenderingContext2D } from 'canvas';
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
  // README-optimized compact card.
  sm: { width: 420, height: 152, treeScale: 1 },
  // Rich preview card used by explicit size=md.
  md: { width: 760, height: 232, treeScale: 2 },
};

// 5x7 pixel font so README card text is deterministic on any server runtime.
const GLYPHS: Record<string, string[]> = {
  'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  'C': ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  'G': ['01111', '10000', '10000', '10011', '10001', '10001', '01110'],
  'H': ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  'I': ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  'J': ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  'M': ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  'Q': ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  'R': ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  'S': ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  'V': ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  'W': ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  'X': ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  'Z': ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  '@': ['01110', '10001', '10111', '10101', '10111', '10000', '01111'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  ',': ['00000', '00000', '00000', '00000', '00110', '00100', '01000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 2,
  letterGap = 1,
): void {
  const up = text.toUpperCase();
  ctx.fillStyle = color;

  let cx = x;
  for (const ch of up) {
    const glyph = GLYPHS[ch] ?? GLYPHS[' '];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') {
          ctx.fillRect(cx + col * scale, y + row * scale, scale, scale);
        }
      }
    }
    cx += 5 * scale + letterGap;
  }
}

export async function renderTreeCard(options: CardRenderOptions): Promise<Buffer> {
  const size = options.size ?? 'sm';
  const preset = SIZE_PRESETS[size];
  const tier = Math.max(0, Math.min(5, options.tier));
  const isCompact = size === 'sm';

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
  const treeFrameX = isCompact ? 10 : 16;
  const treeFrameY = isCompact ? 10 : 16;
  const treeFrameW = isCompact ? 96 : 160;
  const treeFrameH = preset.height - (isCompact ? 20 : 32);

  ctx.fillStyle = '#050a14';
  ctx.fillRect(treeFrameX, treeFrameY, treeFrameW, treeFrameH);
  ctx.strokeStyle = '#1e2d50';
  ctx.strokeRect(treeFrameX, treeFrameY, treeFrameW, treeFrameH);

  // Draw pixel tree (64x80 @ scale)
  const scaledTreeW = 64 * preset.treeScale;
  const scaledTreeH = 80 * preset.treeScale;
  const treeX = treeFrameX + Math.floor((treeFrameW - scaledTreeW) / 2);
  const treeY = treeFrameY + Math.floor((treeFrameH - scaledTreeH) / 2);
  ctx.save();
  ctx.translate(treeX, treeY);
  ctx.scale(preset.treeScale, preset.treeScale);
  drawTree(ctx, tier);
  ctx.restore();

  // Text area
  const infoX = treeFrameX + treeFrameW + (isCompact ? 10 : 16);
  const titleColor = TREE_COLORS[tier];

  drawPixelText(ctx, TREE_NAMES[tier], infoX, isCompact ? 16 : 26, titleColor, isCompact ? 1 : 2, isCompact ? 1 : 2);
  drawPixelText(ctx, `@${options.username}`, infoX, isCompact ? 30 : 54, '#6a9fd8', isCompact ? 1 : 2, 1);

  // Stats blocks
  const statTop = isCompact ? 52 : 86;
  const statGap = isCompact ? 8 : 12;
  const rightPadding = isCompact ? 14 : 24;
  const availableStatsWidth = preset.width - infoX - rightPadding;
  const statW = Math.floor((availableStatsWidth - 2 * statGap) / 3);
  const statH = isCompact ? 44 : 58;

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

    drawPixelText(ctx, stat.label, x + 6, statTop + 6, '#6a9fd8', 1, 1);
    drawPixelText(ctx, stat.value, x + 6, statTop + (isCompact ? 22 : 26), '#00ff9d', isCompact ? 1 : 2, 1);
  });

  // Footer signature for readability in README
  drawPixelText(ctx, 'GITHUB PIXEL TREE', infoX, preset.height - (isCompact ? 14 : 22), '#4a6080', 1, 1);

  return canvas.toBuffer('image/png');
}
