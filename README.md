<p align="center">
  <img src="docs/logo.svg" alt="Prism64 — Image ↔ Base64 studio" width="760">
</p>

<p align="center">
  <a href="https://prism-64.github.io/prism-64/">
    <img alt="Live app" src="https://img.shields.io/badge/Live_App-prism--64-67E8F9?style=for-the-badge&logo=github&logoColor=white">
  </a>
  <a href="https://github.com/prism-64/prism-64/actions/workflows/deploy.yml">
    <img alt="Deploy to GitHub Pages" src="https://github.com/prism-64/prism-64/actions/workflows/deploy.yml/badge.svg?branch=main">
  </a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="100% local processing" src="https://img.shields.io/badge/Privacy-100%25_local-34D399?style=for-the-badge">
</p>

<p align="center">
  <strong><a href="https://prism-64.github.io/prism-64/">Open the live app →</a></strong>
  <br>
  A private, browser-based studio for converting images to Base64 data URLs and reconstructing images from Base64.
</p>

## Why Prism64

Prism64 is a fast, focused workbench for moving between images and Base64 without uploading anything. Drop in a batch, copy a complete data URL or raw Base64, and paste Base64 back in to rebuild the original image.

Everything runs in the browser. There is no backend, no account, and no analytics on your files.

## Features

- Drag-and-drop, file picker, and clipboard image input
- Batch encoding with per-file previews, dimensions, and size metadata
- Complete data URLs, raw Base64, and HTML, CSS, Markdown, and JSON snippets
- Base64 and data URL decoding with validation, preview, and image download
- Combined JSON export for batch results
- Fully client-side processing with no uploads or accounts
- Responsive Midnight Prism interface with original animated SVG artwork
- Keyboard-accessible controls, reduced-motion support, and clear error states

## Quick start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy to GitHub Pages

The live app is available at **[prism-64.github.io/prism-64](https://prism-64.github.io/prism-64/)**.

The repository is configured with a relative Vite base, so it works from a project URL without hardcoding the repository name. The deployment workflow runs lint, typecheck, tests, and the production build before publishing `dist`.

To deploy a fork:

1. Push the project to a GitHub repository's `main` branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow manually from the Actions tab.

For a custom domain, add the domain in **Settings → Pages** and configure the DNS records GitHub provides.

## Stack

React, TypeScript, Vite, Vitest, Testing Library, Lucide icons, and custom CSS.
