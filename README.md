# charger.tools

A personal site printed as a **thermal receipt** — one long strip of paper on
a dark counter. Hand-coded static HTML/CSS/JS, no framework, no build step.

- **Public:** `charger.tools` — the receipt: numbered work index, about,
  contact, barcode, `TOTAL ..... NO CHARGE`.
- **Private:** `charger.tools/hq` (and `hq.charger.tools` once DNS is set) —
  password-protected staff dashboard: quick links, deploy checklist, notes,
  todo register.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full map: content model,
design system, auth flow, env vars, and deploy steps.

## Quick start

```bash
python3 -m http.server 3000   # static preview (middleware/auth won't run locally)
```

## Edit content

- **Work entries** → the `WORKS` array in `js/main.js` (single source of truth).
- **About / contact** → `index.html`.
- **Staff dashboard** → `_private/hq/index.html` (self-contained file).

## Deploy

```bash
npx -y vercel@latest --prod --yes
```

Must be logged into Vercel as `charging-port` (not the personal Google
account). Deploys are manual; pushing to GitHub alone changes nothing.
