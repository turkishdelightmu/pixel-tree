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

export function drawRedwoodTree(ctx: CanvasRenderingContext2D): void {
  const Tk = '#3a1005', Tkm = '#521808', Tkl = '#6e2810', Tkh = '#8a4020', Tkhi = '#a85830';
  const L0 = '#0c3010', L1 = '#124018', L2 = '#1a5020', L3 = '#246028', L4 = '#2e7230', L5 = '#3a8840', L6 = '#4aa050';
  const Moss = '#2a4818';

  // Ground
  r(ctx,8,76,48,3,'#0e1c08'); r(ctx,10,75,44,2,'#162410');
  for (let x = 10; x < 54; x += 3) px(ctx,x,74,L0);

  // Ultra thick trunk
  r(ctx,24,60,16,16,Tk);
  r(ctx,25,44,14,18,Tk);
  r(ctx,26,28,12,18,Tkm);
  r(ctx,27,14,10,16,Tkm);
  r(ctx,28,4,8,12,Tkl);
  // Trunk mid-layer depth
  r(ctx,25,60,14,16,Tkm);
  r(ctx,26,44,12,18,Tkl);
  r(ctx,27,28,10,18,Tkl);
  r(ctx,28,14,8,16,Tkh);
  r(ctx,29,4,6,12,Tkh);
  // Bark highlight (left-lit)
  r(ctx,25,44,3,32,Tkh);
  r(ctx,26,28,2,18,Tkhi);
  r(ctx,27,14,2,16,Tkhi);

  // Deep bark furrows
  for (let y = 8; y < 74; y += 2) {
    px(ctx,28,y,Tk); px(ctx,31,y,Tkm); px(ctx,34,y,Tk); px(ctx,37,y,Tkm);
  }
  for (let y = 10; y < 72; y += 4) {
    px(ctx,26,y,Tkm); px(ctx,33,y+1,Tkl); px(ctx,36,y,Tkm);
  }

  // Moss patches
  for (const [x,y] of [[25,62],[25,66],[25,70],[26,64],[36,63],[37,68],[36,72]] as [number,number][]) {
    px(ctx,x,y,Moss); px(ctx,x+1,y,Moss);
  }

  // Root flares
  r(ctx,16,68,10,8,Tkm); r(ctx,38,68,10,8,Tkm);
  r(ctx,12,70,6,6,Tk);   r(ctx,46,70,6,6,Tk);
  r(ctx,10,72,5,4,Tk);   r(ctx,49,72,5,4,Tk);
  r(ctx,18,72,6,4,Tkl);  r(ctx,40,72,6,4,Tkl);

  // Branch cluster 1 — LOW
  r(ctx,8,58,18,3,Tkm); r(ctx,8,57,14,2,Tkl);
  r(ctx,2,52,14,10,L0); r(ctx,4,50,12,10,L1);
  r(ctx,6,50,10,8,L2);  r(ctx,4,54,6,6,L3);
  px(ctx,6,50,L4); px(ctx,8,49,L4); px(ctx,3,53,L3);
  r(ctx,38,58,18,3,Tkm); r(ctx,42,57,14,2,Tkl);
  r(ctx,48,52,14,10,L0); r(ctx,48,50,12,10,L1);
  r(ctx,48,50,10,8,L2);  r(ctx,54,54,6,6,L3);
  px(ctx,56,50,L4); px(ctx,54,49,L4); px(ctx,59,53,L3);

  // Branch cluster 2 — MID
  r(ctx,10,44,16,3,Tkm); r(ctx,10,43,12,2,Tkl);
  r(ctx,4,38,14,9,L1);  r(ctx,6,36,12,9,L2);
  r(ctx,8,36,8,7,L3);   r(ctx,6,40,6,5,L4);
  px(ctx,7,35,L5); px(ctx,10,34,L4);
  r(ctx,38,44,16,3,Tkm); r(ctx,42,43,12,2,Tkl);
  r(ctx,46,38,14,9,L1); r(ctx,46,36,12,9,L2);
  r(ctx,48,36,8,7,L3);  r(ctx,52,40,6,5,L4);
  px(ctx,56,35,L5); px(ctx,53,34,L4);

  // Branch cluster 3 — UPPER MID
  r(ctx,12,30,14,3,Tkm); r(ctx,12,29,10,2,Tkl);
  r(ctx,6,24,12,8,L1);  r(ctx,8,22,10,8,L2);
  r(ctx,10,22,7,6,L3);  px(ctx,9,21,L4); px(ctx,12,20,L5);
  r(ctx,38,30,14,3,Tkm); r(ctx,42,29,10,2,Tkl);
  r(ctx,46,24,12,8,L1); r(ctx,46,22,10,8,L2);
  r(ctx,47,22,7,6,L3);  px(ctx,54,21,L4); px(ctx,51,20,L5);

  // Branch cluster 4 — HIGH
  r(ctx,14,18,12,2,Tkm); r(ctx,14,17,8,2,Tkl);
  r(ctx,8,12,12,8,L2);  r(ctx,10,10,10,8,L3);
  r(ctx,12,10,6,6,L4);  px(ctx,11,9,L5); px(ctx,13,8,L5);
  r(ctx,38,18,12,2,Tkm); r(ctx,44,17,8,2,Tkl);
  r(ctx,44,12,12,8,L2); r(ctx,44,10,10,8,L3);
  r(ctx,46,10,6,6,L4);  px(ctx,52,9,L5); px(ctx,50,8,L5);

  // Branch cluster 5 — NEAR TOP
  r(ctx,16,8,10,2,Tkl); r(ctx,38,8,10,2,Tkl);
  r(ctx,12,4,10,6,L3);  r(ctx,14,2,8,6,L4);
  r(ctx,42,4,10,6,L3);  r(ctx,44,2,8,6,L4);
  r(ctx,16,2,6,4,L5);   r(ctx,42,2,6,4,L5);

  // Crown
  r(ctx,26,0,12,6,L3);
  r(ctx,28,0,8,5,L4);
  r(ctx,29,0,6,4,L5);
  px(ctx,30,0,L6); px(ctx,32,0,L6); px(ctx,31,0,L6);
}
