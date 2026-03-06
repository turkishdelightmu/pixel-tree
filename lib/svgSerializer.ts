import type { TreeLayer, TreeShape, AnimationType } from './trees/layers';

// Canvas grid is 64×80 units. Scale maps one grid unit → N screen pixels.
const DEFAULT_SCALE = 6; // 384×480 px

// CSS keyframes keyed by AnimationType, parameterised by scale so that
// animation distances always match the grid rather than being hard-coded.
function buildKeyframes(s: number): Record<AnimationType, string> {
  return {
    // Petals fade in at top, drift down, fade out — seamless loop with normal direction.
    fall: `@keyframes pixel-fall{0%{transform:translateY(-${2 * s}px);opacity:0}8%{opacity:.9}85%{opacity:.8}100%{transform:translateY(${16 * s}px);opacity:0}}`,
    // Willow strands swing left ↔ right — alternate direction gives natural pendulum.
    sway: `@keyframes pixel-sway{0%{transform:translateX(-${s}px)}100%{transform:translateX(${s}px)}}`,
    // Particles gently bob up and down.
    float: `@keyframes pixel-float{0%{transform:translateY(0)}100%{transform:translateY(-${2 * s}px)}}`,
    // Sparkles fade in and out.
    twinkle: `@keyframes pixel-twinkle{0%{opacity:.25}100%{opacity:1}}`,
    // Foliage top-layer brightens subtly to simulate light.
    pulse: `@keyframes pixel-pulse{0%{opacity:.82}100%{opacity:1}}`,
    // Snow drifts a pixel or two horizontally.
    drift: `@keyframes pixel-drift{0%{transform:translateX(0)}100%{transform:translateX(${s}px)}}`,
  };
}

// Animation shorthand properties per type.
const ANIM_EXTRA: Record<AnimationType, string> = {
  fall:    'linear infinite normal both',
  sway:    'ease-in-out infinite alternate both',
  float:   'ease-in-out infinite alternate both',
  twinkle: 'ease-in-out infinite alternate both',
  pulse:   'ease-in-out infinite alternate both',
  drift:   'ease-in-out infinite alternate both',
};

const DEFAULT_DURATIONS: Record<AnimationType, number> = {
  fall: 3, sway: 4, float: 3, twinkle: 2, pulse: 6, drift: 5,
};

function shapeToRect(shape: TreeShape, s: number): string {
  if (shape.kind === 'pixel') {
    return `<rect x="${shape.x * s}" y="${shape.y * s}" width="${s}" height="${s}" fill="${shape.color}"/>`;
  }
  return `<rect x="${shape.x * s}" y="${shape.y * s}" width="${shape.width * s}" height="${shape.height * s}" fill="${shape.color}"/>`;
}

// Shared inner builder — returns the <style> block and array of <g> strings.
function buildLayerContent(
  layers: readonly TreeLayer[],
  scale: number,
): { styleBlock: string; groups: string[] } {
  const usedTypes = new Set<AnimationType>();
  for (const layer of layers) {
    if (layer.animation) usedTypes.add(layer.animation.type);
  }

  const kf = buildKeyframes(scale);
  const styleLines: string[] = [];
  Array.from(usedTypes).forEach((type) => styleLines.push(kf[type]));

  const groups: string[] = [];
  for (const layer of layers) {
    const rects = layer.shapes.map((s) => shapeToRect(s, scale)).join('');

    let extra = '';
    if (layer.animation) {
      const { type, duration, delay = 0 } = layer.animation;
      const dur = (duration ?? DEFAULT_DURATIONS[type]).toFixed(1);
      const props = ANIM_EXTRA[type];
      extra = ` style="animation:pixel-${type} ${dur}s ${delay}s ${props}"`;
    }

    groups.push(`<g id="layer-${layer.id}"${extra}>${rects}</g>`);
  }

  return {
    styleBlock: styleLines.length > 0 ? `<style>${styleLines.join('')}</style>` : '',
    groups,
  };
}

/**
 * Converts a tree's layer array into a self-contained animated SVG string.
 *
 * @param layers  Output of any `buildXxxLayers()` function.
 * @param scale   Pixels per grid unit (default 6 → 384×480 px output).
 */
export function serializeTreeToSVG(
  layers: readonly TreeLayer[],
  scale = DEFAULT_SCALE,
): string {
  const w = 64 * scale;
  const h = 80 * scale;
  const { styleBlock, groups } = buildLayerContent(layers, scale);

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">`,
    styleBlock,
    ...groups,
    `</svg>`,
  ].join('\n');
}

/**
 * Returns the animated layer content for embedding inside a larger SVG.
 * Use this instead of `serializeTreeToSVG` when the tree must live inside
 * an outer SVG document (e.g. a card renderer).
 */
export function serializeTreeFragment(
  layers: readonly TreeLayer[],
  scale = DEFAULT_SCALE,
): { styleBlock: string; groupsBlock: string } {
  const { styleBlock, groups } = buildLayerContent(layers, scale);
  return { styleBlock, groupsBlock: groups.join('\n') };
}
