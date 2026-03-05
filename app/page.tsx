'use client';

import { useEffect, useRef, useState } from 'react';

// ─── canvas helpers ───────────────────────────────────────────────────────────
type Ctx = CanvasRenderingContext2D;
function px(ctx: Ctx, x: number, y: number, c: string) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
function dr(ctx: Ctx, x: number, y: number, w: number, h: number, c: string) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

// ─── Tier 0: Bare Winter Tree ─────────────────────────────────────────────────
function drawBareTree(ctx: Ctx) {
  const T='#4a3828',Tm='#3a2a1c',Td='#2c1e12';
  const S='#b8ccd8',Sl='#d4e4f0';
  const G='#283848',Gd='#1c2c3c';
  dr(ctx,14,74,36,4,Gd); dr(ctx,18,73,28,2,G);
  dr(ctx,28,55,8,20,T); dr(ctx,29,55,6,18,Tm); dr(ctx,30,56,4,16,'#4e3c2a');
  dr(ctx,29,45,6,12,T); dr(ctx,30,45,4,10,Tm);
  dr(ctx,29,36,5,10,'#5a4030'); dr(ctx,30,36,3,8,Tm);
  px(ctx,30,58,Td); px(ctx,30,62,Td); px(ctx,30,66,Td);
  px(ctx,32,60,Td); px(ctx,32,64,Td); px(ctx,34,59,Td); px(ctx,34,63,Td);
  dr(ctx,24,70,6,4,'#3a2c1c'); dr(ctx,34,70,6,4,'#3a2c1c');
  dr(ctx,22,72,4,2,Td); dr(ctx,38,72,4,2,Td);
  dr(ctx,16,38,14,3,T); dr(ctx,14,35,5,4,'#5a4030'); dr(ctx,16,36,4,2,Tm);
  dr(ctx,10,28,8,2,'#5a4030'); dr(ctx,8,24,5,2,Tm); dr(ctx,6,20,4,2,Tm);
  dr(ctx,14,24,6,2,'#5a4030'); dr(ctx,12,20,4,2,Tm);
  dr(ctx,34,32,14,3,T); dr(ctx,46,28,5,4,'#5a4030'); dr(ctx,44,30,4,2,Tm);
  dr(ctx,46,22,8,2,'#5a4030'); dr(ctx,50,18,5,2,Tm); dr(ctx,52,14,4,2,Tm);
  dr(ctx,38,22,6,2,'#5a4030'); dr(ctx,40,18,4,2,Tm);
  dr(ctx,28,26,3,12,'#5a4030'); dr(ctx,29,16,2,12,Tm);
  dr(ctx,22,18,8,2,'#5a4030'); dr(ctx,20,14,4,2,Tm);
  dr(ctx,34,20,8,2,'#5a4030'); dr(ctx,40,16,4,2,Tm);
  for(const [x,y] of [[8,18],[6,16],[14,18],[12,16],[22,12],[20,10],[50,14],[52,12],[40,14],[42,12]]) dr(ctx,x as number,y as number,2,1,Tm);
  for(const [x,y,w] of [[8,27,8],[14,23,5],[6,19,3],[48,21,6],[50,17,4],[22,17,6],[34,19,5],[28,25,3]]) {
    dr(ctx,x as number,y as number,w as number,1,Sl); dr(ctx,(x as number)+1,(y as number)+1,(w as number)-1,1,S);
  }
  dr(ctx,12,72,40,2,Sl); dr(ctx,14,71,36,1,S);
  for(let x=12;x<52;x+=4){ px(ctx,x,70,S); px(ctx,x+1,70,Sl); }
}

// ─── Tier 1: Sakura Tree ──────────────────────────────────────────────────────
function drawSakuraTree(ctx: Ctx) {
  const Tk='#3d1f14',Tkm='#4f2b1a',Tkl='#6a3d28';
  const B0='#f8a0c0',B1='#f4b8d0',B2='#fcd0e4',B3='#fff0f8';
  const Bd='#d870a0',Bds='#e888b8';
  dr(ctx,16,76,32,3,'#d4c0c8'); dr(ctx,20,75,24,2,'#c4b0b8');
  dr(ctx,28,58,8,18,Tk); dr(ctx,29,56,7,20,Tkm); dr(ctx,30,55,5,22,Tkl); dr(ctx,31,56,3,20,Tkm);
  px(ctx,30,60,Tk); px(ctx,30,65,Tk); px(ctx,30,70,Tk);
  px(ctx,33,62,'#8a6050'); px(ctx,33,68,'#8a6050');
  dr(ctx,22,72,8,5,Tkm); dr(ctx,34,72,8,5,Tkm); dr(ctx,20,74,4,3,Tk); dr(ctx,40,74,4,3,Tk);
  dr(ctx,18,46,12,4,Tkm); dr(ctx,16,42,8,3,Tkl); dr(ctx,14,38,6,2,Tkm); dr(ctx,12,34,5,2,Tk);
  dr(ctx,34,44,12,4,Tkm); dr(ctx,40,40,8,3,Tkl); dr(ctx,44,36,6,2,Tkm); dr(ctx,46,32,5,2,Tk);
  dr(ctx,30,42,4,4,Tkm); dr(ctx,29,36,3,8,Tkl);
  for(const [x,y,w,h] of [[8,28,16,10],[28,22,16,10],[10,20,14,10],[24,14,18,12],[14,12,16,10],[32,10,14,10],[6,18,12,12],[38,16,12,12]]) dr(ctx,x as number,y as number,w as number,h as number,Bd);
  for(const [x,y,w,h] of [[10,26,20,10],[26,20,20,10],[8,16,18,10],[26,12,18,12],[12,8,16,10],[30,8,16,12],[4,20,10,10],[42,14,10,10],[16,4,28,10]]) dr(ctx,x as number,y as number,w as number,h as number,B0);
  for(const [x,y,w,h] of [[12,24,16,8],[28,18,16,8],[10,14,16,8],[26,10,18,10],[16,6,22,8],[14,2,24,8],[6,22,8,8],[42,16,8,8]]) dr(ctx,x as number,y as number,w as number,h as number,B1);
  for(const [x,y,w,h] of [[14,22,10,6],[28,16,12,6],[12,12,12,6],[26,8,14,8],[18,4,18,6],[20,2,16,4],[8,24,6,4],[44,18,6,4]]) dr(ctx,x as number,y as number,w as number,h as number,B2);
  for(const [x,y,w,h] of [[16,20,4,3],[30,14,4,3],[22,6,4,3],[36,10,4,3],[18,2,4,2],[10,26,3,2],[46,18,3,2]]) dr(ctx,x as number,y as number,w as number,h as number,B3);
  for(let x=8;x<=48;x++) { if(x%3===0) px(ctx,x,28,Bds); }
  for(const [x,y,s] of [[4,36,2],[2,42,2],[0,50,2],[6,46,2],[2,56,2],[54,40,2],[58,32,2],[60,44,2],[56,52,2],[60,60,2],[10,60,2],[6,64,2],[50,62,2],[48,68,2],[14,68,2],[52,56,2],[4,62,2],[58,68,2]]) {
    dr(ctx,x as number,y as number,s as number,s as number,B1); px(ctx,x as number,y as number,B2);
  }
}

// ─── Tier 2: Willow Tree ──────────────────────────────────────────────────────
function drawWillowTree(ctx: Ctx) {
  const Tk='#3a2c0e',Tkm='#4e3c18',Tkl='#6a5228',Tkh='#8a6e3c';
  const L0='#1a6e30',L1='#228040',L2='#2c9850',L3='#38b060',L4='#52c870',L5='#6edd88';
  dr(ctx,14,75,36,4,'#1a3010'); dr(ctx,16,74,32,2,'#243818');
  dr(ctx,28,40,8,36,Tk); dr(ctx,29,38,6,38,Tkm); dr(ctx,30,36,5,40,Tkl); dr(ctx,31,38,3,36,Tkm);
  for(let y=40;y<74;y+=5){ px(ctx,30,y,Tk); px(ctx,33,y+2,Tkh); px(ctx,35,y+1,Tkm); }
  dr(ctx,22,70,8,6,Tkm); dr(ctx,34,70,8,6,Tkm); dr(ctx,20,72,4,4,Tk); dr(ctx,40,72,4,4,Tk);
  dr(ctx,18,6,28,8,L1); dr(ctx,12,10,40,8,L1); dr(ctx,8,14,48,8,L1); dr(ctx,6,18,52,8,L2);
  dr(ctx,8,22,48,8,L2); dr(ctx,12,26,40,6,L1); dr(ctx,18,28,28,6,L0);
  dr(ctx,22,4,20,6,L2); dr(ctx,26,2,12,4,L3); dr(ctx,14,8,12,6,L3); dr(ctx,38,8,12,6,L3);
  dr(ctx,10,12,8,4,L3); dr(ctx,46,12,8,4,L3);
  dr(ctx,28,0,8,4,L4); dr(ctx,24,2,4,2,L4); dr(ctx,34,2,4,2,L4);
  px(ctx,30,0,L5); px(ctx,32,0,L5);
  const strands = [
    {x:8,y:24,dx:-1,len:30,col:[L0,L1,L2,L1]},{x:12,y:26,dx:-1,len:32,col:[L1,L2,L3,L2]},
    {x:16,y:28,dx:0,len:28,col:[L0,L1,L2,L1]},{x:20,y:30,dx:0,len:34,col:[L1,L2,L3,L2]},
    {x:24,y:32,dx:0,len:30,col:[L2,L3,L4,L3]},{x:28,y:34,dx:0,len:36,col:[L1,L2,L3,L2]},
    {x:32,y:34,dx:0,len:36,col:[L2,L3,L4,L3]},{x:36,y:32,dx:0,len:32,col:[L1,L2,L3,L2]},
    {x:40,y:30,dx:0,len:28,col:[L0,L1,L2,L1]},{x:44,y:28,dx:1,len:30,col:[L1,L2,L3,L2]},
    {x:48,y:26,dx:1,len:28,col:[L0,L1,L2,L1]},{x:52,y:24,dx:1,len:26,col:[L1,L2,L3,L2]},
    {x:10,y:20,dx:-1,len:22,col:[L0,L1,L1,L0]},{x:54,y:20,dx:1,len:22,col:[L0,L1,L1,L0]},
  ];
  for(const s of strands) {
    for(let i=0;i<s.len;i++) {
      const cx=s.x+Math.floor(s.dx*i*0.4);
      const col=s.col[Math.floor(i/s.len*4)%4];
      if(cx>=0&&cx<64){ px(ctx,cx,s.y+i,col); if(i%2===0&&cx+1<64) px(ctx,cx+1,s.y+i,col); }
    }
    const ex=s.x+Math.floor(s.dx*s.len*0.4);
    if(ex>=0&&ex<64){ px(ctx,ex,s.y+s.len,L3); px(ctx,ex,s.y+s.len-1,L4); }
  }
}

// ─── Tier 3: Oak Tree ─────────────────────────────────────────────────────────
function drawOakTree(ctx: Ctx) {
  const Tk='#3a1e08',Tkm='#4e2c10',Tkl='#6a3e1c',Tkh='#8a5a30';
  const L0='#1a4810',L1='#1e5c18',L2='#247020',L3='#2c8828',L4='#38a030',L5='#4ab840',L6='#60cc50';
  dr(ctx,10,76,44,3,'#182c08'); dr(ctx,12,75,40,2,'#203810');
  dr(ctx,26,48,12,28,Tk); dr(ctx,27,46,10,30,Tkm); dr(ctx,28,44,9,32,Tkl);
  dr(ctx,29,46,7,28,Tkm); dr(ctx,30,48,5,24,Tkl);
  for(let y=48;y<74;y+=4){ px(ctx,28,y,Tk); px(ctx,28,y+2,Tkh); px(ctx,32,y+1,Tk); px(ctx,32,y+3,Tkh); px(ctx,35,y,Tkm); }
  dr(ctx,29,50,2,20,Tkh);
  dr(ctx,18,68,10,8,Tkm); dr(ctx,36,68,10,8,Tkm); dr(ctx,14,70,6,6,Tk); dr(ctx,44,70,6,6,Tk);
  dr(ctx,12,72,5,4,Tk); dr(ctx,47,72,5,4,Tk); dr(ctx,20,72,6,4,Tkl); dr(ctx,38,72,6,4,Tkl);
  for(const [x,y,w,h] of [[4,30,18,14],[42,28,18,14],[14,16,36,14],[6,20,12,12],[46,20,12,12],[10,10,44,8]]) dr(ctx,x as number,y as number,w as number,h as number,L0);
  for(const [x,y,w,h] of [[2,32,20,12],[40,30,22,12],[10,18,44,12],[4,22,10,10],[50,22,10,10],[8,8,48,8]]) dr(ctx,x as number,y as number,w as number,h as number,L1);
  for(const [x,y,w,h] of [[4,30,56,16],[8,20,48,14],[12,12,40,12],[16,6,32,10],[20,2,24,8]]) dr(ctx,x as number,y as number,w as number,h as number,L2);
  for(const [x,y,w,h] of [[6,28,52,14],[10,18,44,12],[14,10,36,10],[18,4,28,8]]) dr(ctx,x as number,y as number,w as number,h as number,L3);
  for(const [x,y,w,h] of [[10,26,44,10],[16,16,32,8],[20,8,24,6],[24,4,16,4]]) dr(ctx,x as number,y as number,w as number,h as number,L4);
  for(const [x,y,w,h] of [[14,24,12,6],[38,22,12,6],[22,14,20,6],[28,6,14,4]]) dr(ctx,x as number,y as number,w as number,h as number,L5);
  dr(ctx,26,2,12,4,L6); dr(ctx,24,4,4,2,L5); dr(ctx,36,4,4,2,L5);
  px(ctx,30,0,L6); px(ctx,32,0,L6); px(ctx,28,0,L5); px(ctx,34,0,L5);
  for(let i=0;i<6;i++){
    const bx=4+i*10, bh=4+Math.abs(Math.sin(i)*4)|0;
    dr(ctx,bx,28-bh,6,bh,L3); dr(ctx,bx+1,28-bh-2,4,2,L4);
  }
}

// ─── Tier 4: Redwood ──────────────────────────────────────────────────────────
function drawRedwoodTree(ctx: Ctx) {
  const Tk='#3a1005',Tkm='#521808',Tkl='#6e2810',Tkh='#8a4020',Tkhi='#a85830';
  const L0='#0c3010',L1='#124018',L2='#1a5020',L3='#246028',L4='#2e7230',L5='#3a8840',L6='#4aa050';
  const Moss='#2a4818';
  dr(ctx,8,76,48,3,'#0e1c08'); dr(ctx,10,75,44,2,'#162410');
  for(let x=10;x<54;x+=3) px(ctx,x,74,L0);
  dr(ctx,24,60,16,16,Tk); dr(ctx,25,44,14,18,Tk); dr(ctx,26,28,12,18,Tkm); dr(ctx,27,14,10,16,Tkm); dr(ctx,28,4,8,12,Tkl);
  dr(ctx,25,60,14,16,Tkm); dr(ctx,26,44,12,18,Tkl); dr(ctx,27,28,10,18,Tkl); dr(ctx,28,14,8,16,Tkh); dr(ctx,29,4,6,12,Tkh);
  dr(ctx,25,44,3,32,Tkh); dr(ctx,26,28,2,18,Tkhi); dr(ctx,27,14,2,16,Tkhi);
  for(let y=8;y<74;y+=2){ px(ctx,28,y,Tk); px(ctx,31,y,Tkm); px(ctx,34,y,Tk); px(ctx,37,y,Tkm); }
  for(let y=10;y<72;y+=4){ px(ctx,26,y,Tkm); px(ctx,33,y+1,Tkl); px(ctx,36,y,Tkm); }
  for(const [x,y] of [[25,62],[25,66],[25,70],[26,64],[36,63],[37,68],[36,72]]){ px(ctx,x as number,y as number,Moss); px(ctx,(x as number)+1,y as number,Moss); }
  dr(ctx,16,68,10,8,Tkm); dr(ctx,38,68,10,8,Tkm); dr(ctx,12,70,6,6,Tk); dr(ctx,46,70,6,6,Tk);
  dr(ctx,10,72,5,4,Tk); dr(ctx,49,72,5,4,Tk); dr(ctx,18,72,6,4,Tkl); dr(ctx,40,72,6,4,Tkl);
  dr(ctx,8,58,18,3,Tkm); dr(ctx,8,57,14,2,Tkl);
  dr(ctx,2,52,14,10,L0); dr(ctx,4,50,12,10,L1); dr(ctx,6,50,10,8,L2); dr(ctx,4,54,6,6,L3);
  px(ctx,6,50,L4); px(ctx,8,49,L4); px(ctx,3,53,L3);
  dr(ctx,38,58,18,3,Tkm); dr(ctx,42,57,14,2,Tkl);
  dr(ctx,48,52,14,10,L0); dr(ctx,48,50,12,10,L1); dr(ctx,48,50,10,8,L2); dr(ctx,54,54,6,6,L3);
  px(ctx,56,50,L4); px(ctx,54,49,L4); px(ctx,59,53,L3);
  dr(ctx,10,44,16,3,Tkm); dr(ctx,10,43,12,2,Tkl);
  dr(ctx,4,38,14,9,L1); dr(ctx,6,36,12,9,L2); dr(ctx,8,36,8,7,L3); dr(ctx,6,40,6,5,L4);
  px(ctx,7,35,L5); px(ctx,10,34,L4);
  dr(ctx,38,44,16,3,Tkm); dr(ctx,42,43,12,2,Tkl);
  dr(ctx,46,38,14,9,L1); dr(ctx,46,36,12,9,L2); dr(ctx,48,36,8,7,L3); dr(ctx,52,40,6,5,L4);
  px(ctx,56,35,L5); px(ctx,53,34,L4);
  dr(ctx,12,30,14,3,Tkm); dr(ctx,12,29,10,2,Tkl);
  dr(ctx,6,24,12,8,L1); dr(ctx,8,22,10,8,L2); dr(ctx,10,22,7,6,L3); px(ctx,9,21,L4); px(ctx,12,20,L5);
  dr(ctx,38,30,14,3,Tkm); dr(ctx,42,29,10,2,Tkl);
  dr(ctx,46,24,12,8,L1); dr(ctx,46,22,10,8,L2); dr(ctx,47,22,7,6,L3); px(ctx,54,21,L4); px(ctx,51,20,L5);
  dr(ctx,14,18,12,2,Tkm); dr(ctx,14,17,8,2,Tkl);
  dr(ctx,8,12,12,8,L2); dr(ctx,10,10,10,8,L3); dr(ctx,12,10,6,6,L4); px(ctx,11,9,L5); px(ctx,13,8,L5);
  dr(ctx,38,18,12,2,Tkm); dr(ctx,44,17,8,2,Tkl);
  dr(ctx,44,12,12,8,L2); dr(ctx,44,10,10,8,L3); dr(ctx,46,10,6,6,L4); px(ctx,52,9,L5); px(ctx,50,8,L5);
  dr(ctx,16,8,10,2,Tkl); dr(ctx,38,8,10,2,Tkl);
  dr(ctx,12,4,10,6,L3); dr(ctx,14,2,8,6,L4); dr(ctx,42,4,10,6,L3); dr(ctx,44,2,8,6,L4);
  dr(ctx,16,2,6,4,L5); dr(ctx,42,2,6,4,L5);
  dr(ctx,26,0,12,6,L3); dr(ctx,28,0,8,5,L4); dr(ctx,29,0,6,4,L5);
  px(ctx,30,0,L6); px(ctx,32,0,L6); px(ctx,31,0,L6);
}

// ─── Tier 5: Crystal Tree ─────────────────────────────────────────────────────
function drawCrystalTree(ctx: Ctx) {
  const Tk='#200840',Tkm='#300c58',Tkl='#481070',Tkh='#6818a0';
  const C0='#300858',C1='#481080',C2='#6020b0',C3='#8030d8',C4='#a040ff',C5='#c060ff',C6='#e090ff';
  const CW='#fff0ff',CG='#40ff80',CA='#ff80ff';
  dr(ctx,14,76,36,3,'#180830'); dr(ctx,16,75,32,2,'#2c0a50');
  for(let x=14;x<50;x+=3){ px(ctx,x,74,C2); px(ctx,x+1,74,C1); }
  dr(ctx,28,42,8,34,Tk); dr(ctx,29,40,6,36,Tkm); dr(ctx,30,38,5,38,Tkl); dr(ctx,31,40,3,34,Tkm); dr(ctx,30,42,2,32,Tkh);
  for(let y=42;y<72;y+=6){ dr(ctx,30,y,2,2,C2); dr(ctx,33,y+3,2,2,C1); }
  dr(ctx,20,66,10,10,Tkm); dr(ctx,34,66,10,10,Tkm); dr(ctx,16,68,6,8,Tk); dr(ctx,42,68,6,8,Tk);
  dr(ctx,22,62,4,6,C2); dr(ctx,38,62,4,6,C2); dr(ctx,18,64,3,4,C1); dr(ctx,43,64,3,4,C1);
  px(ctx,23,60,C3); px(ctx,39,60,C3);
  dr(ctx,6,28,52,18,C0); dr(ctx,8,22,48,14,C1); dr(ctx,12,16,40,12,C2); dr(ctx,16,10,32,10,C2);
  dr(ctx,18,6,28,8,C3); dr(ctx,20,2,24,6,C3); dr(ctx,22,0,20,4,C4);
  dr(ctx,10,26,44,14,C1); dr(ctx,14,20,36,10,C2); dr(ctx,18,14,28,8,C3); dr(ctx,20,8,24,6,C4);
  dr(ctx,22,4,20,4,C4); dr(ctx,24,0,16,4,C5);
  dr(ctx,18,24,12,8,C3); dr(ctx,34,22,12,8,C3); dr(ctx,22,16,16,8,C4); dr(ctx,26,10,12,6,C5);
  dr(ctx,28,4,8,6,C6); dr(ctx,30,0,4,4,CW);
  dr(ctx,29,0,6,2,C6); dr(ctx,30,0,4,1,CW);
  dr(ctx,14,10,6,8,C3); dr(ctx,16,8,4,4,C4); dr(ctx,17,6,2,3,C5);
  dr(ctx,44,8,6,8,C3); dr(ctx,46,6,4,4,C4); dr(ctx,47,4,2,3,C5);
  dr(ctx,8,18,4,6,C2); dr(ctx,9,16,2,3,C3); dr(ctx,52,16,4,6,C2); dr(ctx,53,14,2,3,C3);
  dr(ctx,24,20,6,4,C4); dr(ctx,34,18,6,4,C4); dr(ctx,28,14,8,4,C5); dr(ctx,30,8,4,4,C6);
  dr(ctx,30,6,4,2,CW); px(ctx,31,5,CW); px(ctx,32,5,CW);
  for(const [x,y,c] of [[2,20,C3],[4,14,C4],[2,32,C2],[0,40,C2],[4,48,C3],[58,18,C3],[60,26,C4],[62,34,C2],[60,44,C3],[58,54,C2],[6,56,C2],[8,60,C3],[50,58,C2],[56,62,C3],[10,6,C4],[52,4,C4],[10,12,CA],[52,10,CA]]) {
    const cx = x as number, cy = y as number, cc = c as string;
    if(cx>=0&&cx<64&&cy>=0&&cy<80){ px(ctx,cx,cy,cc); px(ctx,cx+1,cy,cc); px(ctx,cx,cy+1,cc); }
  }
  for(const [x,y,c] of [[26,26,CG],[38,20,CG],[30,12,CG],[20,30,CA],[44,28,CA]]) px(ctx,x as number,y as number,c as string);
}

// ─── Tree metadata ────────────────────────────────────────────────────────────
const TREES = [
  { name:'BARE TREE',    type:'BARE',    tier:'1 / 6', commits:'25',     color:'#aac4d8', desc:'Inactive or brand new account. The tree has shed all its leaves and sleeps under frost, waiting for the first commit of spring.',    draw:drawBareTree    },
  { name:'SAKURA TREE',  type:'SAKURA',  tier:'2 / 6', commits:'130',    color:'#ff9ec7', desc:'A casual contributor. Your tree blossoms with pink petals carried by the wind — beautiful, gentle, full of potential.',             draw:drawSakuraTree  },
  { name:'WILLOW TREE',  type:'WILLOW',  tier:'3 / 6', commits:'350',    color:'#7dd9a8', desc:'A regular developer. Your willow drapes long, lush strands — a developer who shows up consistently and builds steadily.',           draw:drawWillowTree  },
  { name:'OAK TREE',     type:'OAK',     tier:'4 / 6', commits:'720',    color:'#d4a017', desc:'A strong, productive developer. Dense canopy, deep roots. Your oak is a landmark — others can stand in its shade.',                 draw:drawOakTree     },
  { name:'REDWOOD',      type:'REDWOOD', tier:'5 / 6', commits:'1,450',  color:'#ff6030', desc:'A towering presence. Tier upon tier of branches reach the sky. You are a force in the community — prolific and unstoppable.',       draw:drawRedwoodTree },
  { name:'CRYSTAL TREE', type:'CRYSTAL', tier:'6 / 6', commits:'2,800+', color:'#c060ff', desc:'A towering crystalline tree shines above the rest. You are the 0.1% — a monument to dedication.',                               draw:drawCrystalTree },
] as const;

const RANGE_LABELS = ['0–50','51–200','201–500','501–1000','1001–2000','2000+'] as const;
const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const DIVIDER_STYLE: React.CSSProperties = {
  height: '2px',
  background: 'repeating-linear-gradient(90deg,#00ff9d 0,#00ff9d 8px,transparent 8px,transparent 16px)',
  margin: '48px 0',
  opacity: 0.15,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [activeUser, setActiveUser]  = useState('');
  const [activeTier, setActiveTier]  = useState(3);
  const [copied, setCopied]          = useState(false);
  const [imgStatus, setImgStatus]    = useState<'idle'|'loading'|'loaded'|'error'>('idle');

  const tileRefs    = useRef<(HTMLCanvasElement | null)[]>(Array(6).fill(null));
  const previewRef  = useRef<HTMLCanvasElement | null>(null);

  // Draw all 6 tier tiles once on mount
  useEffect(() => {
    TREES.forEach((tree, i) => {
      const c = tileRefs.current[i];
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, 64, 80);
      tree.draw(ctx);
    });
  }, []);

  // Redraw preview canvas when tier changes (only if no user entered yet)
  useEffect(() => {
    if (activeUser) return;
    const c = previewRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 64, 80);
    TREES[activeTier].draw(ctx);
  }, [activeTier, activeUser]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = inputValue.trim();
    if (!u || !USERNAME_RE.test(u)) return;
    setImgStatus('loading');
    setActiveUser(u);
  }

  const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const snippetUser = activeUser || 'username';
  const snippetText = `![Pixel Tree](${BASE}/api/tree?user=${snippetUser})`;

  function copySnippet() {
    navigator.clipboard.writeText(snippetText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  const t = TREES[activeTier];

  return (
    <div className="max-w-[1200px] mx-auto px-6">

      {/* NAV */}
      <nav className="flex items-center justify-between py-5 border-b border-border">
        <div className="font-pixel text-[13px] text-accent flex items-center gap-3"
             style={{ textShadow: '0 0 20px rgba(0,255,157,0.5)' }}>
          <svg width="28" height="28" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
            <rect x="3" y="0" width="2" height="1" fill="#00ff9d" />
            <rect x="2" y="1" width="4" height="1" fill="#00ff9d" />
            <rect x="1" y="2" width="6" height="2" fill="#00cc7a" />
            <rect x="2" y="4" width="4" height="1" fill="#00ff9d" />
            <rect x="3" y="5" width="2" height="3" fill="#7a4820" />
          </svg>
          PIXEL TREE
        </div>
        <ul className="flex gap-7 list-none m-0 p-0">
          <li><a href="#how-it-works" className="text-muted text-[13px] no-underline hover:text-text transition-colors">Docs</a></li>
          <li><a href="/api/tree?user=torvalds" className="text-muted text-[13px] no-underline hover:text-text transition-colors">API</a></li>
          <li><a href="https://github.com" className="text-muted text-[13px] no-underline hover:text-text transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="text-center py-[60px] pb-10">
        <div className="font-pixel text-[8px] text-accent2 border border-accent2 inline-block px-[14px] py-[6px] mb-6 tracking-[2px] animate-pulse-glow">
          ✦ README WIDGET ✦
        </div>
        <h1 className="font-pixel leading-relaxed text-white mb-4"
            style={{ fontSize: 'clamp(16px,2.5vw,26px)' }}>
          YOUR COMMITS<br />
          <span className="text-accent">GROW A TREE</span>
        </h1>
        <p className="text-[15px] text-muted max-w-[480px] mx-auto mb-9 leading-[1.7]">
          Drop your GitHub username and watch your contribution history bloom into a unique pixel art tree. Embed it in any README.
        </p>
      </section>

      {/* INPUT */}
      <div className="max-w-[540px] mx-auto mb-[60px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex border-2 border-border bg-panel transition-all duration-200
                          focus-within:border-accent
                          focus-within:[box-shadow:0_0_0_3px_rgba(0,255,157,0.1),0_0_30px_rgba(0,255,157,0.07)]">
            <div className="flex items-center px-4 text-accent font-vt text-[22px] border-r-2 border-border bg-[rgba(0,255,157,0.03)]">
              @
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="github-username"
              maxLength={39}
              className="flex-1 bg-transparent border-none outline-none text-text font-vt text-[20px] px-4 py-[14px] tracking-[1px] placeholder:text-muted"
            />
            <button type="submit"
              className="bg-accent text-black border-none px-6 font-pixel text-[9px] cursor-pointer whitespace-nowrap hover:bg-[#00e88d] active:scale-[0.98] transition-all">
              GROW ▶
            </button>
          </div>
        </form>
      </div>

      {/* PREVIEW PANEL */}
      <div className="bg-panel border-2 border-border p-9 mb-[60px] flex gap-11 items-center flex-wrap">
        <div className="relative shrink-0 w-[120px] h-[150px] flex items-center justify-center bg-black/40 border-2 border-border">
          {activeUser && imgStatus !== 'error' ? (
            <>
              {imgStatus === 'loading' && (
                <div className="absolute font-pixel text-[7px] text-muted animate-pulse">GROWING…</div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/tree?user=${encodeURIComponent(activeUser)}`}
                alt={`${activeUser}'s pixel tree`}
                width={104} height={130}
                style={{ imageRendering: 'pixelated', opacity: imgStatus === 'loaded' ? 1 : 0, transition: 'opacity 0.3s' }}
                onLoad={() => setImgStatus('loaded')}
                onError={() => setImgStatus('error')}
              />
            </>
          ) : (
            <canvas ref={previewRef} width={64} height={80}
              className="canvas-pixel" style={{ width: '104px', height: '130px' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {imgStatus === 'error' && (
            <p className="font-pixel text-[8px] text-[#ff6060] mb-3 leading-[1.8]">
              COULD NOT LOAD TREE<br />
              <span className="text-muted font-body text-[12px]">Check the username or try again later.</span>
            </p>
          )}
          <h2 className="font-pixel text-[14px] mb-3" style={{ color: t.color }}>{t.name}</h2>
          <p className="text-muted text-[14px] leading-[1.7] mb-5">{t.desc}</p>
          <div className="flex gap-5 mb-[22px] flex-wrap">
            {([['COMMITS/YEAR', activeUser ? '...' : t.commits], ['TIER', t.tier], ['TREE TYPE', t.type]] as const).map(([label, value]) => (
              <div key={label} className="bg-black/30 border border-border px-4 py-[10px]">
                <div className="font-pixel text-[7px] text-muted mb-[6px]">{label}</div>
                <div className="font-vt text-[26px] text-accent">{value}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#050a14] border border-border p-3 px-4 font-vt text-[15px] text-[#6a9fd8] flex items-center justify-between gap-3 overflow-hidden">
            <span className="truncate">{snippetText}</span>
            <button onClick={copySnippet}
              className="shrink-0 border-none px-[14px] py-[6px] font-pixel text-[7px] cursor-pointer whitespace-nowrap transition-all"
              style={{ background: copied ? '#00ff9d' : '#7c5cff', color: copied ? '#000' : '#fff' }}>
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={DIVIDER_STYLE} />
      <p className="font-pixel text-[10px] text-muted tracking-[3px] text-center mb-10">{'// ALL TREE TIERS //'}</p>

      {/* TREE TIER GRID */}
      <div className="grid grid-cols-3 gap-5 mb-[70px] max-[750px]:grid-cols-2">
        {TREES.map((tree, i) => (
          <button key={i} onClick={() => setActiveTier(i)}
            className={`bg-panel border-2 border-border px-4 pt-7 pb-5 relative overflow-hidden text-left cursor-pointer transition-all duration-[250ms] hover:-translate-y-[5px] ${activeTier === i ? '-translate-y-[5px] scale-[1.02]' : ''}`}
            style={activeTier === i ? { borderColor: tree.color, boxShadow: `0 14px 40px ${tree.color}33` } : {}}>
            <span className="absolute top-[10px] right-[10px] font-pixel text-[7px] px-2 py-1 tracking-[1px]"
              style={{ color: tree.color, border: `1px solid ${tree.color}`, background: '#000a' }}>
              {RANGE_LABELS[i]}
            </span>
            <div className="flex justify-center items-end h-[110px] mb-4">
              <canvas ref={(el) => { tileRefs.current[i] = el; }}
                width={64} height={80}
                className="canvas-pixel" style={{ width: '88px', height: '110px' }} />
            </div>
            <div className="font-pixel text-[9px] text-center mb-2" style={{ color: tree.color }}>
              {tree.name}
            </div>
            <div className="font-vt text-[17px] text-muted text-center">
              {RANGE_LABELS[i]} commits
            </div>
          </button>
        ))}
      </div>

      {/* DIVIDER */}
      <div style={DIVIDER_STYLE} />
      <p id="how-it-works" className="font-pixel text-[10px] text-muted tracking-[3px] text-center mb-10">{'// HOW IT WORKS //'}</p>

      {/* STEPS */}
      <div className="grid grid-cols-3 gap-4 mb-[70px] max-[600px]:grid-cols-1">
        {([
          ['01', 'ENTER USERNAME',         'Type any public GitHub username. No login or auth required — we query the public API server-side.'],
          ['02', 'WE FETCH YOUR COMMITS',  'Your past year of contributions is analyzed. The total determines your tree tier automatically.'],
          ['03', 'EMBED IN README',         'Copy the markdown snippet and paste it in your GitHub profile README. The tree updates daily.'],
        ] as const).map(([num, title, body]) => (
          <div key={num} className="border-2 border-border bg-panel p-7 px-5">
            <span className="font-pixel text-[26px] text-accent opacity-20 mb-3 block">{num}</span>
            <h3 className="font-pixel text-[9px] mb-[10px] text-white leading-[1.6]">{title}</h3>
            <p className="text-[13px] text-muted leading-[1.7]">{body}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border py-6 flex items-center justify-between text-[12px] text-muted">
        <span className="font-pixel text-[8px] text-accent">PIXEL TREE</span>
        <span>© 2025 Pixel Tree Studio</span>
      </footer>

    </div>
  );
}
