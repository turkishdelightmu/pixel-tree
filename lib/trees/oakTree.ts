import type { CanvasRenderingContext2D } from 'canvas';
import { px, r } from './helpers';

export function drawOakTree(ctx: CanvasRenderingContext2D): void {
  const Tk = '#3a1e08', Tkm = '#4e2c10', Tkl = '#6a3e1c', Tkh = '#8a5a30';
  const L0 = '#1a4810', L1 = '#1e5c18', L2 = '#247020', L3 = '#2c8828', L4 = '#38a030', L5 = '#4ab840', L6 = '#60cc50';

  // Ground
  r(ctx,10,76,44,3,'#182c08'); r(ctx,12,75,40,2,'#203810');

  // Massive trunk
  r(ctx,26,48,12,28,Tk);
  r(ctx,27,46,10,30,Tkm);
  r(ctx,28,44,9,32,Tkl);
  r(ctx,29,46,7,28,Tkm);
  r(ctx,30,48,5,24,Tkl);
  // bark texture
  for (let y = 48; y < 74; y += 4) {
    px(ctx,28,y,Tk); px(ctx,28,y+2,Tkh);
    px(ctx,32,y+1,Tk); px(ctx,32,y+3,Tkh);
    px(ctx,35,y,Tkm); px(ctx,35,y+2,'#5a3418');
  }
  // trunk highlight
  r(ctx,29,50,2,20,Tkh);

  // Root flares
  r(ctx,18,68,10,8,Tkm); r(ctx,36,68,10,8,Tkm);
  r(ctx,14,70,6,6,Tk); r(ctx,44,70,6,6,Tk);
  r(ctx,12,72,5,4,Tk); r(ctx,47,72,5,4,Tk);
  r(ctx,20,72,6,4,Tkl); r(ctx,38,72,6,4,Tkl);

  // Canopy — dark base/shadow layer
  const shadow: [number,number,number,number][] = [
    [4,30,18,14],[42,28,18,14],[14,16,36,14],[6,20,12,12],[46,20,12,12],[10,10,44,8],
  ];
  for (const [x,y,w,h] of shadow) r(ctx,x,y,w,h,L0);

  // Dark mid
  const dark: [number,number,number,number][] = [
    [2,32,20,12],[40,30,22,12],[10,18,44,12],[4,22,10,10],[50,22,10,10],[8,8,48,8],
  ];
  for (const [x,y,w,h] of dark) r(ctx,x,y,w,h,L1);

  // Main foliage
  const main: [number,number,number,number][] = [
    [4,30,56,16],[8,20,48,14],[12,12,40,12],[16,6,32,10],[20,2,24,8],
  ];
  for (const [x,y,w,h] of main) r(ctx,x,y,w,h,L2);

  // Lighter mid
  const mid: [number,number,number,number][] = [
    [6,28,52,14],[10,18,44,12],[14,10,36,10],[18,4,28,8],
  ];
  for (const [x,y,w,h] of mid) r(ctx,x,y,w,h,L3);

  // Highlights
  const hi: [number,number,number,number][] = [
    [10,26,44,10],[16,16,32,8],[20,8,24,6],[24,4,16,4],
  ];
  for (const [x,y,w,h] of hi) r(ctx,x,y,w,h,L4);

  // Bright spots
  const bright: [number,number,number,number][] = [
    [14,24,12,6],[38,22,12,6],[22,14,20,6],[28,6,14,4],
  ];
  for (const [x,y,w,h] of bright) r(ctx,x,y,w,h,L5);

  // Top bright
  r(ctx,26,2,12,4,L6); r(ctx,24,4,4,2,L5); r(ctx,36,4,4,2,L5);
  px(ctx,30,0,L6); px(ctx,32,0,L6); px(ctx,28,0,L5); px(ctx,34,0,L5);

  // Silhouette bumps on edges
  for (let i = 0; i < 6; i++) {
    const x = 4 + i * 10;
    const bh = (4 + Math.abs(Math.sin(i) * 4)) | 0;
    r(ctx, x, 28 - bh, 6, bh, L3);
    r(ctx, x + 1, 28 - bh - 2, 4, 2, L4);
  }
}
