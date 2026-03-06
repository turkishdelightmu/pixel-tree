import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildCrystalLayers(): TreeLayer[] {
  const Tk = '#200840', Tkm = '#300c58', Tkl = '#481070', Tkh = '#6818a0';
  const C0 = '#300858', C1 = '#481080', C2 = '#6020b0', C3 = '#8030d8', C4 = '#a040ff', C5 = '#c060ff', C6 = '#e090ff';
  const CW = '#fff0ff', CG = '#40ff80', CA = '#ff80ff';

  const ground: TreeShape[] = [
    rect(14, 76, 36, 3, '#180830'),
    rect(16, 75, 32, 2, '#2c0a50'),
  ];
  for (let x = 14; x < 50; x += 3) {
    ground.push(pixel(x, 74, C2), pixel(x + 1, 74, C1));
  }

  const trunk: TreeShape[] = [
    rect(28, 42, 8, 34, Tk),
    rect(29, 40, 6, 36, Tkm),
    rect(30, 38, 5, 38, Tkl),
    rect(31, 40, 3, 34, Tkm),
    rect(30, 42, 2, 32, Tkh),
  ];
  for (let y = 42; y < 72; y += 6) {
    trunk.push(rect(30, y, 2, 2, C2), rect(33, y + 3, 2, 2, C1));
  }

  const roots: TreeShape[] = [
    rect(20, 66, 10, 10, Tkm), rect(34, 66, 10, 10, Tkm),
    rect(16, 68, 6, 8, Tk), rect(42, 68, 6, 8, Tk),
    rect(22, 62, 4, 6, C2), rect(38, 62, 4, 6, C2),
    rect(18, 64, 3, 4, C1), rect(43, 64, 3, 4, C1),
    pixel(23, 60, C3), pixel(39, 60, C3),
  ];

  const canopy: TreeShape[] = [
    rect(6, 28, 52, 18, C0), rect(8, 22, 48, 14, C1), rect(12, 16, 40, 12, C2),
    rect(16, 10, 32, 10, C2), rect(18, 6, 28, 8, C3), rect(20, 2, 24, 6, C3), rect(22, 0, 20, 4, C4),
    rect(10, 26, 44, 14, C1), rect(14, 20, 36, 10, C2), rect(18, 14, 28, 8, C3),
    rect(20, 8, 24, 6, C4), rect(22, 4, 20, 4, C4), rect(24, 0, 16, 4, C5),
    rect(18, 24, 12, 8, C3), rect(34, 22, 12, 8, C3), rect(22, 16, 16, 8, C4),
    rect(26, 10, 12, 6, C5), rect(28, 4, 8, 6, C6), rect(30, 0, 4, 4, CW),
    rect(29, 0, 6, 2, C6), rect(30, 0, 4, 1, CW),
    rect(14, 10, 6, 8, C3), rect(16, 8, 4, 4, C4), rect(17, 6, 2, 3, C5),
    rect(44, 8, 6, 8, C3), rect(46, 6, 4, 4, C4), rect(47, 4, 2, 3, C5),
    rect(8, 18, 4, 6, C2), rect(9, 16, 2, 3, C3), rect(52, 16, 4, 6, C2), rect(53, 14, 2, 3, C3),
    rect(24, 20, 6, 4, C4), rect(34, 18, 6, 4, C4), rect(28, 14, 8, 4, C5), rect(30, 8, 4, 4, C6),
    rect(30, 6, 4, 2, CW), pixel(31, 5, CW), pixel(32, 5, CW),
  ];

  const particles: TreeShape[] = [];
  const particleDefs: [number, number, string][] = [
    [2, 20, C3], [4, 14, C4], [2, 32, C2], [0, 40, C2], [4, 48, C3],
    [58, 18, C3], [60, 26, C4], [62, 34, C2], [60, 44, C3], [58, 54, C2],
    [6, 56, C2], [8, 60, C3], [50, 58, C2], [56, 62, C3],
    [10, 6, C4], [52, 4, C4], [10, 12, CA], [52, 10, CA],
  ];
  for (const [x, y, color] of particleDefs) {
    if (x >= 0 && x < 64 && y >= 0 && y < 80) {
      particles.push(pixel(x, y, color), pixel(x + 1, y, color), pixel(x, y + 1, color));
    }
  }

  const sparkles: TreeShape[] = [];
  const sparkleDefs: [number, number, string][] = [[26, 26, CG], [38, 20, CG], [30, 12, CG], [20, 30, CA], [44, 28, CA]];
  for (const [x, y, color] of sparkleDefs) sparkles.push(pixel(x, y, color));

  return [
    { id: 'ground', shapes: ground },
    { id: 'trunk', shapes: trunk },
    { id: 'roots', shapes: roots },
    { id: 'canopy', shapes: canopy },
    { id: 'particles', shapes: particles },
    { id: 'sparkles', shapes: sparkles },
  ];
}

export function drawCrystalTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildCrystalLayers());
}
