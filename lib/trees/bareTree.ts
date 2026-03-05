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

export function drawBareTree(ctx: CanvasRenderingContext2D): void {
  const T = '#4a3828', Tm = '#3a2a1c', Td = '#2c1e12';
  const S = '#b8ccd8', Sl = '#d4e4f0'; // snow
  const G = '#283848', Gd = '#1c2c3c'; // ground shadow

  // Ground shadow
  r(ctx,14,74,36,4,Gd); r(ctx,18,73,28,2,G);

  // Trunk base thick
  r(ctx,28,55,8,20,T);
  r(ctx,29,55,6,18,Tm);
  r(ctx,30,56,4,16,'#4e3c2a');
  // trunk taper
  r(ctx,29,45,6,12,T);
  r(ctx,30,45,4,10,Tm);
  r(ctx,29,36,5,10,'#5a4030');
  r(ctx,30,36,3,8,Tm);
  // bark lines
  px(ctx,30,58,Td); px(ctx,30,62,Td); px(ctx,30,66,Td);
  px(ctx,32,60,Td); px(ctx,32,64,Td);
  px(ctx,34,59,Td); px(ctx,34,63,Td);

  // Root flare
  r(ctx,24,70,6,4,'#3a2c1c'); r(ctx,34,70,6,4,'#3a2c1c');
  r(ctx,22,72,4,2,Td); r(ctx,38,72,4,2,Td);

  // Left branch big
  r(ctx,16,38,14,3,T); r(ctx,14,35,5,4,'#5a4030');
  r(ctx,16,36,4,2,Tm);
  // Left sub-branches
  r(ctx,10,28,8,2,'#5a4030'); r(ctx,8,24,5,2,Tm);
  r(ctx,6,20,4,2,Tm);
  r(ctx,14,24,6,2,'#5a4030'); r(ctx,12,20,4,2,Tm);

  // Right branch big
  r(ctx,34,32,14,3,T); r(ctx,46,28,5,4,'#5a4030');
  r(ctx,44,30,4,2,Tm);
  // Right sub-branches
  r(ctx,46,22,8,2,'#5a4030'); r(ctx,50,18,5,2,Tm);
  r(ctx,52,14,4,2,Tm);
  r(ctx,38,22,6,2,'#5a4030'); r(ctx,40,18,4,2,Tm);

  // Center top branches
  r(ctx,28,26,3,12,'#5a4030'); r(ctx,29,16,2,12,Tm);
  r(ctx,22,18,8,2,'#5a4030'); r(ctx,20,14,4,2,Tm);
  r(ctx,34,20,8,2,'#5a4030'); r(ctx,40,16,4,2,Tm);

  // Twig tips
  for (const [x,y] of [[8,18],[6,16],[14,18],[12,16],[22,12],[20,10],[50,14],[52,12],[40,14],[42,12]] as [number,number][]) {
    r(ctx,x,y,2,1,Tm);
  }

  // Snow on branches
  for (const [x,y,w] of [[8,27,8],[14,23,5],[6,19,3],[48,21,6],[50,17,4],[22,17,6],[34,19,5],[28,25,3]] as [number,number,number][]) {
    r(ctx,x,y,w,1,Sl);
    r(ctx,x+1,y+1,w-1,1,S);
  }

  // Snow ground
  r(ctx,12,72,40,2,Sl); r(ctx,14,71,36,1,S);
  // Snow lumps
  for (let x = 12; x < 52; x += 4) { px(ctx,x,70,S); px(ctx,x+1,70,Sl); }
}
