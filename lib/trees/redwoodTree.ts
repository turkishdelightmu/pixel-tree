import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildRedwoodLayers(): TreeLayer[] {
  const Tk = '#3a1005', Tkm = '#521808', Tkl = '#6e2810', Tkh = '#8a4020', Tkhi = '#a85830';
  const L0 = '#0c3010', L1 = '#124018', L2 = '#1a5020', L3 = '#246028', L4 = '#2e7230', L5 = '#3a8840', L6 = '#4aa050';
  const Moss = '#2a4818';

  const ground: TreeShape[] = [
    rect(8, 76, 48, 3, '#0e1c08'), rect(10, 75, 44, 2, '#162410'),
  ];
  for (let x = 10; x < 54; x += 3) ground.push(pixel(x, 74, L0));

  const trunk: TreeShape[] = [
    rect(24, 60, 16, 16, Tk), rect(25, 44, 14, 18, Tk),
    rect(26, 28, 12, 18, Tkm), rect(27, 14, 10, 16, Tkm), rect(28, 4, 8, 12, Tkl),
    rect(25, 60, 14, 16, Tkm), rect(26, 44, 12, 18, Tkl),
    rect(27, 28, 10, 18, Tkl), rect(28, 14, 8, 16, Tkh), rect(29, 4, 6, 12, Tkh),
    rect(25, 44, 3, 32, Tkh), rect(26, 28, 2, 18, Tkhi), rect(27, 14, 2, 16, Tkhi),
    rect(16, 68, 10, 8, Tkm), rect(38, 68, 10, 8, Tkm),
    rect(12, 70, 6, 6, Tk),   rect(46, 70, 6, 6, Tk),
    rect(10, 72, 5, 4, Tk),   rect(49, 72, 5, 4, Tk),
    rect(18, 72, 6, 4, Tkl),  rect(40, 72, 6, 4, Tkl),
  ];
  for (let y = 8; y < 74; y += 2) {
    trunk.push(pixel(28, y, Tk), pixel(31, y, Tkm), pixel(34, y, Tk), pixel(37, y, Tkm));
  }
  for (let y = 10; y < 72; y += 4) {
    trunk.push(pixel(26, y, Tkm), pixel(33, y + 1, Tkl), pixel(36, y, Tkm));
  }
  for (const [x, y] of [[25,62],[25,66],[25,70],[26,64],[36,63],[37,68],[36,72]] as [number,number][]) {
    trunk.push(pixel(x, y, Moss), pixel(x + 1, y, Moss));
  }

  const branches: TreeShape[] = [
    rect(8, 58, 18, 3, Tkm), rect(8, 57, 14, 2, Tkl),
    rect(2, 52, 14, 10, L0), rect(4, 50, 12, 10, L1), rect(6, 50, 10, 8, L2), rect(4, 54, 6, 6, L3),
    pixel(6, 50, L4), pixel(8, 49, L4), pixel(3, 53, L3),
    rect(38, 58, 18, 3, Tkm), rect(42, 57, 14, 2, Tkl),
    rect(48, 52, 14, 10, L0), rect(48, 50, 12, 10, L1), rect(48, 50, 10, 8, L2), rect(54, 54, 6, 6, L3),
    pixel(56, 50, L4), pixel(54, 49, L4), pixel(59, 53, L3),
    rect(10, 44, 16, 3, Tkm), rect(10, 43, 12, 2, Tkl),
    rect(4, 38, 14, 9, L1), rect(6, 36, 12, 9, L2), rect(8, 36, 8, 7, L3), rect(6, 40, 6, 5, L4),
    pixel(7, 35, L5), pixel(10, 34, L4),
    rect(38, 44, 16, 3, Tkm), rect(42, 43, 12, 2, Tkl),
    rect(46, 38, 14, 9, L1), rect(46, 36, 12, 9, L2), rect(48, 36, 8, 7, L3), rect(52, 40, 6, 5, L4),
    pixel(56, 35, L5), pixel(53, 34, L4),
    rect(12, 30, 14, 3, Tkm), rect(12, 29, 10, 2, Tkl),
    rect(6, 24, 12, 8, L1), rect(8, 22, 10, 8, L2), rect(10, 22, 7, 6, L3),
    pixel(9, 21, L4), pixel(12, 20, L5),
    rect(38, 30, 14, 3, Tkm), rect(42, 29, 10, 2, Tkl),
    rect(46, 24, 12, 8, L1), rect(46, 22, 10, 8, L2), rect(47, 22, 7, 6, L3),
    pixel(54, 21, L4), pixel(51, 20, L5),
    rect(14, 18, 12, 2, Tkm), rect(14, 17, 8, 2, Tkl),
    rect(8, 12, 12, 8, L2), rect(10, 10, 10, 8, L3), rect(12, 10, 6, 6, L4),
    pixel(11, 9, L5), pixel(13, 8, L5),
    rect(38, 18, 12, 2, Tkm), rect(44, 17, 8, 2, Tkl),
    rect(44, 12, 12, 8, L2), rect(44, 10, 10, 8, L3), rect(46, 10, 6, 6, L4),
    pixel(52, 9, L5), pixel(50, 8, L5),
    rect(16, 8, 10, 2, Tkl), rect(38, 8, 10, 2, Tkl),
    rect(12, 4, 10, 6, L3), rect(14, 2, 8, 6, L4),
    rect(42, 4, 10, 6, L3), rect(44, 2, 8, 6, L4),
    rect(16, 2, 6, 4, L5), rect(42, 2, 6, 4, L5),
  ];

  const crown: TreeShape[] = [
    rect(26, 0, 12, 6, L3), rect(28, 0, 8, 5, L4), rect(29, 0, 6, 4, L5),
    pixel(30, 0, L6), pixel(32, 0, L6), pixel(31, 0, L6),
  ];

  return [
    { id: 'ground',   shapes: ground },
    { id: 'trunk',    shapes: trunk },
    { id: 'branches', shapes: branches },
    { id: 'crown',    shapes: crown, animation: { type: 'pulse', duration: 6 } },
  ];
}

export function drawRedwoodTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildRedwoodLayers());
}
