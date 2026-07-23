# charger.tools

A personal site built as a quiet **editorial index** — small type, one shared
column grid, monochrome, lots of whitespace (after satoshiwatanabe.org and
archivio-uno.com). Hand-coded static HTML/CSS/JS, no framework, no build step.

- **Public:** `charger.tools` — the numbered work index, about, contact.
- **Private:** `dev.charger.tools` — password-protected staff page: quick
  links, deploy checklist, notes, list. (`/dev` and the old `/hq` on the
  main site just redirect there.)

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full map: content model,
design system, auth flow, env vars, and deploy steps.

## Quick start

```bash
python3 -m http.server 3000   # static preview (middleware/auth won't run locally)
```

## Edit content

All public content (works, about, contact) lives in **`content.json`** — the
single source of truth. Two ways to edit:

- **The dev dashboard** (`dev.charger.tools`, section E.) — edit in the
  browser, hit Publish; it commits to GitHub and Vercel auto-deploys.
- **By hand** — edit `content.json`, push to `main` (auto-deploys).

The staff page itself is `_private/dev/index.html` (self-contained file).
Work entries support an optional `media` image (drop files in
`/assets/images/`) shown as a hover preview on the index.

## Deploy

Pushes to `main` on GitHub **auto-deploy** (Vercel↔GitHub link, added
2026-07). Manual fallback:

```bash
npx -y vercel@latest --prod --yes
```

Must be logged into Vercel as `charging-port` (not the personal Google
account).
