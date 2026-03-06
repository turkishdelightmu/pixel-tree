import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildWillowLayers(): TreeLayer[] {
  const Tk = '#3a2c0e', Tkm = '#4e3c18', Tkl = '#6a5228', Tkh = '#8a6e3c';
  const L0 = '#1a6e30', L1 = '#228040', L2 = '#2c9850', L3 = '#38b060', L4 = '#52c870', L5 = '#6edd88';

  const ground: TreeShape[] = [
    rect(14, 75, 36, 4, '#1a3010'),
    rect(16, 74, 32, 2, '#243818'),
  ];

  const trunk: TreeShape[] = [
    rect(28, 40, 8, 36, Tk),
    rect(29, 38, 6, 38, Tkm),
    rect(30, 36, 5, 40, Tkl),
    rect(31, 38, 3, 36, Tkm),
    rect(22, 70, 8, 6, Tkm), rect(34, 70, 8, 6, Tkm),
    rect(20, 72, 4, 4, Tk), rect(40, 72, 4, 4, Tk),
  ];
  for (let y = 40; y < 74; y += 5) {
    trunk.push(pixel(30, y, Tk), pixel(33, y + 2, Tkh), pixel(35, y + 1, Tkm));
  }

  const canopy: TreeShape[] = [
    rect(18, 6, 28, 8, L1),
    rect(12, 10, 40, 8, L1),
    rect(8, 14, 48, 8, L1),
    rect(6, 18, 52, 8, L2),
    rect(8, 22, 48, 8, L2),
    rect(12, 26, 40, 6, L1),
    rect(18, 28, 28, 6, L0),
    rect(22, 4, 20, 6, L2),
    rect(26, 2, 12, 4, L3),
    rect(14, 8, 12, 6, L3), rect(38, 8, 12, 6, L3),
    rect(10, 12, 8, 4, L3), rect(46, 12, 8, 4, L3),
    rect(28, 0, 8, 4, L4), rect(24, 2, 4, 2, L4), rect(34, 2, 4, 2, L4),
    pixel(30, 0, L5), pixel(32, 0, L5),
  ];

  const strands: TreeShape[] = [];
  const strandTips: TreeShape[] = [];
  const strandDefs: { x: number; y: number; dx: number; len: number; col: string[] }[] = [
    { x: 8, y: 24, dx: -1, len: 30, col: [L0, L1, L2, L1] },
    { x: 12, y: 26, dx: -1, len: 32, col: [L1, L2, L3, L2] },
    { x: 16, y: 28, dx: 0, len: 28, col: [L0, L1, L2, L1] },
    { x: 20, y: 30, dx: 0, len: 34, col: [L1, L2, L3, L2] },
    { x: 24, y: 32, dx: 0, len: 30, col: [L2, L3, L4, L3] },
    { x: 28, y: 34, dx: 0, len: 36, col: [L1, L2, L3, L2] },
    { x: 32, y: 34, dx: 0, len: 36, col: [L2, L3, L4, L3] },
    { x: 36, y: 32, dx: 0, len: 32, col: [L1, L2, L3, L2] },
    { x: 40, y: 30, dx: 0, len: 28, col: [L0, L1, L2, L1] },
    { x: 44, y: 28, dx: 1, len: 30, col: [L1, L2, L3, L2] },
    { x: 48, y: 26, dx: 1, len: 28, col: [L0, L1, L2, L1] },
    { x: 52, y: 24, dx: 1, len: 26, col: [L1, L2, L3, L2] },
    { x: 10, y: 20, dx: -1, len: 22, col: [L0, L1, L1, L0] },
    { x: 54, y: 20, dx: 1, len: 22, col: [L0, L1, L1, L0] },
  ];

  for (const strand of strandDefs) {
    for (let index = 0; index < strand.len; index += 1) {
      const x = strand.x + Math.floor(strand.dx * index * 0.4);
      const color = strand.col[Math.floor((index / strand.len) * 4) % 4];
      if (x >= 0 && x < 64) {
        strands.push(pixel(x, strand.y + index, color));
        if (index % 2 === 0 && x + 1 < 64) {
          strands.push(pixel(x + 1, strand.y + index, color));
        }
      }
    }

    const endX = strand.x + Math.floor(strand.dx * strand.len * 0.4);
    if (endX >= 0 && endX < 64) {
      strandTips.push(pixel(endX, strand.y + strand.len, L3), pixel(endX, strand.y + strand.len - 1, L4));
    }
  }

  return [
    { id: 'ground', shapes: ground },
    { id: 'trunk', shapes: trunk },
    { id: 'canopy', shapes: canopy },
    { id: 'strands', shapes: strands },
    { id: 'strand-tips', shapes: strandTips },
  ];
}

export function drawWillowTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildWillowLayers());
}
