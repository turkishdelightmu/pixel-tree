# GitHub Pixel Tree

<p align="center">
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/background.png" alt="main-image">
  </a>
</p>

<p align="center">
  <a href="https://github.com/turkishdelightmu/pixel-tree/stargazers">
    <img src="https://img.shields.io/github/stars/turkishdelightmu/pixel-tree?style=social" alt="Stars">
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

<p align="left">
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/bare.png" alt="bare-tree" width="700">
  </a>
   <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/sakura.png" alt="sakura-tree" width="700">
  </a>
   <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/willow.png" alt="willow-tree" width="700">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/oak.png" alt="oak-tree" width="700">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/redwood.png" alt="redwood-tree" width="700">
  </a>
  <a href="https://github.com/turkishdelightmu/pixel-tree">
    <img src="https://github.com/turkishdelightmu/pixel-tree/blob/main/public/assets/trees/crystal.png" alt="crystal-tree" width="700">
  </a>
</p>

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


![GitHub Pixel Tree Card](https://pixel-tree-jet.vercel.app/api/tree?user=turkishdelightmu&view=card)


## 💖 Contributing

PRs, ideas, and tweaks are welcome! Let’s **grow this pixel forest** together 🌳✨

## 📦 Built With

- **Next.js**
- **GitHub GraphQL API**
- **Upstash Redis**

## 📝 License

MIT License © 2026 [turkishdelightmu](https://github.com/turkishdelightmu)
