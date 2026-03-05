# Contributing to GitHub Pixel Tree

Thank you for your interest in contributing.

## Prerequisites

- Node.js 18+ (recommended)
- npm
- A GitHub account

## 1) Fork and Clone

1. Fork this repository on GitHub.
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/pixel-tree.git
cd pixel-tree
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/turkishdelightmu/pixel-tree.git
```

## 2) Create a Branch

Create a focused branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feat/<short-description>
```

Examples:

- `feat/add-theme-param`
- `fix/rate-limit-header`
- `docs/readme-roadmap`

## 3) Run the Project Locally

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
GH_PAT=<your_github_token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TIER_BOUNDARIES=0,50,200,500,1000,2000
```

Start the dev server:

```bash
npm run dev
```

## 4) Validate Your Changes

Run tests:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

## 5) Commit and Push

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "docs: add contributor workflow"
git push origin feat/<short-description>
```

## 6) Submit a Pull Request

1. Open a PR from your branch to `turkishdelightmu/pixel-tree:main`.
2. Describe what changed, why it changed, and how it was tested.
3. Link related issues in the PR description (for example: `Closes #123`).
4. Keep PRs focused and reasonably small when possible.

## Good First Issues

Beginner-friendly tasks are tracked in GitHub Issues with the `good first issue` label:

- https://github.com/turkishdelightmu/pixel-tree/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

If there are no open starter tasks, open a small docs/test issue and propose it as a `good first issue`.

## Reporting Bugs and Requesting Features

Use the issue templates:

- Bug report: `.github/ISSUE_TEMPLATE/bug_report.md`
- Feature request: `.github/ISSUE_TEMPLATE/feature_request.md`
