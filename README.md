# Charger Tools Website

[charger.tools](https://charger.tools) — a hand-coded static site (no framework, no build step).

## Folder structure

```
index.html          The page itself. Must stay at the root.
css/
  styles.css        All styling. Linked from index.html.
js/
  main.js           All JavaScript. Loaded from index.html.
assets/
  images/           Logos, photos, icons. Reference as assets/images/<file>.
vercel.json         Vercel config — serves the files statically. Leave as-is.
```

## Editing

Open the files in any editor and edit them directly. To preview locally,
just open `index.html` in a browser (double-click it) — no server needed.

- Change **content** → edit `index.html`
- Change **look** → edit `css/styles.css`
- Add **interactivity** → edit `js/main.js`
- Add **images** → drop files into `assets/images/`

Paths in `index.html` are relative (e.g. `css/styles.css`), so previewing
by double-clicking the file works the same as the live site.

## Deploy

Hosted on Vercel (project `charger-tools`, account `charging-port`).

```bash
npx -y vercel@latest --prod --yes
```

## History

The previous full site (Next.js portfolio + blog + admin panel) is archived in git
at branch `archive/v1-site` and tag `v1-site`. Restore with `git checkout v1-site`.
