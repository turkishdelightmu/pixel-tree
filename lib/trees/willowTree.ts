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

export function drawWillowTree(ctx: CanvasRenderingContext2D): void {
  const Tk = '#3a2c0e', Tkm = '#4e3c18', Tkl = '#6a5228', Tkh = '#8a6e3c';
  const L0 = '#1a6e30', L1 = '#228040', L2 = '#2c9850', L3 = '#38b060', L4 = '#52c870', L5 = '#6edd88';

  // Ground
  r(ctx,14,75,36,4,'#1a3010'); r(ctx,16,74,32,2,'#243818');

  // Trunk
  r(ctx,28,40,8,36,Tk);
  r(ctx,29,38,6,38,Tkm);
  r(ctx,30,36,5,40,Tkl);
  r(ctx,31,38,3,36,Tkm);
  for (let y = 40; y < 74; y += 5) {
    px(ctx,30,y,Tk); px(ctx,33,y+2,Tkh); px(ctx,35,y+1,Tkm);
  }

  // Roots
  r(ctx,22,70,8,6,Tkm); r(ctx,34,70,8,6,Tkm);
  r(ctx,20,72,4,4,Tk); r(ctx,40,72,4,4,Tk);

  // Main canopy dome
  r(ctx,18,6,28,8,L1);
  r(ctx,12,10,40,8,L1);
  r(ctx,8,14,48,8,L1);
  r(ctx,6,18,52,8,L2);
  r(ctx,8,22,48,8,L2);
  r(ctx,12,26,40,6,L1);
  r(ctx,18,28,28,6,L0);
  // highlights
  r(ctx,22,4,20,6,L2);
  r(ctx,26,2,12,4,L3);
  r(ctx,14,8,12,6,L3); r(ctx,38,8,12,6,L3);
  r(ctx,10,12,8,4,L3); r(ctx,46,12,8,4,L3);
  // top bright
  r(ctx,28,0,8,4,L4); r(ctx,24,2,4,2,L4); r(ctx,34,2,4,2,L4);
  px(ctx,30,0,L5); px(ctx,32,0,L5);

  // Drooping branch strands
  const strands: { x: number; y: number; dx: number; len: number; col: string[] }[] = [
    { x: 8,  y: 24, dx: -1, len: 30, col: [L0,L1,L2,L1] },
    { x: 12, y: 26, dx: -1, len: 32, col: [L1,L2,L3,L2] },
    { x: 16, y: 28, dx:  0, len: 28, col: [L0,L1,L2,L1] },
    { x: 20, y: 30, dx:  0, len: 34, col: [L1,L2,L3,L2] },
    { x: 24, y: 32, dx:  0, len: 30, col: [L2,L3,L4,L3] },
    { x: 28, y: 34, dx:  0, len: 36, col: [L1,L2,L3,L2] },
    { x: 32, y: 34, dx:  0, len: 36, col: [L2,L3,L4,L3] },
    { x: 36, y: 32, dx:  0, len: 32, col: [L1,L2,L3,L2] },
    { x: 40, y: 30, dx:  0, len: 28, col: [L0,L1,L2,L1] },
    { x: 44, y: 28, dx:  1, len: 30, col: [L1,L2,L3,L2] },
    { x: 48, y: 26, dx:  1, len: 28, col: [L0,L1,L2,L1] },
    { x: 52, y: 24, dx:  1, len: 26, col: [L1,L2,L3,L2] },
    { x: 10, y: 20, dx: -1, len: 22, col: [L0,L1,L1,L0] },
    { x: 54, y: 20, dx:  1, len: 22, col: [L0,L1,L1,L0] },
  ];

  for (const s of strands) {
    for (let i = 0; i < s.len; i++) {
      const cx = s.x + Math.floor(s.dx * i * 0.4);
      const col = s.col[Math.floor(i / s.len * 4) % 4];
      if (cx >= 0 && cx < 64) {
        px(ctx, cx, s.y + i, col);
        if (i % 2 === 0 && cx + 1 < 64) px(ctx, cx + 1, s.y + i, col);
      }
    }
  }

  // Leaf tip dots at ends of strands
  for (const s of strands) {
    const ex = s.x + Math.floor(s.dx * s.len * 0.4);
    if (ex >= 0 && ex < 64) {
      px(ctx, ex, s.y + s.len, L3);
      px(ctx, ex, s.y + s.len - 1, L4);
    }
  }
}
