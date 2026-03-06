import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildSakuraLayers(): TreeLayer[] {
  const Tk = '#3d1f14', Tkm = '#4f2b1a', Tkl = '#6a3d28', Tkh = '#7e5040';
  const B0 = '#f8a0c0', B1 = '#f4b8d0', B2 = '#fcd0e4', B3 = '#fff0f8';
  const Bd = '#d870a0', Bds = '#e888b8';

  const ground: TreeShape[] = [
    rect(16, 76, 32, 3, '#d4c0c8'),
    rect(20, 75, 24, 2, '#c4b0b8'),
  ];

  const trunk: TreeShape[] = [
    rect(28, 58, 8, 18, Tk),
    rect(29, 56, 7, 20, Tkm),
    rect(30, 55, 5, 22, Tkl),
    rect(31, 56, 3, 20, Tkm),
    pixel(30, 60, Tk), pixel(30, 65, Tk), pixel(30, 70, Tk),
    pixel(33, 62, Tkh), pixel(33, 68, Tkh),
    pixel(35, 60, '#8a6050'), pixel(35, 66, '#8a6050'),
    rect(22, 72, 8, 5, Tkm), rect(34, 72, 8, 5, Tkm),
    rect(20, 74, 4, 3, Tk), rect(40, 74, 4, 3, Tk),
    rect(26, 73, 4, 2, Tkl), rect(34, 73, 4, 2, Tkl),
    rect(18, 46, 12, 4, Tkm), rect(16, 42, 8, 3, Tkl),
    rect(14, 38, 6, 2, Tkm), rect(12, 34, 5, 2, Tk),
    rect(34, 44, 12, 4, Tkm), rect(40, 40, 8, 3, Tkl),
    rect(44, 36, 6, 2, Tkm), rect(46, 32, 5, 2, Tk),
    rect(30, 42, 4, 4, Tkm), rect(29, 36, 3, 8, Tkl),
  ];

  const blossomShadow: TreeShape[] = [];
  const blossomBase: [number, number, number, number][] = [
    [8, 28, 16, 10], [28, 22, 16, 10], [10, 20, 14, 10],
    [24, 14, 18, 12], [14, 12, 16, 10], [32, 10, 14, 10],
    [6, 18, 12, 12], [38, 16, 12, 12],
  ];
  for (const [x, y, w, h] of blossomBase) blossomShadow.push(rect(x, y, w, h, Bd));
  for (let x = 8; x <= 48; x += 1) {
    if (x % 3 === 0) blossomShadow.push(pixel(x, 28, Bds));
  }

  const blossomMid: TreeShape[] = [];
  const blossomMidRects: [number, number, number, number][] = [
    [10, 26, 20, 10], [26, 20, 20, 10], [8, 16, 18, 10],
    [26, 12, 18, 12], [12, 8, 16, 10], [30, 8, 16, 12],
    [4, 20, 10, 10], [42, 14, 10, 10], [16, 4, 28, 10],
  ];
  const blossomLightRects: [number, number, number, number][] = [
    [12, 24, 16, 8], [28, 18, 16, 8], [10, 14, 16, 8],
    [26, 10, 18, 10], [16, 6, 22, 8], [14, 2, 24, 8],
    [6, 22, 8, 8], [42, 16, 8, 8],
  ];
  const blossomHiRects: [number, number, number, number][] = [
    [14, 22, 10, 6], [28, 16, 12, 6], [12, 12, 12, 6],
    [26, 8, 14, 8], [18, 4, 18, 6], [20, 2, 16, 4],
    [8, 24, 6, 4], [44, 18, 6, 4],
  ];
  const blossomSpotRects: [number, number, number, number][] = [
    [16, 20, 4, 3], [30, 14, 4, 3], [22, 6, 4, 3], [36, 10, 4, 3],
    [18, 2, 4, 2], [10, 26, 3, 2], [46, 18, 3, 2],
  ];
  for (const [x, y, w, h] of blossomMidRects) blossomMid.push(rect(x, y, w, h, B0));
  for (const [x, y, w, h] of blossomLightRects) blossomMid.push(rect(x, y, w, h, B1));
  for (const [x, y, w, h] of blossomHiRects) blossomMid.push(rect(x, y, w, h, B2));
  for (const [x, y, w, h] of blossomSpotRects) blossomMid.push(rect(x, y, w, h, B3));

  const petals: TreeShape[] = [];
  const petalRects: [number, number, number][] = [
    [4, 36, 2], [2, 42, 2], [0, 50, 2], [6, 46, 2], [2, 56, 2],
    [54, 40, 2], [58, 32, 2], [60, 44, 2], [56, 52, 2], [60, 60, 2],
    [10, 60, 2], [6, 64, 2], [50, 62, 2], [48, 68, 2], [14, 68, 2],
    [52, 56, 2], [4, 62, 2], [58, 68, 2],
  ];
  for (const [x, y, size] of petalRects) {
    petals.push(rect(x, y, size, size, B1), pixel(x, y, B2));
  }

  return [
    { id: 'ground', shapes: ground },
    { id: 'trunk', shapes: trunk },
    { id: 'canopy-shadow', shapes: blossomShadow },
    { id: 'canopy-highlight', shapes: blossomMid },
    { id: 'petals', shapes: petals },
  ];
}

export function drawSakuraTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildSakuraLayers());
}
