# GitHub Pixel Tree

Turn a GitHub username into a pixel-art tree (or card) based on the last year of contributions.

This project provides:

- A public API endpoint that returns PNG images.
- A card mode designed for profile README embedding.
- A demo UI (`app/page.tsx`) to preview tiers and copy embed markdown.

## What Is Implemented

- GitHub GraphQL integration (`lib/github.ts`) to fetch 1-year contribution totals.
- Tier mapping (`lib/treeSelector.ts`) with configurable boundaries.
- 6 pixel tree tiers (`lib/trees/*`).
- Image rendering (`lib/renderer.ts`) and card rendering (`lib/cardRenderer.ts`).
- API route (`app/api/tree/route.ts`) with:
  - `view=tree|card`
  - `size=sm|md` for card mode
  - `meta=1` or `format=json` for JSON metadata
  - per-IP rate limiting + username score caching via Upstash (fails open if unavailable)

## Tree Tiers

Default contribution boundaries:

- Tier 0: `0-49` -> `BARE TREE`
- Tier 1: `50-199` -> `SAKURA TREE`
- Tier 2: `200-499` -> `WILLOW TREE`
- Tier 3: `500-999` -> `OAK TREE`
- Tier 4: `1000-1999` -> `REDWOOD`
- Tier 5: `2000+` -> `CRYSTAL TREE`

You can override these with `TIER_BOUNDARIES`.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local` in the project root.

```env
# Required
GH_PAT=<your_github_pat>

# Optional (recommended for production)
UPSTASH_REDIS_REST_URL=<your_upstash_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_redis_token>

# Optional
NEXT_PUBLIC_BASE_URL=<your_deployment_url>
TIER_BOUNDARIES=0,50,200,500,1000,2000
```

3. Start dev server.

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## API Usage

Base endpoint:

```text
GET /api/tree?user=<github_username>
```

Query params:

- `user` (required): GitHub username.
- `view` (optional): `tree` (default) or `card`.
- `size` (optional, card only): `sm` (default) or `md`.
- `meta=1` or `format=json` (optional): returns JSON metadata instead of PNG.

Examples:

```text
/api/tree?user=torvalds
/api/tree?user=torvalds&view=card
/api/tree?user=torvalds&view=card&size=md
/api/tree?user=torvalds&meta=1
```

Example JSON response:

```json
{
  "user": "torvalds",
  "score": 1234,
  "tier": 4,
  "treeName": "REDWOOD"
}
```

## Step-By-Step: Add The Card To Your README

Use these steps if you want to embed the implemented card in your profile or repository README.

1. Deploy this project (or use an existing deployment URL).
2. Pick your base URL, for example `https://pixel-tree-jet.vercel.app`.
3. Build your card image URL:

```text
https://pixel-tree-jet.vercel.app/api/tree?user=<your_username>&view=card
```

4. Paste this markdown into your `README.md`:

```md
![GitHub Pixel Tree Card](https://pixel-tree-jet.vercel.app/api/tree?user=your_username&view=card)
```

5. Optional: use the larger card with `size=md`:

```md
![GitHub Pixel Tree Card](https://pixel-tree-jet.vercel.app/api/tree?user=your_username&view=card&size=md)
```

6. Commit and push your README changes. GitHub will render the card automatically.

## Step-By-Step: Implement Or Extend Card Rendering (Contributors)

Use these steps if you want to modify how cards are generated in this repository.

1. Open `lib/cardRenderer.ts`.
2. Update card constants (`TREE_NAMES`, colors, size presets, text blocks) or drawing logic.
3. Keep return type as PNG buffer (`canvas.toBuffer('image/png')`).
4. Confirm API route still calls card renderer in `app/api/tree/route.ts`:

```ts
png =
  view === "card"
    ? await renderTreeCard({ username: user, score, tier, size: cardSize })
    : await renderTree(tier);
```

5. Run locally and test card endpoints:

```text
/api/tree?user=torvalds&view=card
/api/tree?user=torvalds&view=card&size=md
```

6. Validate UI copy flow on `app/page.tsx` (it generates README snippet text).
7. Run tests:

```bash
npm test
```

## Scripts

- `npm run dev` -> start local Next.js app.
- `npm run build` -> production build.
- `npm run start` -> run production server.
- `npm run lint` -> lint project.
- `npm test` -> run Jest tests.

## Notes

- The API is dynamic (`force-dynamic`) and returns caching headers for image/meta responses.
- Upstash Redis is optional at runtime; rate limiting/cache will fail open when Redis is unavailable.
