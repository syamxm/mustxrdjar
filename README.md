# mustxrdjar

Portfolio site for the artist **mustxrdjar** — 15 painted works and 7 non-painted, plus commissions.

Astro, static output, plain CSS with custom properties, vanilla JS. Two runtime dependencies: `astro` and `sharp`.

Live at **https://mustxrdjar.syamxm.com**

## Requirements

Node **24.20.0** (pinned in `.node-version`; Astro 7 requires ≥ 22.12).

```
npm install
```

## Working locally

**To look at the site, use `preview`, not `dev`:**

```
npm run build
npm run preview
```

Both bind `127.0.0.1:4321`, so the same SSH tunnel works either way:

```
ssh -L 4321:127.0.0.1:4321 <user>@<host>
```

`npm run dev` re-encodes every image with sharp on **every request** and does not cache between reloads. Measured on this project: ~8.7 CPU-seconds per page load with AVIF enabled, versus 0 for the built site served statically. AVIF is therefore gated to production builds only (`import.meta.env.DEV` in `src/components/ArtSticker.astro`), which brings dev down to ~1.4 CPU-seconds. Use `dev` while editing files; use `preview` for looking at the result.

Astro 7 runs the dev server as a background daemon:

```
npx astro dev          # start
npx astro dev status   # running? pid? uptime?
npx astro dev logs     # tail output
npx astro dev stop     # stop — Ctrl+C alone may not
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages via the official Pages actions. No other branch deploys. `workflow_dispatch` allows a manual run from the Actions tab.

The repo must be public, or on a paid plan — GitHub Pages does not publish from a private repo on the Free plan.

### One-time GitHub setup

1. **Settings → Pages → Build and deployment → Source:** set to **GitHub Actions**. Not "Deploy from a branch".
2. **Settings → Pages → Custom domain:** `mustxrdjar.syamxm.com`. It usually auto-populates from `public/CNAME`, which is copied into the build output.
3. Wait for the certificate to be issued, then tick **Enforce HTTPS** on the same page. It stays greyed out until the cert exists.

### One-time Cloudflare DNS setup

Create one record in the Cloudflare dashboard:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `mustxrdjar` | `syamxm.github.io` | **DNS only** (grey cloud) |

Start it **DNS only**. GitHub cannot complete its ACME challenge and issue the certificate through Cloudflare's proxy. Once "Enforce HTTPS" is available and ticked in GitHub, you can switch the record to proxied (orange cloud) if you want Cloudflare in front — the site works either way.

## Layout

```
art/                    the 22 artworks — the only images that ship
  painted/              15
  non-painted/          7
public/
  fonts/                self-hosted woff2, latin subset
  favicon.svg           hand-drawn star
  CNAME                 custom domain
src/
  components/           Sticker, ArtSticker, Badge, Gallery, Lightbox, Hero, About, Contact, Footer
  data/
    artworks.js         globs art/, assigns plate colour and rotation deterministically
    alt.js              alt text keyed by slug
  layouts/Base.astro
  pages/index.astro
  styles/               tokens.css, base.css, fonts.css (generated)
licenses/               font licence texts
CREDITS.md              typefaces and their licences
TODO.md                 placeholders and decisions still outstanding
reference/              mood boards — gitignored, not shipped
```

## Known issues

- Lighthouse has not been run — no Chromium in the development environment used to build this.

## Build note: pruning

Vite emits every original artwork into `dist/_astro/` because `import.meta.glob` in `src/data/artworks.js` holds a direct asset reference to each one, even though no HTML ever points at them — about 7.3 MB of dead weight. This is not affected by where the files live; it is inherent to importing them.

`integrations/prune-unused-images.mjs` runs on `astro:build:done`, scans every generated HTML/CSS/JS file for each emitted image filename, and deletes the ones nothing references. It reports what it removed:

```
[prune-unused-images] pruned 22 unreferenced images (7.33 MB)
```

It only ever deletes files whose names appear nowhere in the build output, so anything reachable — including the lightbox sources held in `data-full` attributes — is kept.
