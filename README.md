# GitHub Pixel Tree

<p align="center">
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/background.png" alt="main-image">
  </a>
</p>
 
[Live Link](https://pixel-tree-jet.vercel.app/)

<p align="center">
  <a href="https://github.com/turkishdelightmu/pixel-tree/stargazers">
  <img src="https://img.shields.io/github/stars/turkishdelightmu/pixel-tree?style=flat-square&logo=github&logoColor=white&label=Stars&color=black" alt="GitHub Stars">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree/network/members">
    <img src="https://img.shields.io/github/forks/turkishdelightmu/pixel-tree.svg?style=flat-square&label=Forks" alt="Forks">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree/issues">
    <img src="https://img.shields.io/github/issues/turkishdelightmu/pixel-tree.svg?style=flat-square&label=Issues" alt="Issues">
  </a>
  <a href="https://github.com/sponsors/turkishdelightmu">
    <img src="https://img.shields.io/github/sponsors/turkishdelightmu.svg?style=flat-square&label=Sponsor" alt="Sponsor">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/turkishdelightmu/pixel-tree" alt="License">
  </a>
</p>

Turn your **GitHub contributions** into a **pixel-art tree** 🌳 — with both standalone tree images and profile-friendly cards!

Pixel Tree fetches your last year of GitHub activity and visualizes it as a stylized pixel tree. Whether you’re casually contributing or coding, there’s a tree waiting for you.

## 🎬 Demo / GIF Preview

![Pixel Tree Demo](https://github.com/turkishdelightmu/pixel-tree/blob/main/demo.gif)  
_Watch how your contributions grow into a tree!_

## 🌳 Tier Breakdown

<p align="center">
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/tree-tiers.png" alt="tree-tier">
  </a>
</p>

## 🌳 Tree Types
| Bare | Sakura | Willow |
|-----|-----|-----|
| ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/bare.png) | ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/sakura.png) | ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/willow.png) |

| Oak | Redwood | Crystal |
|-----|-----|-----|
| ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/oak.png) | ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/redwood.png) | ![](https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/crystal.png) |

## 🚀 Quick Start

```bash
git clone https://github.com/turkishdelightmu/pixel-tree.git
cd pixel-tree
npm install
npm run dev
```

Add `.env.local`:

```bash
GH_PAT=<your_github_token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TIER_BOUNDARIES=0,50,200,500,1000,2000
```

Visit `http://localhost:3000` to preview your pixel tree 🌱

### Run Tests

This project includes Jest tests (see `jest.config.ts`). Run them with:

```bash
npm test
```

## ⚙️ TIER_BOUNDARIES 

`TIER_BOUNDARIES` is a comma-separated list of 6 contribution thresholds used to map a score to tree tiers.

Default:

```bash
TIER_BOUNDARIES=0,50,200,500,1000,2000
```

Meaning:

- Tier 0 (`Bare`): score `< 50`
- Tier 1 (`Sakura`): score `>= 50` and `< 200`
- Tier 2 (`Willow`): score `>= 200` and `< 500`
- Tier 3 (`Oak`): score `>= 500` and `< 1000`
- Tier 4 (`Redwood`): score `>= 1000` and `< 2000`
- Tier 5 (`Crystal`): score `>= 2000`

If the variable is missing or invalid, Pixel Tree falls back to the default thresholds.

## 📷 API Usage

### Tree Image

```http
GET /api/tree?user=<github_username>
```

Example:

```http
https://pixel-tree-jet.vercel.app/api/tree?user=turkishdelightmu
```

### Embed Tree Card in GitHub README

![GitHub Pixel Tree](https://pixel-tree-jet.vercel.app/api/tree?user=turkishdelightmu&view=card&v=20260305c)

## 🚀 Future Updates

This roadmap is based on planned PDR future updates.

| Version | Feature        | Description                                                                      |
| ------- | -------------- | -------------------------------------------------------------------------------- |
| v1.1    | Animated SVGs  | Falling petals for Sakura, swaying strands for Willow, glowing pulse for Crystal |
| v1.2    | Theme System   | Light / dark / forest / night background themes via `?theme=` param              |
| v1.3    | Custom Tiers   | User-configurable tier thresholds via query params                               |
| v2.0    | Streak Mode    | Tree health also factors in current streak (days in a row with commits)          |
| v2.1    | Language Trees | Tree species based on most-used programming language                             |
| v2.2    | Seasonal Mode  | Tree automatically changes season based on current month                         |
| v2.3    | OG Image API   | Social preview card with the tree for sharing on Twitter/LinkedIn                |

## 🧭 Issues & Contributor Entry Points

If you want to contribute, start from the Issues page to see active work and open feature requests:

- Issues board: `https://github.com/turkishdelightmu/pixel-tree/issues`
- New bug report: `https://github.com/turkishdelightmu/pixel-tree/issues/new?template=bug_report.md`
- New feature request: `https://github.com/turkishdelightmu/pixel-tree/issues/new?template=feature_request.md`

### Good First Issues

Beginner-friendly tasks are tracked with the `good first issue` label:

- `https://github.com/turkishdelightmu/pixel-tree/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`

Suggested starter contributions:

- Pick issues labeled `good first issue` or `help wanted`.
- If no starter issue exists yet, open a small docs/test improvement issue first and self-assign.
- Reference the roadmap section above when proposing new work so priorities stay aligned.

Maintainer note:

- Add `good first issue` to beginner-safe tasks so new contributors can find them quickly.

## 💖 Contributing

PRs, ideas, and tweaks are welcome! Let’s **grow this pixel forest** together 🌳✨

For the full contribution workflow (fork, branch, local setup, test, and PR submission), see `CONTRIBUTING.md`.

### Commit Message Quality

With a growing history, descriptive commit messages make onboarding and review easier.

- Prefer clear, action-oriented commit titles (for example: `docs: explain TIER_BOUNDARIES thresholds`).
- Audit your branch before opening a PR:

```bash
git log --oneline --decorate -n 20
```

- Squash or rewrite noisy commits when appropriate so history stays readable.

## 📦 Built With

- **Next.js**
- **GitHub GraphQL API**
- **Upstash Redis**
- **Github Copilot**

## 📝 License

MIT License © 2026 [turkishdelightmu](https://github.com/turkishdelightmu)
