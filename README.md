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

- **Work entries** → the `WORKS` array in `js/main.js` (single source of truth).
- **About / contact** → `index.html`.
- **Staff page** → `_private/dev/index.html` (self-contained file).

## Deploy

```bash
npx -y vercel@latest --prod --yes
```

Must be logged into Vercel as `charging-port` (not the personal Google
account). Deploys are manual; pushing to GitHub alone changes nothing.
