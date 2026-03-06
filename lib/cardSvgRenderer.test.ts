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
    expect(svg).toContain('@testuser');
  });

  test('includes tree name text', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 130, tier: 1 });
    expect(svg).toContain('SAKURA TREE');
  });

  test('includes score in stats block', () => {
    const svg = renderTreeCardSVG({ username: 'u', score: 1234, tier: 3 });
    expect(svg).toContain('>1234<');
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
    expect(renderTreeCardSVG({ username: 'u', score: 0, tier: -1 })).toContain('BARE TREE');
    expect(renderTreeCardSVG({ username: 'u', score: 0, tier: 99 })).toContain('CRYSTAL TREE');
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
    expect(svg).toContain('COMMITS/YEAR');
    expect(svg).toContain('TIER');
    expect(svg).toContain('TYPE');
  });
});
