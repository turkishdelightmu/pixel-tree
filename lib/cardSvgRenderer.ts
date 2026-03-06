import { getGlyphPixels } from './cardRenderer';
import { serializeTreeFragment } from './svgSerializer';
import { buildTreeLayers } from './trees';
import { TREE_METADATA } from './treeMetadata';

export type CardTheme = 'dark' | 'light';

export interface CardSvgOptions {
  username: string;
  score: number;
  tier: number;
  theme?: CardTheme;
}

interface CardPalette {
  bg: string;
  scanlineOpacity: string;
  border: string;
  frameFill: string;
  label: string;
  value: string;
  footer: string;
}

const DARK_PALETTE: CardPalette = {
  bg:              '#0a0e1a',
  scanlineOpacity: '0.035',
  border:          '#1e2d50',
  frameFill:       '#050a14',
  label:           '#6a9fd8',
  value:           '#00ff9d',
  footer:          '#4a6080',
};

const LIGHT_PALETTE: CardPalette = {
  bg:              '#ffffff',
  scanlineOpacity: '0',
  border:          '#d0d7de',
  frameFill:       '#f6f8fa',
  label:           '#57606a',
  value:           '#059669',
  footer:          '#8c959f',
};

// ── Layout constants ─────────────────────────────────────────────────────────
// Matches the sm preset in cardRenderer.ts (420×152, treeScale=1) so the
// animated SVG card is visually consistent with the PNG version.

const W = 420;
const H = 152;
const TREE_SCALE = 1;

const TREE_FRAME_X = 10;
const TREE_FRAME_Y = 10;
const TREE_FRAME_W = 96;
const TREE_FRAME_H = H - 20; // 132

const TREE_CANVAS_W = 64 * TREE_SCALE; // 64
const TREE_CANVAS_H = 80 * TREE_SCALE; // 80

// Centre the 64×80 tree inside the 96×132 frame
const TREE_X = TREE_FRAME_X + Math.floor((TREE_FRAME_W - TREE_CANVAS_W) / 2); // 26
const TREE_Y = TREE_FRAME_Y + Math.floor((TREE_FRAME_H - TREE_CANVAS_H) / 2); // 36

const INFO_X = TREE_FRAME_X + TREE_FRAME_W + 10; // 116
const RIGHT_PAD = 14;

const STAT_TOP = 52;
const STAT_GAP = 8;
const STAT_H = 44;
const STAT_W = Math.floor((W - INFO_X - RIGHT_PAD - 2 * STAT_GAP) / 3); // 91

const SANS = "'Helvetica Neue', Arial, sans-serif";

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svgPixelText(
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
  letterGap = 1,
): string {
  const chars = text.toUpperCase();
  const rects: string[] = [];

  let cursorX = x;
  for (const char of chars) {
    for (const [pixelX, pixelY] of getGlyphPixels(char)) {
      rects.push(
        `<rect x="${cursorX + pixelX * scale}" y="${y + pixelY * scale}" width="${scale}" height="${scale}" fill="${color}"/>`,
      );
    }

    cursorX += 5 * scale + letterGap;
  }

  return rects.join('');
}

function svgWrappedText(
  x: number,
  y: number,
  text: string,
  fill: string,
  size: number,
  font: string,
  maxChars: number,
  maxLines: number,
  lineH: number,
): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';

  for (const word of words) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (candidate.length <= maxChars) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      cur = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);

  const tspans = lines
    .slice(0, maxLines)
    .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineH}">${esc(line)}</tspan>`)
    .join('');

  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}">${tspans}</text>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Renders a pixel-tree card as a self-contained animated SVG.
 *
 * Layout mirrors renderTreeCard (sm preset) so the visual footprint is
 * identical to the PNG embed while all tree layers animate in <img> tags.
 *
 * Usage in README:
 *   ![My Tree](https://pixel-tree.vercel.app/api/tree?user=USERNAME&view=card&format=svg)
 */
export function renderTreeCardSVG(options: CardSvgOptions): string {
  const tier = Math.max(0, Math.min(5, options.tier));
  const meta = TREE_METADATA[tier];
  const layers = buildTreeLayers(tier);
  const p = options.theme === 'light' ? LIGHT_PALETTE : DARK_PALETTE;

  // Animated tree inner content: pixels at scale=1, but animation distances use
  // animScale=4 so that sway/fall/drift motions are clearly visible (not 1px).
  const { styleBlock, groupsBlock } = serializeTreeFragment(layers, TREE_SCALE, 4);

  const stats = [
    { label: 'COMMITS/YEAR', value: options.score.toLocaleString() },
    { label: 'TIER',         value: `${tier + 1} / 6` },
    { label: 'TYPE',         value: meta.type },
  ];

  const statsBlocks = stats
    .map((stat, i) => {
      const x = INFO_X + i * (STAT_W + STAT_GAP);
      return [
        `<rect x="${x}" y="${STAT_TOP}" width="${STAT_W}" height="${STAT_H}" fill="${p.frameFill}" stroke="${p.border}" stroke-width="1"/>`,
        svgPixelText(stat.label, x + 6, STAT_TOP + 6, p.label, 1, 1),
        svgPixelText(stat.value, x + 6, STAT_TOP + 22, p.value, 1, 1),
      ].join('');
    })
    .join('');

  const descY = STAT_TOP + STAT_H + 16;

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub Pixel Tree for @${esc(options.username)}">`,
    // Keyframe animations for all animated layers in the tree
    styleBlock,
    // CRT scanlines pattern
    `<defs><pattern id="sl" width="1" height="3" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="rgb(0,255,157)" fill-opacity="${p.scanlineOpacity}"/></pattern></defs>`,
    // Card background
    `<rect width="${W}" height="${H}" fill="${p.bg}"/>`,
    `<rect width="${W}" height="${H}" fill="url(#sl)"/>`,
    // Card border
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${p.border}" stroke-width="2"/>`,
    // Tree frame
    `<rect x="${TREE_FRAME_X}" y="${TREE_FRAME_Y}" width="${TREE_FRAME_W}" height="${TREE_FRAME_H}" fill="${p.frameFill}" stroke="${p.border}" stroke-width="1"/>`,
    // Animated tree pixel layers
    `<g transform="translate(${TREE_X},${TREE_Y})">`,
    groupsBlock,
    `</g>`,
    // Tree name + username
    svgPixelText(meta.name, INFO_X, 16, meta.color, 2, 2),
    svgPixelText(`@${options.username}`, INFO_X, 37, p.label, 1, 1),
    // Stats blocks
    statsBlocks,
    // Description (2-line word-wrapped)
    svgWrappedText(INFO_X, descY, meta.cardDescription, p.label, 10, SANS, 47, 2, 11),
    // Footer
    svgPixelText('GITHUB PIXEL TREE', INFO_X, H - 14, p.footer, 1, 1),
    `</svg>`,
  ].join('\n');
}
