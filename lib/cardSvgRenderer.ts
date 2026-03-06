import { serializeTreeFragment } from './svgSerializer';
import { buildTreeLayers } from './trees';
import { TREE_METADATA } from './treeMetadata';

export interface CardSvgOptions {
  username: string;
  score: number;
  tier: number;
}

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

const MONO = "'Courier New', Courier, monospace";
const SANS = "'Helvetica Neue', Arial, sans-serif";

// ── Helpers ──────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svgText(
  x: number,
  y: number,
  content: string,
  fill: string,
  size: number,
  font: string,
  extra = '',
): string {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}"${extra}>${esc(content)}</text>`;
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

  // Animated tree inner content: pixels at scale=1, but animation distances use
  // animScale=4 so that sway/fall/drift motions are clearly visible (not 1px).
  const { styleBlock, groupsBlock } = serializeTreeFragment(layers, TREE_SCALE, 4);

  const stats = [
    { label: 'COMMITS/YEAR', value: String(options.score) },
    { label: 'TIER',         value: `${tier + 1}/6` },
    { label: 'TYPE',         value: meta.type },
  ];

  const statsBlocks = stats
    .map((stat, i) => {
      const x = INFO_X + i * (STAT_W + STAT_GAP);
      return [
        `<rect x="${x}" y="${STAT_TOP}" width="${STAT_W}" height="${STAT_H}" fill="#050a14" stroke="#1e2d50" stroke-width="1"/>`,
        svgText(x + 4, STAT_TOP + 10, stat.label, '#6a9fd8', 6.5, MONO, ' letter-spacing="0.3"'),
        svgText(x + 4, STAT_TOP + 31, stat.value, '#00ff9d', 11, MONO, ' font-weight="bold"'),
      ].join('');
    })
    .join('');

  // First-line baseline of description: statBottom(96) + gap(8) + fontSize(10) = 114
  const descBaselineY = STAT_TOP + STAT_H + 18;

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub Pixel Tree for @${esc(options.username)}">`,
    // Keyframe animations for all animated layers in the tree
    styleBlock,
    // CRT scanlines pattern
    `<defs><pattern id="sl" width="1" height="3" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="rgb(0,255,157)" fill-opacity="0.035"/></pattern></defs>`,
    // Card background
    `<rect width="${W}" height="${H}" fill="#0a0e1a"/>`,
    `<rect width="${W}" height="${H}" fill="url(#sl)"/>`,
    // Card border
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="#1e2d50" stroke-width="2"/>`,
    // Tree frame
    `<rect x="${TREE_FRAME_X}" y="${TREE_FRAME_Y}" width="${TREE_FRAME_W}" height="${TREE_FRAME_H}" fill="#050a14" stroke="#1e2d50" stroke-width="1"/>`,
    // Animated tree pixel layers
    `<g transform="translate(${TREE_X},${TREE_Y})">`,
    groupsBlock,
    `</g>`,
    // Tree name + username
    svgText(INFO_X, 22, meta.name, meta.color, 9, MONO, ' font-weight="bold" letter-spacing="0.8"'),
    svgText(INFO_X, 37, `@${options.username}`, '#6a9fd8', 9, MONO),
    // Stats blocks
    statsBlocks,
    // Description (2-line word-wrapped)
    svgWrappedText(INFO_X, descBaselineY, meta.cardDescription, '#6a9fd8', 10, SANS, 47, 2, 14),
    // Footer
    svgText(INFO_X, H - 9, 'GITHUB PIXEL TREE', '#4a6080', 6.5, MONO, ' letter-spacing="0.5"'),
    `</svg>`,
  ].join('\n');
}
