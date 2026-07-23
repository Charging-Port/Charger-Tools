# Architecture — charger.tools

A personal site designed as a **thermal receipt**: one narrow strip of paper
lying on a dark counter. Inspired by
[satoshiwatanabe.org](https://satoshiwatanabe.org/) (numbered index, mono
metadata, whitespace) and [archivio-uno.com](https://archivio-uno.com/)
(dense tabular archive) — reinterpreted as a point-of-sale receipt: ALL-CAPS
labels, dotted leaders, dashed rules, torn edges, a barcode, and
`TOTAL ..... NO CHARGE`.

Hand-coded static site. No framework, no build step, no dependencies.

## Files

| File                     | Role                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `index.html`             | The public receipt (masthead → index → about → contact).   |
| `css/styles.css`         | Design system: tokens → desk → receipt → parts.            |
| `js/main.js`             | `WORKS` data + render, meta lines, filters, barcode.       |
| `_private/hq/index.html` | Staff dashboard (self-contained: inline CSS + JS).         |
| `middleware.js`          | Vercel Edge Middleware — the password gate + login page.   |
| `vercel.json`            | Rewrites (`/hq`, subdomain), security headers, cleanUrls.  |
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
- **Staff dashboard content** → edit `_private/hq/index.html` directly.
  Its notes + todo "register" persist to localStorage in the viewer's
  browser only — nothing is stored server-side.

## Design system (css/styles.css)

- **Tokens** — `--paper`/`--ink` (the receipt), `--desk` (the backdrop).
  Dark mode dims the desk only; paper stays paper.
- **Parts** — `.kv` (LABEL....VALUE line with dotted leader — the receipt
  workhorse), `.rule` (dashed), `.stars`, `.bracket` (`[ LABEL ]` buttons),
  `.item` (work line items), `.kv--total`, `.barcode`, `.tear` (sawtooth
  SVG edges), `.fineprint`.
- **Motion** — the receipt "feeds in" on load; items print staggered
  (delays set from JS). Disabled under `prefers-reduced-motion`.
- **Print stylesheet** — the receipt prints cleanly on white.

## Private area (the "staff door")

Request flow (all enforced in `middleware.js`, which runs before routing):

```
public path, public host  → untouched
/hq, /_private/*, or hq.* host
  ├─ env vars missing     → 503 "REGISTER CLOSED" (fails closed)
  ├─ no/invalid cookie    → receipt-styled login page (401)
  ├─ POST /hq/login       → verify password → set signed cookie → 303
  ├─ /hq/logout           → clear cookie → 303
  └─ valid cookie         → fall through to static files
       vercel.json then rewrites:
         /hq              → /_private/hq/index.html
         /hq/:path*       → /_private/hq/:path*
         hq.charger.tools → /_private/hq/:path*
```

- **Session** — cookie `chg_hq=<expiryMs>.<HMAC-SHA256(secret, "hq1:"+expiry)>`,
  HttpOnly, SameSite=Lax, Secure, 7-day TTL, `Domain=.charger.tools` in prod
  so one login covers the apex and subdomains. Tampered/expired/future-dated
  tokens are rejected; comparisons are constant-time-ish (HMAC-then-compare).
- **CSRF** — cross-origin POSTs to the login endpoint are refused.
- **Env vars (Vercel → Project → Settings → Environment Variables):**
  - `HQ_PASSWORD` — the staff password.
  - `HQ_SESSION_SECRET` — long random string; rotating it logs out all sessions.
- **Not secret, just private** — `_private/` files live in the public GitHub
  repo. The gate keeps the *page* off the public web; never put actual
  secrets in these files. Notes/todos never leave the browser.
- **Headers** — `vercel.json` sets nosniff/frame-deny/HSTS everywhere, a
  strict CSP on public pages, a looser inline-allowing CSP + `no-store` +
  `noindex` on private paths and the `hq.` host.

### Adding another private subdomain (e.g. `notes.charger.tools`)

1. Create `_private/notes/index.html` (self-contained, like hq).
2. Add `"notes."` to `PRIVATE_HOSTS` in `middleware.js`.
3. Copy the three `hq.charger.tools` blocks in `vercel.json`
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
account and 403s. DNS lives at Squarespace; `hq.charger.tools` needs a CNAME
to `cname.vercel-dns.com` plus the domain added to the Vercel project.

Local preview (`python3 -m http.server 3000`) serves the static pages only —
middleware/auth/rewrites run on Vercel, not locally. `/hq` locally is
therefore ungated; that's expected.
