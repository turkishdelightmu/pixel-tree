import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildBareLayers(): TreeLayer[] {
  const T = '#4a3828', Tm = '#3a2a1c', Td = '#2c1e12';
  const S = '#b8ccd8', Sl = '#d4e4f0';
  const G = '#283848', Gd = '#1c2c3c';

  const ground: TreeShape[] = [
    rect(14, 74, 36, 4, Gd), rect(18, 73, 28, 2, G),
    rect(12, 72, 40, 2, Sl), rect(14, 71, 36, 1, S),
  ];
  for (let x = 12; x < 52; x += 4) {
    ground.push(pixel(x, 70, S), pixel(x + 1, 70, Sl));
  }

  const trunk: TreeShape[] = [
    rect(28, 55, 8, 20, T), rect(29, 55, 6, 18, Tm), rect(30, 56, 4, 16, '#4e3c2a'),
    rect(29, 45, 6, 12, T), rect(30, 45, 4, 10, Tm),
    rect(29, 36, 5, 10, '#5a4030'), rect(30, 36, 3, 8, Tm),
    pixel(30, 58, Td), pixel(30, 62, Td), pixel(30, 66, Td),
    pixel(32, 60, Td), pixel(32, 64, Td),
    pixel(34, 59, Td), pixel(34, 63, Td),
    rect(24, 70, 6, 4, '#3a2c1c'), rect(34, 70, 6, 4, '#3a2c1c'),
    rect(22, 72, 4, 2, Td), rect(38, 72, 4, 2, Td),
  ];

  const branches: TreeShape[] = [
    rect(16, 38, 14, 3, T), rect(14, 35, 5, 4, '#5a4030'), rect(16, 36, 4, 2, Tm),
    rect(10, 28, 8, 2, '#5a4030'), rect(8, 24, 5, 2, Tm), rect(6, 20, 4, 2, Tm),
    rect(14, 24, 6, 2, '#5a4030'), rect(12, 20, 4, 2, Tm),
    rect(34, 32, 14, 3, T), rect(46, 28, 5, 4, '#5a4030'), rect(44, 30, 4, 2, Tm),
    rect(46, 22, 8, 2, '#5a4030'), rect(50, 18, 5, 2, Tm), rect(52, 14, 4, 2, Tm),
    rect(38, 22, 6, 2, '#5a4030'), rect(40, 18, 4, 2, Tm),
    rect(28, 26, 3, 12, '#5a4030'), rect(29, 16, 2, 12, Tm),
    rect(22, 18, 8, 2, '#5a4030'), rect(20, 14, 4, 2, Tm),
    rect(34, 20, 8, 2, '#5a4030'), rect(40, 16, 4, 2, Tm),
  ];
  for (const [x, y] of [[8,18],[6,16],[14,18],[12,16],[22,12],[20,10],[50,14],[52,12],[40,14],[42,12]] as [number,number][]) {
    branches.push(rect(x, y, 2, 1, Tm));
  }

  const snow: TreeShape[] = [];
  for (const [x, y, w] of [[8,27,8],[14,23,5],[6,19,3],[48,21,6],[50,17,4],[22,17,6],[34,19,5],[28,25,3]] as [number,number,number][]) {
    snow.push(rect(x, y, w, 1, Sl), rect(x + 1, y + 1, w - 1, 1, S));
  }

  return [
    { id: 'ground',   shapes: ground },
    { id: 'trunk',    shapes: trunk },
    { id: 'branches', shapes: branches },
    { id: 'snow',     shapes: snow, animation: { type: 'drift', duration: 5 } },
  ];
}

export function drawBareTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildBareLayers());
}
