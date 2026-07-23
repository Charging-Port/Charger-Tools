# Architecture — charger.tools

A personal site built as a quiet **editorial index** in the manner of
[satoshiwatanabe.org](https://satoshiwatanabe.org/) and
[archivio-uno.com](https://archivio-uno.com/): small type (everything at
14px), one shared column grid running from the header down through every
index row, monochrome, and a lot of whitespace. No ornament — alignment and
spacing do the work.

Hand-coded static site. No framework, no build step, no dependencies.

## Files

| File                     | Role                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `index.html`             | The public page (header → index → about → contact).        |
| `css/styles.css`         | Design system: tokens → shared grid → components.          |
| `js/main.js`             | `WORKS` data + row render, header filters, footer meta.    |
| `_private/dev/index.html` | Staff page (self-contained: inline CSS + JS).              |
| `middleware.js`          | Vercel Edge Middleware — the password gate + login page.   |
| `vercel.json`            | Rewrites (`/dev`, subdomain), security headers, cleanUrls.  |
| `assets/`                | Images/media if ever needed (currently empty).             |

## Content model

- **Work entries** → the `WORKS` array in `js/main.js`. Single source of
  truth. Entries are numbered `001..N` in source order and printed reversed
  (highest number first). An entry:

  ```js
  {
    title: "Project Name",   // required
    role:  "Design & Build", // required — role / client / medium
    year:  2026,             // required — number or "2024–25"
    url:   "https://…",      // optional — links the line item
    tags:  ["Web", "Tool"],  // optional — powers the DEPT filter row
  }
  ```

- **About copy, contact links** → edit `index.html` directly.
- **Staff dashboard content** → edit `_private/dev/index.html` directly.
  Its notes + todo "register" persist to localStorage in the viewer's
  browser only — nothing is stored server-side.

## Design system (css/styles.css)

- **Tokens** — `--bg`/`--ink`/`--muted` (monochrome; dark mode inverts),
  one type size (`--fs`, 14px) for everything, and the shared column
  template `--col-num / --col-title / --col-role / --col-year`.
- **The grid** — `.grid` applies the column template. The header
  (`C. | filters | About | Contact`), the column heads (`N. P. R. Y.`),
  and every work row all use it, so the page reads as one aligned system.
  Sections reuse it with a letter label (`A.` about, `C.` contact) in the
  number column.
- **Hierarchy by color, not size** — titles are ink, everything secondary
  is `--muted`. Hovering the list dims the other rows.
- **Motion** — rows rise in with a small stagger (delays set from JS).
  Disabled under `prefers-reduced-motion`.

## Private area (the "staff door")

Request flow (all enforced in `middleware.js`, which runs before routing):

```
public path, public host   → untouched
apex /dev, /hq             → untouched by middleware; vercel.json
                             307-redirects them to https://dev.charger.tools
dev.* host, or apex /_private/*, /dev/login, /dev/logout
  ├─ env vars missing      → 503 "login disabled" (fails closed)
  ├─ no/invalid cookie     → login page (401)
  ├─ POST /dev/login       → verify password → set signed cookie → 303
  ├─ /dev/logout           → clear cookie → 303
  └─ valid cookie
       ├─ dev.* host       → middleware rewrites into /_private/dev/*
       │                     (the filesystem is checked before vercel.json
       │                      rewrites, so "/" would otherwise serve the
       │                      public index.html)
       └─ apex /_private/* → falls through to the static file
```

- **Session** — cookie `chg_dev=<expiryMs>.<HMAC-SHA256(secret, tag+expiry)>`,
  HttpOnly, SameSite=Lax, Secure, 7-day TTL, `Domain=.charger.tools` in prod
  so one login covers the apex and subdomains. Tampered/expired/future-dated
  tokens are rejected; comparisons are constant-time-ish (HMAC-then-compare).
- **CSRF** — cross-origin POSTs to the login endpoint are refused.
- **Env vars (Vercel → Project → Settings → Environment Variables):**
  - `DEV_PASSWORD` — the staff password.
  - `DEV_SESSION_SECRET` — long random string; rotating it logs out all sessions.
- **Not secret, just private** — `_private/` files live in the public GitHub
  repo. The gate keeps the *page* off the public web; never put actual
  secrets in these files. Notes/todos never leave the browser.
- **Headers** — `vercel.json` sets nosniff/frame-deny/HSTS everywhere, a
  strict CSP on public pages, a looser inline-allowing CSP + `no-store` +
  `noindex` on private paths and the `dev.` host. `404.html` and
  `robots.txt` at the root cover missing pages and crawlers.

### Adding another private subdomain (e.g. `notes.charger.tools`)

1. Create `_private/notes/index.html` (self-contained, like dev).
2. Add `"notes."` to `PRIVATE_HOSTS` in `middleware.js`.
3. Copy the three `dev.charger.tools` blocks in `vercel.json`
   (host rewrite + host CSP header) for the new host, and add path
   rewrites if it should also be reachable at `/notes`.
4. Add the domain to the Vercel project + a Squarespace CNAME
   (`notes` → `cname.vercel-dns.com`).

## Deploy

Vercel, project `charger-tools`, team `charging-ports-projects`. Deploys are
**manual** (no git integration):

```bash
npx -y vercel@latest --prod --yes
```

Gotcha: must be logged in as the `charging-port` Vercel account
(`kaden@charger.tools`) — "Continue with Google" logs into the wrong personal
account and 403s. DNS lives at Squarespace; `dev.charger.tools` needs a CNAME
to `cname.vercel-dns.com` plus the domain added to the Vercel project.

Local preview (`python3 -m http.server 3000`) serves the static pages only —
middleware/auth/rewrites run on Vercel, not locally. `/dev` locally is
therefore ungated; that's expected.
