
# Dr. Pradna × Lokesh — Luxury Digital Wedding Invitation
April 2026 — FlawByte Client Demo

## Quick Deploy to GitHub Pages

### Option 1: GitHub Pages via gh-pages branch (fastest)
```bash
# 1. Create repo on GitHub (e.g., pradna-lokesh-wedding)
git init
git add .
git commit -m "Luxury wedding invitation — April 2026"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pradna-lokesh-wedding.git
git push -u origin main

# 2. Build
npm install
npm run build

# 3. Deploy dist/ to gh-pages
npx gh-pages -d dist
```
Then in GitHub repo Settings → Pages → Source: gh-pages / root

### Option 2: GitHub Actions (recommended)
1. Push this folder to GitHub main branch
2. Add file .github/workflows/deploy.yml:

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

3. Enable Pages: Settings → Pages → Build and deployment → Source: GitHub Actions

### Config
Edit src/App.tsx top WEDDING object to change names/dates/venue.

Your live link will be: https://YOUR_USERNAME.github.io/pradna-lokesh-wedding/
