# Prism64

A private, browser-based studio for converting images to Base64 data URLs and reconstructing images from Base64.

## Features

- Drag-and-drop, file picker, and clipboard image input
- Batch encoding with per-file previews and metadata
- Complete data URLs, raw Base64, and HTML, CSS, Markdown, and JSON snippets
- Base64 and data URL decoding with validation and image download
- Combined JSON export for batch results
- Fully client-side processing with no uploads or accounts
- Responsive Midnight Prism interface with original animated SVG artwork

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```


## Deploy to GitHub Pages

The app is configured with a relative Vite base, so it works from a project URL such as `https://<user>.github.io/<repo>/` without hardcoding the repository name.

1. Create a GitHub repository and push this project to its `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow manually from the Actions tab.

The workflow runs lint, typecheck, tests, and the production build before publishing `dist`. The deployed URL appears in the workflow's deployment environment and in the repository's Pages settings.

For a custom domain, add the domain in **Settings → Pages** and configure the DNS records GitHub provides.

## Stack

React, TypeScript, Vite, Vitest, Testing Library, and custom CSS.
