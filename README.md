# Charger Tools Website

A fresh build of [charger.tools](https://charger.tools). Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS.

> The previous version of the site (portfolio + blog + admin panel) is archived in git
> at branch `archive/v1-site` and tag `v1-site`. Restore with `git checkout v1-site`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build && npm start
```

## Deploy

Hosted on Vercel (project `charger-tools`). Deploy the current directory to production:

```bash
npx -y vercel@latest --prod --yes
```

## Structure

```
app/
  layout.tsx     root layout + metadata
  page.tsx       homepage
  globals.css    Tailwind + base tokens
```
