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

export function drawCrystalTree(ctx: CanvasRenderingContext2D): void {
  const Tk = '#200840', Tkm = '#300c58', Tkl = '#481070', Tkh = '#6818a0';
  const C0 = '#300858', C1 = '#481080', C2 = '#6020b0', C3 = '#8030d8', C4 = '#a040ff', C5 = '#c060ff', C6 = '#e090ff';
  const CW = '#fff0ff', CG = '#40ff80', CA = '#ff80ff';

  // Glow ground
  r(ctx,14,76,36,3,'#180830'); r(ctx,16,75,32,2,'#2c0a50');
  for (let x = 14; x < 50; x += 3) { px(ctx,x,74,C2); px(ctx,x+1,74,C1); }

  // Crystal trunk — faceted
  r(ctx,28,42,8,34,Tk);
  r(ctx,29,40,6,36,Tkm);
  r(ctx,30,38,5,38,Tkl);
  r(ctx,31,40,3,34,Tkm);
  r(ctx,30,42,2,32,Tkh);
  // Trunk facet lines
  for (let y = 42; y < 72; y += 6) {
    r(ctx,30,y,2,2,C2);
    r(ctx,33,y+3,2,2,C1);
  }

  // Root crystal spikes
  r(ctx,20,66,10,10,Tkm); r(ctx,34,66,10,10,Tkm);
  r(ctx,16,68,6,8,Tk); r(ctx,42,68,6,8,Tk);
  r(ctx,22,62,4,6,C2); r(ctx,38,62,4,6,C2);
  r(ctx,18,64,3,4,C1); r(ctx,43,64,3,4,C1);
  px(ctx,23,60,C3); px(ctx,39,60,C3);

  // Crystal canopy — dark base
  r(ctx,6,28,52,18,C0);
  r(ctx,8,22,48,14,C1);
  r(ctx,12,16,40,12,C2);
  r(ctx,16,10,32,10,C2);
  r(ctx,18,6,28,8,C3);
  r(ctx,20,2,24,6,C3);
  r(ctx,22,0,20,4,C4);
  // Bright inner
  r(ctx,10,26,44,14,C1);
  r(ctx,14,20,36,10,C2);
  r(ctx,18,14,28,8,C3);
  r(ctx,20,8,24,6,C4);
  r(ctx,22,4,20,4,C4);
  r(ctx,24,0,16,4,C5);
  // Crystal highlights
  r(ctx,18,24,12,8,C3); r(ctx,34,22,12,8,C3);
  r(ctx,22,16,16,8,C4); r(ctx,26,10,12,6,C5);
  r(ctx,28,4,8,6,C6);   r(ctx,30,0,4,4,CW);

  // Crystal spires
  r(ctx,29,0,6,2,C6); r(ctx,30,0,4,1,CW);
  r(ctx,14,10,6,8,C3); r(ctx,16,8,4,4,C4); r(ctx,17,6,2,3,C5);
  r(ctx,44,8,6,8,C3);  r(ctx,46,6,4,4,C4); r(ctx,47,4,2,3,C5);
  r(ctx,8,18,4,6,C2);  r(ctx,9,16,2,3,C3);
  r(ctx,52,16,4,6,C2); r(ctx,53,14,2,3,C3);

  // Glow light blobs
  r(ctx,24,20,6,4,C4); r(ctx,34,18,6,4,C4);
  r(ctx,28,14,8,4,C5); r(ctx,30,8,4,4,C6);
  r(ctx,30,6,4,2,CW); px(ctx,31,5,CW); px(ctx,32,5,CW);

  // Floating particles
  const particles: [number,number,string][] = [
    [2,20,C3],[4,14,C4],[2,32,C2],[0,40,C2],[4,48,C3],
    [58,18,C3],[60,26,C4],[62,34,C2],[60,44,C3],[58,54,C2],
    [6,56,C2],[8,60,C3],[50,58,C2],[56,62,C3],
    [10,6,C4],[52,4,C4],[10,12,CA],[52,10,CA],
  ];
  for (const [x,y,c] of particles) {
    if (x >= 0 && x < 64 && y >= 0 && y < 80) {
      px(ctx,x,y,c); px(ctx,x+1,y,c); px(ctx,x,y+1,c);
    }
  }

  // Green magical sparkles
  const sparkles: [number,number,string][] = [[26,26,CG],[38,20,CG],[30,12,CG],[20,30,CA],[44,28,CA]];
  for (const [x,y,c] of sparkles) px(ctx,x,y,c);
}
