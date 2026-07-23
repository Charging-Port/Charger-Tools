# Charger Tools Website

[charger.tools](https://charger.tools) — currently a single blank static HTML page.

- `index.html` — the entire site.
- `vercel.json` — tells Vercel to serve the files statically (no build).

## Deploy

Hosted on Vercel (project `charger-tools`).

```bash
npx -y vercel@latest --prod --yes
```

## History

The previous full site (Next.js portfolio + blog + admin panel) is archived in git
at branch `archive/v1-site` and tag `v1-site`. Restore with `git checkout v1-site`.
