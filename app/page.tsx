'use client';

import Image from 'next/image';
import { useState } from 'react';
import { validateUsername } from '@/lib/githubUsername';
import { MAX_TREE_TIER, TREE_METADATA } from '@/lib/treeMetadata';

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
  const [activeScore, setActiveScore] = useState<number | null>(null);
  const [copyStatus, setCopyStatus]  = useState<'idle' | 'copied' | 'error'>('idle');
  const [imgStatus, setImgStatus]    = useState<'idle'|'loading'|'loaded'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = inputValue.trim();
    if (validateUsername(u)) return;

    setActiveScore(null);
    setImgStatus('loading');
    try {
      const res = await fetch(`/api/tree?user=${encodeURIComponent(u)}&format=json`, { cache: 'no-store' });
      if (!res.ok) {
        setActiveUser(u);
        setImgStatus('error');
        return;
      }

      const data = (await res.json()) as { score?: number; tier?: number };
      if (typeof data.score === 'number') setActiveScore(data.score);
      if (typeof data.tier === 'number' && data.tier >= 0 && data.tier <= MAX_TREE_TIER) {
        setActiveTier(data.tier);
      }
      setActiveUser(u);
    } catch {
      setActiveUser(u);
      setImgStatus('error');
    }
  }

  const envBase = process.env.NEXT_PUBLIC_BASE_URL?.trim() ?? '';
  const BASE = (envBase && !envBase.includes('localhost') && !envBase.includes('127.0.0.1'))
    ? envBase.replace(/\/$/, '')
    : 'https://pixel-tree-jet.vercel.app';
  const snippetUser = activeUser || 'username';
  const snippetText = [
    `<picture>`,
    `  <source media="(prefers-color-scheme: dark)" srcset="${BASE}/api/tree?user=${snippetUser}&view=card&format=svg&theme=dark" />`,
    `  <source media="(prefers-color-scheme: light)" srcset="${BASE}/api/tree?user=${snippetUser}&view=card&format=svg&theme=light" />`,
    `  <img alt="GitHub Pixel Tree" src="${BASE}/api/tree?user=${snippetUser}&view=card&format=svg&theme=dark" />`,
    `</picture>`,
  ].join('\n');

  function copySnippet() {
    navigator.clipboard.writeText(snippetText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(() => {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  }

  const t = TREE_METADATA[activeTier];

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
          GITHUB PIXEL TREE
        </div>
        <ul className="flex gap-7 list-none m-0 p-0">
          <li><a href="#how-it-works" className="text-muted text-[13px] no-underline hover:text-text transition-colors">Docs</a></li>
          <li><a href="/api/tree?user=torvalds" className="text-muted text-[13px] no-underline hover:text-text transition-colors">API</a></li>
          <li><a href="https://github.com/turkishdelightmu/pixel-tree" className="text-muted text-[13px] no-underline hover:text-text transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="text-center py-[60px] pb-10">
        <div className="font-pixel text-[8px] text-accent2 border border-accent2 inline-block px-[14px] py-[6px] mb-6 tracking-[2px] animate-pulse-glow">
          ✦ README WIDGET ✦
        </div>
        <h1 className="font-pixel text-white mb-5 leading-[1.4]"
            style={{ fontSize: 'clamp(24px,4.2vw,44px)' }}>
          YOUR COMMITS<br />
          <span className="text-accent">GROW A TREE</span>
        </h1>
          <p className="text-muted max-w-[680px] mx-auto mb-9 leading-[1.7]"
            style={{ fontSize: 'clamp(14px,1.25vw,18px)' }}>
          Drop your GitHub username and watch your contribution history bloom into a unique pixel art tree. Embed it in any README.
        </p>
      </section>

      {/* INPUT */}
      <div className="max-w-[540px] mx-auto mb-[60px]">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex border-2 border-border bg-panel transition-all duration-200
                          focus-within:border-accent
                          focus-within:[box-shadow:0_0_0_3px_rgba(0,255,157,0.1),0_0_30px_rgba(0,255,157,0.07)]">
            <div className="flex items-center px-4 text-accent font-vt text-[20px] border-r-2 border-border bg-[rgba(0,255,157,0.03)]">
              @
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="github-username"
              maxLength={39}
              className="flex-1 bg-transparent border-none outline-none text-text font-vt text-[18px] px-4 py-[14px] tracking-[1px] placeholder:text-muted"
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
          {activeUser && imgStatus === 'loaded' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-pixel text-[6px] px-[6px] py-[3px] bg-black/80 tracking-[1px]"
              style={{ color: '#00ff9d', border: '1px solid #00ff9d44' }}>
              ANIMATED
            </span>
          )}
          {activeUser && imgStatus !== 'error' ? (
            <>
              {imgStatus === 'loading' && (
                <div className="absolute font-pixel text-[7px] text-muted animate-pulse">GROWING…</div>
              )}
              {/* SVG src triggers CSS animations in the browser */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/tree?user=${encodeURIComponent(activeUser)}&format=svg`}
                alt={`${activeUser}'s pixel tree`}
                width={104} height={130}
                style={{ imageRendering: 'pixelated', opacity: imgStatus === 'loaded' ? 1 : 0, transition: 'opacity 0.3s' }}
                onLoad={() => setImgStatus('loaded')}
                onError={() => setImgStatus('error')}
              />
            </>
          ) : (
            <Image
              unoptimized
              src={`/api/tree?previewTier=${activeTier}`}
              alt={`${t.name.toLowerCase()} preview`}
              width={104}
              height={130}
              className="canvas-pixel"
              style={{ width: '104px', height: '130px' }}
            />
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
          <p className="text-muted text-[14px] leading-[1.7] mb-5">{t.pageDescription}</p>
          <div className="flex gap-5 mb-[22px] flex-wrap">
            {([
              ['COMMITS/YEAR', activeScore !== null ? activeScore.toLocaleString() : activeUser ? '...' : t.previewCommitsLabel],
              ['TIER', t.tierLabel],
              ['TREE TYPE', t.type],
            ] as const).map(([label, value]) => (
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
              style={{ background: copyStatus === 'copied' ? '#00ff9d' : copyStatus === 'error' ? '#ff6060' : '#7c5cff', color: copyStatus === 'copied' ? '#000' : '#fff' }}>
              {copyStatus === 'copied' ? 'COPIED!' : copyStatus === 'error' ? 'FAILED' : 'COPY'}
            </button>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={DIVIDER_STYLE} />
      <p id="how-it-works" className="font-pixel text-[10px] text-muted tracking-[3px] text-center mb-10">{'// HOW IT WORKS //'}</p>

      {/* STEPS */}
      <div className="grid grid-cols-3 gap-4 mb-[70px] max-[600px]:grid-cols-1">
        {([
          ['01', 'ENTER USERNAME',         'Type any public GitHub username. No login or auth required — we query the public API server-side.'],
          ['02', 'WE FETCH YOUR COMMITS',  'Your past year of contributions is analyzed. The total determines your tree tier automatically.'],
          ['03', 'EMBED IN README',         'Copy the HTML snippet and paste it in your GitHub profile README. GitHub automatically shows the dark or light card based on the viewer\'s theme.'],
        ] as const).map(([num, title, body]) => (
          <div key={num} className="border-2 border-border bg-panel p-7 px-5">
            <span className="font-pixel text-[26px] text-accent opacity-20 mb-3 block">{num}</span>
            <h3 className="font-pixel text-[9px] mb-[10px] text-white leading-[1.6]">{title}</h3>
            <p className="text-[13px] text-muted leading-[1.7]">{body}</p>
          </div>
        ))}
      </div>

      {/* DIVIDER */}
      <div style={DIVIDER_STYLE} />
      <p className="font-pixel text-[10px] text-muted tracking-[3px] text-center mb-10">{'// ALL TREE TIERS //'}</p>

      {/* TREE TIER GRID */}
      <div className="grid grid-cols-3 gap-5 mb-[70px] max-[750px]:grid-cols-2">
        {TREE_METADATA.map((tree, i) => (
          <button key={i} onClick={() => setActiveTier(i)}
            className={`bg-panel border-2 border-border px-4 pt-7 pb-5 relative overflow-hidden text-left cursor-pointer transition-all duration-[250ms] hover:-translate-y-[5px] ${activeTier === i ? '-translate-y-[5px] scale-[1.02]' : ''}`}
            style={activeTier === i ? { borderColor: tree.color, boxShadow: `0 14px 40px ${tree.color}33` } : {}}>
            <span className="absolute top-[10px] right-[10px] font-pixel text-[7px] px-2 py-1 tracking-[1px]"
              style={{ color: tree.color, border: `1px solid ${tree.color}`, background: '#000a' }}>
              {tree.rangeLabel}
            </span>
            <div className="flex justify-center items-end h-[110px] mb-4">
              <Image
                unoptimized
                src={`/api/tree?previewTier=${i}`}
                alt={`${tree.name.toLowerCase()} tier preview`}
                width={88}
                height={110}
                className="canvas-pixel"
                style={{ width: '88px', height: '110px' }}
              />
            </div>
            <div className="font-pixel text-[9px] text-center mb-2" style={{ color: tree.color }}>
              {tree.name}
            </div>
            <div className="font-vt text-[17px] text-muted text-center">
              {tree.rangeLabel} commits
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border py-6 flex items-center justify-between text-[12px] text-muted">
        <span className="font-pixel text-[8px] text-accent">GITHUB PIXEL TREE</span>
        <span>© 2026 turkishdelightmu</span>
      </footer>

    </div>
  );
}
