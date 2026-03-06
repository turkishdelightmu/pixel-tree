import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions, GitHubError } from '@/lib/github';
import { getTier } from '@/lib/treeSelector';
import { renderTree } from '@/lib/renderer';
import { renderTreeCard } from '@/lib/cardRenderer';
import { checkRateLimit } from '@/lib/rateLimiter';
import { getCachedScore, setCachedScore } from '@/lib/scoreCache';
import { validateUsername } from '@/lib/githubUsername';
import { isValidTreeTier, buildTreeLayers } from '@/lib/trees';
import { TREE_METADATA } from '@/lib/treeMetadata';
import { serializeTreeToSVG } from '@/lib/svgSerializer';
import { renderTreeCardSVG } from '@/lib/cardSvgRenderer';

// Next.js App Router: no static caching — every request is dynamic
export const dynamic = 'force-dynamic';

type ResponseFormat = 'png' | 'json' | 'svg';

function svgResponse(svg: string, cacheControl: string): NextResponse {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function errorPng(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function parseResponseFormat(searchParams: URLSearchParams): ResponseFormat | null {
  if (searchParams.get('meta') === '1') {
    return 'json';
  }

  const format = searchParams.get('format');
  if (!format || format === 'png') {
    return 'png';
  }
  if (format === 'json') {
    return 'json';
  }
  if (format === 'svg') {
    return 'svg';
  }

  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── 1. Parse & validate username ──────────────────────────────────
  const { searchParams } = req.nextUrl;
  const rawPreviewTier = searchParams.get('previewTier');
  let previewTier: number | null = null;
  if (rawPreviewTier !== null) {
    if (!/^\d+$/.test(rawPreviewTier)) {
      return errorPng('Invalid preview tier', 400);
    }
    previewTier = Number.parseInt(rawPreviewTier, 10);
  }
  const user = searchParams.get('user')?.trim() ?? '';
  const responseFormat = parseResponseFormat(searchParams);
  const view = searchParams.get('view') === 'card' ? 'card' : 'tree';
  const cardSize = searchParams.get('size') === 'md' ? 'md' : 'sm';
  const rawTheme = searchParams.get('theme');
  if (rawTheme !== null && rawTheme !== 'dark' && rawTheme !== 'light') {
    return errorPng('Invalid theme. Use dark or light.', 400);
  }
  const theme = rawTheme === 'light' ? 'light' : 'dark' as const;

  if (!responseFormat) {
    return errorPng('Unsupported format. Use png, json or svg.', 400);
  }

  if (previewTier !== null) {
    if (!isValidTreeTier(previewTier)) {
      return errorPng('Invalid preview tier', 400);
    }

    if (responseFormat === 'json') {
      return NextResponse.json({
        preview: true,
        tier: previewTier,
        treeName: TREE_METADATA[previewTier].name,
      });
    }

    if (responseFormat === 'svg') {
      try {
        const svg = view === 'card'
          ? renderTreeCardSVG({
              username: 'preview',
              score: TREE_METADATA[previewTier].previewCommitsValue,
              tier: previewTier,
              theme,
            })
          : serializeTreeToSVG(buildTreeLayers(previewTier));
        const svgCache = view === 'card'
          ? 'public, max-age=60, stale-while-revalidate=300'
          : 'public, max-age=3600, stale-while-revalidate=86400';
        return svgResponse(svg, svgCache);
      } catch (err) {
        console.error('[api/tree] preview svg render error:', err);
        return errorPng('Failed to render preview SVG', 500);
      }
    }

    try {
      const previewPng = view === 'card'
        ? await renderTreeCard({
            username: 'preview',
            score: TREE_METADATA[previewTier].previewCommitsValue,
            tier: previewTier,
            size: cardSize,
          })
        : await renderTree(previewTier);

      return new NextResponse(new Uint8Array(previewPng), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': String(previewPng.length),
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (err) {
      console.error('[api/tree] preview render error:', err);
      return errorPng('Failed to render preview tree', 500);
    }
  }

  const usernameValidationError = validateUsername(user);
  if (usernameValidationError) {
    return errorPng(usernameValidationError, 400);
  }

  // ── 2. Fetch contribution score (cache-first) ─────────────────────
  let score: number;
  let remaining: number | null = null;
  let reset: number | null = null;
  const cached = await getCachedScore(user);
  if (cached !== null) {
    score = cached;
  } else {
    // Rate limiting protects GitHub API usage. Cached users skip this check.
    const forwardedFor = req.headers.get('x-forwarded-for');
    const forwardedIp = forwardedFor?.split(',').pop()?.trim();
    const ip = req.ip ?? forwardedIp ?? req.headers.get('x-real-ip') ?? '127.0.0.1';
    const { success: allowed, remaining: rlRemaining, reset: rlReset, reason } = await checkRateLimit(ip);

    if (reason === 'unavailable') {
      return new NextResponse('Rate limiting service unavailable. Try again shortly.', {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Retry-After': '60',
        },
      });
    }

    if (!allowed) {
      return new NextResponse('Rate limit exceeded. Try again in a minute.', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Retry-After': String(Math.max(0, Math.ceil((rlReset - Date.now()) / 1000))),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rlReset),
        },
      });
    }

    remaining = rlRemaining;
    reset = rlReset;

    try {
      score = await fetchContributions(user);
      await setCachedScore(user, score);
    } catch (err) {
      if (err instanceof GitHubError) {
        return errorPng(err.message, err.status);
      }
      console.error('[api/tree] unexpected error fetching contributions:', err);
      return errorPng('Internal server error', 500);
    }
  }

  // ── 4. Map score → tier → PNG ─────────────────────────────────────
  const tier = getTier(score);

  if (!isValidTreeTier(tier) || tier >= TREE_METADATA.length) {
    console.error('[api/tree] invalid tier computed:', { score, tier, user });
    return errorPng('Failed to determine tree tier', 500);
  }

  if (responseFormat === 'json') {
    const jsonHeaders: Record<string, string> = {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    };
    if (remaining !== null && reset !== null) {
      jsonHeaders['X-RateLimit-Remaining'] = String(remaining);
      jsonHeaders['X-RateLimit-Reset'] = String(reset);
    }

    return NextResponse.json(
      {
        user,
        score,
        tier,
        treeName: TREE_METADATA[tier].name,
      },
      {
        status: 200,
        headers: jsonHeaders,
      },
    );
  }

  if (responseFormat === 'svg') {
    try {
      const svg = view === 'card'
        ? renderTreeCardSVG({ username: user, score, tier, theme })
        : serializeTreeToSVG(buildTreeLayers(tier));
      const svgCache = view === 'card'
        ? 'public, max-age=60, stale-while-revalidate=300'
        : 'public, max-age=3600, stale-while-revalidate=86400';
      return svgResponse(svg, svgCache);
    } catch (err) {
      console.error('[api/tree] svg render error:', err);
      return errorPng('Failed to render SVG', 500);
    }
  }

  let png: Buffer;
  try {
    png = view === 'card'
      ? await renderTreeCard({ username: user, score, tier, size: cardSize })
      : await renderTree(tier);
  } catch (err) {
    console.error('[api/tree] render error:', err);
    return errorPng('Failed to render tree', 500);
  }

  // ── 5. Return PNG with caching headers ────────────────────────────
  // NextResponse BodyInit requires Uint8Array/ArrayBuffer, not Node Buffer
  const imageCacheControl = view === 'card'
    ? 'public, max-age=60, stale-while-revalidate=300'
    : 'public, max-age=3600, stale-while-revalidate=86400';

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(png.length),
      'Cache-Control': imageCacheControl,
      // Tell GitHub (and anyone embedding) this is an image, never sniff
      'X-Content-Type-Options': 'nosniff',
      ...(remaining !== null && reset !== null
        ? {
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
          }
        : {}),
    },
  });
}
