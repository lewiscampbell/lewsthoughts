# lewsthoughts

A personal blog built with [Astro](https://astro.build), powered by [Contentful](https://contentful.com). Based on the original [lewsthoughts.com](https://lewsthoughts.com).

## Getting started

You'll need [Node.js](https://nodejs.org/) (v18 or later) installed.

```bash
cp .env.example .env   # then add your Contentful credentials
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

Blog posts are fetched from Contentful at build time. Publish or update a post in Contentful, then rebuild (or trigger a Netlify deploy via webhook) to see changes live.

## Contentful

Posts use the **Blog Post** content type (`blogPost`) in your Contentful space. Required environment variables:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_DELIVERY_TOKEN` — used for production builds
- `CONTENTFUL_PREVIEW_TOKEN` — used locally in dev mode to preview drafts

## Deploy to Netlify

1. Push this repo to GitHub and connect it in Netlify (or point your existing site at this repo).
2. Add the three Contentful env vars under **Site configuration → Environment variables**.
3. Build settings are in `netlify.toml` (`npm run build`, publish `dist/`).
4. Create a **Build hook** in Netlify, then add it as a **Webhook** in Contentful (Settings → Webhooks) so publishing a post triggers a rebuild.

## Project structure

```
src/
├── lib/contentful.ts   # Contentful client and blog helpers
├── components/         # Header, Footer, blog cards
├── layouts/            # Page layout
├── pages/              # Routes (home, blog)
└── styles/             # Global CSS
```
