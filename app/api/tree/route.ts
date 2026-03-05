import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions, GitHubError } from '@/lib/github';
import { getTier } from '@/lib/treeSelector';
import { renderTree } from '@/lib/renderer';
import { renderTreeCard } from '@/lib/cardRenderer';
import { checkRateLimit, getCachedScore, setCachedScore } from '@/lib/rateLimiter';

// Next.js App Router: no static caching — every request is dynamic
export const dynamic = 'force-dynamic';

// Username validation — same regex as lib/github.ts
const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const TREE_NAMES = ['BARE TREE', 'SAKURA TREE', 'WILLOW TREE', 'OAK TREE', 'REDWOOD', 'CRYSTAL TREE'] as const;

function errorPng(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── 1. Parse & validate username ──────────────────────────────────
  const { searchParams } = req.nextUrl;
  const user = searchParams.get('user')?.trim() ?? '';
  const wantsMeta = searchParams.get('meta') === '1' || searchParams.get('format') === 'json';
  const view = searchParams.get('view') === 'card' ? 'card' : 'tree';
  const cardSize = searchParams.get('size') === 'md' ? 'md' : 'sm';

  if (!user) {
    return errorPng('Missing required query parameter: user', 400);
  }
  if (!USERNAME_RE.test(user)) {
    return errorPng(`Invalid GitHub username: "${user}"`, 400);
  }

  // ── 2. Rate limit by IP ───────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';

  const { success: allowed, remaining, reset } = await checkRateLimit(ip);
  if (!allowed) {
    return new NextResponse('Rate limit exceeded. Try again in a minute.', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': String(Math.max(0, Math.ceil((reset - Date.now()) / 1000))),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(reset),
      },
    });
  }

  // ── 3. Fetch contribution score (cache-first) ─────────────────────
  let score: number;

  const cached = await getCachedScore(user);
  if (cached !== null) {
    score = cached;
  } else {
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

  if (wantsMeta) {
    return NextResponse.json(
      {
        user,
        score,
        tier,
        treeName: TREE_NAMES[tier],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      },
    );
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
  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(png.length),
      // Cache for 1 hour in browser / CDN edge; stale-while-revalidate up to 24h
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
      // Tell GitHub (and anyone embedding) this is an image, never sniff
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
