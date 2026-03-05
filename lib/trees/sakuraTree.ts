import type { CanvasRenderingContext2D } from 'canvas';

function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  if (!color || color === 'T') return;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function drawSakuraTree(ctx: CanvasRenderingContext2D): void {
  const Tk = '#3d1f14', Tkm = '#4f2b1a', Tkl = '#6a3d28', Tkh = '#7e5040';
  const B0 = '#f8a0c0', B1 = '#f4b8d0', B2 = '#fcd0e4', B3 = '#fff0f8';
  const Bd = '#d870a0', Bds = '#e888b8';

  // Ground shadow
  r(ctx,16,76,32,3,'#d4c0c8'); r(ctx,20,75,24,2,'#c4b0b8');

  // Trunk
  r(ctx,28,58,8,18,Tk);
  r(ctx,29,56,7,20,Tkm);
  r(ctx,30,55,5,22,Tkl);
  r(ctx,31,56,3,20,Tkm);
  px(ctx,30,60,Tk); px(ctx,30,65,Tk); px(ctx,30,70,Tk);
  px(ctx,33,62,Tkh); px(ctx,33,68,Tkh);
  px(ctx,35,60,'#8a6050'); px(ctx,35,66,'#8a6050');

  // Root spread
  r(ctx,22,72,8,5,Tkm); r(ctx,34,72,8,5,Tkm);
  r(ctx,20,74,4,3,Tk); r(ctx,40,74,4,3,Tk);
  r(ctx,26,73,4,2,Tkl); r(ctx,34,73,4,2,Tkl);

  // Branch left
  r(ctx,18,46,12,4,Tkm); r(ctx,16,42,8,3,Tkl);
  r(ctx,14,38,6,2,Tkm); r(ctx,12,34,5,2,Tk);
  // Branch right
  r(ctx,34,44,12,4,Tkm); r(ctx,40,40,8,3,Tkl);
  r(ctx,44,36,6,2,Tkm); r(ctx,46,32,5,2,Tk);
  // Branch center
  r(ctx,30,42,4,4,Tkm); r(ctx,29,36,3,8,Tkl);

  // Blossom canopy — shadow/dark edge layer
  const blossomBase: [number,number,number,number][] = [
    [8,28,16,10], [28,22,16,10], [10,20,14,10],
    [24,14,18,12],[14,12,16,10], [32,10,14,10],
    [6,18,12,12], [38,16,12,12],
  ];
  for (const [x,y,w,h] of blossomBase) r(ctx,x,y,w,h,Bd);

  // Mid layer
  const blossomMid: [number,number,number,number][] = [
    [10,26,20,10],[26,20,20,10],[8,16,18,10],
    [26,12,18,12],[12,8,16,10],[30,8,16,12],
    [4,20,10,10],[42,14,10,10],
    [16,4,28,10],
  ];
  for (const [x,y,w,h] of blossomMid) r(ctx,x,y,w,h,B0);

  // Light mid
  const blossomLight: [number,number,number,number][] = [
    [12,24,16,8],[28,18,16,8],[10,14,16,8],
    [26,10,18,10],[16,6,22,8],[14,2,24,8],
    [6,22,8,8],[42,16,8,8],
  ];
  for (const [x,y,w,h] of blossomLight) r(ctx,x,y,w,h,B1);

  // Highlight clusters
  const blossomHi: [number,number,number,number][] = [
    [14,22,10,6],[28,16,12,6],[12,12,12,6],
    [26,8,14,8],[18,4,18,6],[20,2,16,4],
    [8,24,6,4],[44,18,6,4],
  ];
  for (const [x,y,w,h] of blossomHi) r(ctx,x,y,w,h,B2);

  // Bright highlight spots
  const spots: [number,number,number,number][] = [
    [16,20,4,3],[30,14,4,3],[22,6,4,3],[36,10,4,3],[18,2,4,2],[10,26,3,2],[46,18,3,2],
  ];
  for (const [x,y,w,h] of spots) r(ctx,x,y,w,h,B3);

  // Dark outlines/shadows on blossom edges
  for (let x = 8; x <= 48; x++) {
    if (x % 3 === 0) px(ctx,x,28,Bds);
  }

  // Falling petals
  const petals: [number,number,number][] = [
    [4,36,2],[2,42,2],[0,50,2],[6,46,2],[2,56,2],
    [54,40,2],[58,32,2],[60,44,2],[56,52,2],[60,60,2],
    [10,60,2],[6,64,2],[50,62,2],[48,68,2],[14,68,2],
    [52,56,2],[4,62,2],[58,68,2],
  ];
  for (const [x,y,s] of petals) {
    r(ctx,x,y,s,s,B1);
    px(ctx,x,y,B2);
  }
}
