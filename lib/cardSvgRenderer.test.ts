import { renderTreeCardSVG } from './cardSvgRenderer';

describe('renderTreeCardSVG', () => {
  const defaults = { username: 'testuser', score: 200, tier: 1 }; // sakura

  test('returns a valid SVG string', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain('<svg ');
    expect(svg).toContain('</svg>');
  });

  test('card has correct dimensions (420×152)', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('width="420"');
    expect(svg).toContain('height="152"');
  });

  test('includes username in aria-label and body', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('aria-label="GitHub Pixel Tree for @testuser"');
  });

  test('includes tree name text', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 130, tier: 1 });
    expect(svg).toContain('fill="#ff9ec7"');
  });

  test('includes score in stats block', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 1234, tier: 3 });
    expect(svg).toContain('fill="#00ff9d"');
  });

  test('includes animated tree layer groups', () => {
    const svg = renderTreeCardSVG(defaults); // tier 1 = sakura
    expect(svg).toContain('id="layer-petals"');
    expect(svg).toContain('animation:pixel-fall');
    expect(svg).toContain('@keyframes pixel-fall');
  });

  test('animation keyframes use animScale=4 distances (not invisible 1px)', () => {
    // sway at animScale=4 should be ±4px, not ±1px
    const svg = renderTreeCardSVG({ username: 'u', score: 300, tier: 2 }); // willow → sway
    expect(svg).toContain('translateX(-4px)');
    expect(svg).toContain('translateX(4px)');
    // fall at animScale=4 should reach 64px (4*16), not 16px (1*16)
    const svgFall = renderTreeCardSVG({ username: 'u', score: 10, tier: 0 }); // bare → fall
    expect(svgFall).toContain('translateY(64px)');
  });

  test('embeds tree inside a translate transform at correct position', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('translate(26,36)');
  });

  test('includes CRT scanlines pattern', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('id="sl"');
    expect(svg).toContain('fill="url(#sl)"');
  });

  test('all 6 tiers render without error', () => {
    for (let tier = 0; tier <= 5; tier++) {
      expect(() => renderTreeCardSVG({ username: 'u', score: 100, tier })).not.toThrow();
    }
  });

  test('clamps out-of-range tier to valid range', () => {
    const bare = renderTreeCardSVG({ username: 'u', score: 0, tier: -1 });
    expect(bare).toContain('id="layer-snow"');
    expect(bare).toContain('id="layer-snowfall"');

    const crystal = renderTreeCardSVG({ username: 'u', score: 0, tier: 99 });
    expect(crystal).toContain('id="layer-particles"');
    expect(crystal).toContain('id="layer-sparkles"');
  });

  test('escapes XML special characters in username', () => {
    const svg = renderTreeCardSVG({ username: 'user&amp', score: 100, tier: 0 });
    expect(svg).not.toMatch(/user&amp(?!;)/); // no bare &
    expect(svg).toContain('user&amp;amp');
  });

  test('crystal tier includes float and twinkle animations', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 3000, tier: 5 });
    expect(svg).toContain('animation:pixel-float');
    expect(svg).toContain('animation:pixel-twinkle');
  });

  test('willow tier includes sway animation', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 300, tier: 2 });
    expect(svg).toContain('animation:pixel-sway');
  });

  test('bare tree includes drift and fall animations', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 10, tier: 0 });
    expect(svg).toContain('animation:pixel-drift');
    expect(svg).toContain('animation:pixel-fall');
  });

  test('contains stat labels COMMITS/YEAR, TIER, TYPE', () => {
    const svg = renderTreeCardSVG(defaults);
    expect(svg).toContain('<rect x="116" y="52" width="91" height="44"');
    expect(svg).toContain('<rect x="215" y="52" width="91" height="44"');
    expect(svg).toContain('<rect x="314" y="52" width="91" height="44"');
  });

  test('matches PNG card typography layout', () => {
    const svg = renderTreeCardSVG({ username: 'turkishdelightmu', score: 115, tier: 1 });
    expect(svg).not.toContain("'Courier New', Courier, monospace");
    expect(svg).toContain(`font-family="'Helvetica Neue', Arial, sans-serif"`);
    expect(svg).toContain('fill="#ff9ec7"');
    expect(svg).toContain('fill="#6a9fd8"');
    expect(svg).toContain('fill="#4a6080"');
  });
});

describe('theme support', () => {
  test('dark theme is default when no theme passed', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0 });
    expect(svg).toContain('fill="#0a0e1a"');
  });

  test('dark theme is explicit when theme=dark', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'dark' });
    expect(svg).toContain('fill="#0a0e1a"');
  });

  test('light theme sets white background', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'light' });
    expect(svg).toContain('fill="#ffffff"');
  });

  test('light theme uses emerald #059669 for stat values', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'light' });
    expect(svg).toContain('fill="#059669"');
  });

  test('light theme disables scanlines', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'light' });
    expect(svg).toContain('fill-opacity="0"');
  });

  test('light theme uses github border color #d0d7de', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'light' });
    expect(svg).toContain('#d0d7de');
  });

  test('dark theme still has scanlines', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 100, tier: 0, theme: 'dark' });
    expect(svg).toContain('fill-opacity="0.035"');
  });
});
