import type { CanvasRenderingContext2D } from 'canvas';
import { drawTreeLayers, pixel, rect, type TreeLayer, type TreeShape } from './layers';

export function buildOakLayers(): TreeLayer[] {
  const Tk = '#3a1e08', Tkm = '#4e2c10', Tkl = '#6a3e1c', Tkh = '#8a5a30';
  const L0 = '#1a4810', L1 = '#1e5c18', L2 = '#247020', L3 = '#2c8828', L4 = '#38a030', L5 = '#4ab840', L6 = '#60cc50';

  const ground: TreeShape[] = [
    rect(10, 76, 44, 3, '#182c08'), rect(12, 75, 40, 2, '#203810'),
  ];

  const trunk: TreeShape[] = [
    rect(26, 48, 12, 28, Tk), rect(27, 46, 10, 30, Tkm),
    rect(28, 44, 9, 32, Tkl), rect(29, 46, 7, 28, Tkm),
    rect(30, 48, 5, 24, Tkl), rect(29, 50, 2, 20, Tkh),
    rect(18, 68, 10, 8, Tkm), rect(36, 68, 10, 8, Tkm),
    rect(14, 70, 6, 6, Tk),  rect(44, 70, 6, 6, Tk),
    rect(12, 72, 5, 4, Tk),  rect(47, 72, 5, 4, Tk),
    rect(20, 72, 6, 4, Tkl), rect(38, 72, 6, 4, Tkl),
  ];
  for (let y = 48; y < 74; y += 4) {
    trunk.push(
      pixel(28, y, Tk),   pixel(28, y + 2, Tkh),
      pixel(32, y + 1, Tk), pixel(32, y + 3, Tkh),
      pixel(35, y, Tkm),  pixel(35, y + 2, '#5a3418'),
    );
  }

  const canopy: TreeShape[] = [];
  for (const [x, y, w, h] of [[4,30,18,14],[42,28,18,14],[14,16,36,14],[6,20,12,12],[46,20,12,12],[10,10,44,8]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L0));
  for (const [x, y, w, h] of [[2,32,20,12],[40,30,22,12],[10,18,44,12],[4,22,10,10],[50,22,10,10],[8,8,48,8]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L1));
  for (const [x, y, w, h] of [[4,30,56,16],[8,20,48,14],[12,12,40,12],[16,6,32,10],[20,2,24,8]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L2));
  for (const [x, y, w, h] of [[6,28,52,14],[10,18,44,12],[14,10,36,10],[18,4,28,8]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L3));
  for (const [x, y, w, h] of [[10,26,44,10],[16,16,32,8],[20,8,24,6],[24,4,16,4]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L4));
  for (const [x, y, w, h] of [[14,24,12,6],[38,22,12,6],[22,14,20,6],[28,6,14,4]] as [number,number,number,number][]) canopy.push(rect(x, y, w, h, L5));

  const highlights: TreeShape[] = [
    rect(26, 2, 12, 4, L6), rect(24, 4, 4, 2, L5), rect(36, 4, 4, 2, L5),
    pixel(30, 0, L6), pixel(32, 0, L6), pixel(28, 0, L5), pixel(34, 0, L5),
  ];
  for (let i = 0; i < 6; i++) {
    const x = 4 + i * 10;
    const bh = (4 + Math.abs(Math.sin(i) * 4)) | 0;
    highlights.push(rect(x, 28 - bh, 6, bh, L3), rect(x + 1, 28 - bh - 2, 4, 2, L4));
  }

  const leafFall: TreeShape[] = [
    pixel(8,  30, L3), pixel(16, 35, L4), pixel(22, 22, L3), pixel(34, 18, L4),
    pixel(46, 26, L3), pixel(52, 32, L4), pixel(28, 12, L3), pixel(40, 38, L4),
    pixel(12, 42, L3), pixel(58, 20, L4), pixel(36, 44, L3), pixel(20,  8, L4),
  ];

  return [
    { id: 'ground',     shapes: ground },
    { id: 'trunk',      shapes: trunk },
    { id: 'canopy',     shapes: canopy },
    { id: 'highlights', shapes: highlights, animation: { type: 'twinkle', duration: 2 } },
    { id: 'leaf-fall',  shapes: leafFall,   animation: { type: 'fall',    duration: 4 } },
  ];
}

export function drawOakTree(ctx: CanvasRenderingContext2D): void {
  drawTreeLayers(ctx, buildOakLayers());
}
