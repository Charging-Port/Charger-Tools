# ChargerTools — Project Context (handoff document)

_Generated 2026-05-01 at end of deployment session. Drop this file at the start of a new chat to bootstrap a productive next session without re-doing discovery work._

---

## TL;DR (read first)

A personal portfolio + blog site for **Kaden MacLean**, branded as **ChargerTools**. Built with **Next.js 14 (App Router) + Tailwind + TypeScript**. Lives at **https://charger.tools**, repo at **https://github.com/Charging-Port/Charger-Tools**, hosted on **Vercel**. Has a passworded admin panel for editing blog posts and products without redeploying.

**State as of handoff:** Just shipped to production at the new domain. Just completed a security-hardening pass with an 84-test attack suite. Contact form delivers to `kaden@charger.tools` via Resend. Resend API key is sending-only and stored in Vercel.

**Working directory of this session:** `/Users/charger/Charger Tools/Website/.claude/worktrees/cranky-faraday-3d9beb` (a git worktree). The user's primary checkout is presumably the parent `Website/` directory. **Future sessions may want to work in either**.

---

## 1. Live infrastructure

| | |
|---|---|
| **Production URL** | https://charger.tools (apex) and https://www.charger.tools (308 → apex) |
| **Vercel project** | `charger-tools` under team `charging-ports-projects` |
| **Vercel project ID** | `prj_ypmpM6yx3xcN5NwwLswTLmOqrdBq` |
| **Vercel team ID** | `team_0Yi518DfMLM0m09a74Ix0OEm` |
| **GitHub repo** | https://github.com/Charging-Port/Charger-Tools (public, default branch `main`) |
| **Git remote `charging-port`** | https://github.com/Charging-Port/Charger-Tools.git ← use this |
| **Git remote `origin`** | https://github.com/0verclock3d/Charger-Tools.git ← old account, abandoned, do NOT push |
| **Branches on charging-port** | `main` and `standout-effects` (both at HEAD as of writing) |
| **Domain registrar** | Squarespace |
| **DNS records on Squarespace** | `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com` (custom records section). Google Workspace MX records preserved untouched for email. |
| **TLS** | Let's Encrypt, auto-issued by Vercel, auto-renews |
| **Email hosting** | Google Workspace on `charger.tools` (separate from Resend) |
| **Transactional email** | Resend (`resend.com`) — sends contact form & newsletter notifications |

### Vercel CLI auth
- User logged in to Vercel CLI as `charging-port`.
- Auth token cached at `~/Library/Application Support/com.vercel.cli/auth.json`.
- `gh` CLI also has both `0verclock3d` and `Charging-Port` accounts — active is `Charging-Port`. Switch with `gh auth switch --user Charging-Port` if needed.

### Vercel production env vars (do not commit values)

| Name | What it is | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | Plaintext admin password the user types at `/admin/login` | 24-char random. **The user has this in their password manager.** Do NOT echo, log, or commit. |
| `ADMIN_SECRET` | 32-byte hex secret for HMAC-signing session cookies | Auto-generated. Rotating this invalidates ALL active admin sessions (good for incident response). |
| `RESEND_API_KEY` | Sending-access-only API key for Resend | User rotated the original key for security; current value is sending-only and was set via Vercel dashboard, not chat. |
| `CONTACT_EMAIL` | Where contact-form & newsletter notifications get delivered | Currently `kaden@charger.tools`. |
| `NEXT_PUBLIC_BASE_URL` | Used for canonical URLs, OG metadata, sitemap | `https://charger.tools`. The `NEXT_PUBLIC_` prefix means it ships to client bundles — fine, it's not a secret. |

**Optional / not yet set:**
- `CONTACT_FROM` — code defaults to `ChargerTools <onboarding@resend.dev>`. Set to `ChargerTools <noreply@charger.tools>` (or similar) once the user verifies `charger.tools` as a sending domain in Resend, to avoid "via resend.dev" branding and improve deliverability.

---

## 2. Codebase

### Stack

- **Framework:** Next.js 14.2.x (App Router), Node 20+, TypeScript strict
- **Styling:** Tailwind CSS, custom CSS in `app/globals.css`
- **Animation:** `framer-motion` for component anim, `lenis` for smooth scroll, custom canvas effects
- **Markdown:** `gray-matter` (frontmatter) + `remark` + `remark-html` (with `sanitize: true`) for rendering blog bodies
- **Email:** `resend` SDK (lazy-imported in API routes so build doesn't require RESEND_API_KEY)
- **Icons:** `lucide-react`
- **Theming:** `next-themes` (dark mode)

No test framework, no E2E suite, no Storybook. The 84-test security attack suite at `/tmp/security-test.sh` (probably gone after reboot — see Section 6 to regenerate) is the only systematic test.

### Repo layout (top-level)

```
.
├── app/
│   ├── (public)/         ← user-facing pages (route group, no URL prefix)
│   │   ├── page.tsx      ← homepage
│   │   ├── about/
│   │   ├── blog/
│   │   │   ├── page.tsx  ← list
│   │   │   └── [slug]/
│   │   ├── contact/
│   │   ├── now/
│   │   ├── products/
│   │   │   ├── page.tsx  ← list
│   │   │   └── [slug]/
│   │   └── layout.tsx
│   ├── admin/            ← passworded admin panel
│   │   ├── _components/
│   │   │   └── logout-button.tsx
│   │   ├── blog/
│   │   │   ├── _client.tsx   ← BlogAdmin client component
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   ├── _form.tsx
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── _client.tsx   ← ProductsAdmin client component
│   │   │   └── page.tsx
│   │   └── page.tsx          ← admin dashboard
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── posts/route.ts
│   │   │   └── products/route.ts
│   │   ├── contact/route.ts
│   │   └── newsletter/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── blog-card.tsx
│   ├── command-palette.tsx       ← ⌘K nav
│   ├── contact-form.tsx
│   ├── cursor.tsx
│   ├── featured-work.tsx
│   ├── footer.tsx
│   ├── hero-canvas.tsx
│   ├── hero.tsx
│   ├── keyboard-hints.tsx        ← `?` shortcut overlay
│   ├── navbar.tsx
│   ├── newsletter-signup.tsx
│   ├── product-card.tsx
│   ├── product-mockup.tsx        ← per-slug animated SVG previews
│   ├── project-glyph.tsx
│   ├── project-grid.tsx
│   ├── section-marker.tsx
│   ├── shipping-log.tsx
│   ├── smooth-scroll.tsx         ← lenis
│   ├── studio-clock.tsx          ← live time-of-day in header
│   ├── theme-provider.tsx        ← next-themes wrapper
│   └── ui/
├── content/
│   ├── blog/
│   │   ├── building-ar-glasses-from-scratch.md
│   │   ├── from-frc-to-startups.md
│   │   └── why-local-ai-matters.md
│   ├── products.json             ← product DB (10 entries: meridian, probe, zenith, futz, hyperform-fitness, ar-glasses, charger-agent, charger-mail, optics-simulator, rf-radar-simulator)
│   └── products.ts               ← (legacy/unused; products.json is canonical)
├── lib/
│   ├── admin-auth.ts             ← session token HMAC + verification
│   ├── blog.ts                   ← read+sanitize markdown for public render
│   ├── products.ts               ← read/write products.json
│   ├── rate-limit.ts             ← in-memory IP-keyed limiter
│   └── utils.ts                  ← cn(), formatDate(), estimateReadingTime(), safeUrl()
├── scripts/
│   └── new-post.mjs              ← scaffolds a blank blog post
├── types/
│   └── index.ts                  ← Product, BlogPost, ContactFormData, ProductStatus
├── next.config.mjs               ← security headers + cache policy
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Routes inventory (full)

### Public pages (`app/(public)/`)

| Path | File | Notes |
|---|---|---|
| `/` | `page.tsx` | Homepage. Hero, featured work, blog teaser, /now teaser, contact, newsletter |
| `/about` | `about/page.tsx` | Static bio + workshop ethos |
| `/blog` | `blog/page.tsx` | Lists all posts in `content/blog/*.md`, newest first |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Renders one post via `remark-html` (sanitized) |
| `/contact` | `contact/page.tsx` | Contact form (uses `components/contact-form.tsx`) |
| `/now` | `now/page.tsx` | "What I'm doing right now" — hardcoded list, edit the SECTIONS const |
| `/products` | `products/page.tsx` | Lists products from `content/products.json` |
| `/products/[slug]` | `products/[slug]/page.tsx` | Per-product detail. Renders `<ProductMockup />` and prev/next |

### Admin pages (`app/admin/`)

| Path | File | Behavior |
|---|---|---|
| `/admin` | `page.tsx` | Dashboard. Calls `requireAuth()` at top — redirects to /admin/login if not authed |
| `/admin/login` | `login/page.tsx` + `login/_form.tsx` | Single password field. Both JS fetch and native form fallback |
| `/admin/blog` | `blog/page.tsx` + `blog/_client.tsx` | Blog CMS — list, create, edit, delete posts. Markdown editor with preview |
| `/admin/products` | `products/page.tsx` + `products/_client.tsx` | Product manager — reorder, status change, create, delete |

All admin pages have `metadata: { robots: { index: false, follow: false } }` and `dynamic = "force-dynamic"`. `next.config.mjs` also adds `Cache-Control: no-store` and `X-Robots-Tag: noindex` headers.

### API routes (`app/api/`)

| Method | Path | Auth | Rate limit | Notes |
|---|---|---|---|---|
| `POST` | `/api/admin/login` | none (this IS auth) | 10/10min/IP | Origin/Referer required, sets `ct_admin_session` cookie |
| `POST` | `/api/admin/logout` | optional | – | Clears session cookie |
| `GET` | `/api/admin/posts` | required | 60/min/IP | List posts as JSON |
| `POST` | `/api/admin/posts` | required + Origin check | 60/min/IP | Create/update post. Slug must match `^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$` and resolve inside `content/blog`. ISO date validation. Field length caps |
| `DELETE` | `/api/admin/posts` | required + Origin check | 60/min/IP | Delete by slug. Same slug regex |
| `GET` | `/api/admin/products` | required | 60/min/IP | List products |
| `POST` | `/api/admin/products` | required + Origin check | 60/min/IP | Create. URL allowlist on links (only http/https/mailto). Field caps. Status enum validation |
| `PATCH` | `/api/admin/products` | required + Origin check | 60/min/IP | Bulk update statuses+orders. ≤200 updates per request |
| `DELETE` | `/api/admin/products` | required + Origin check | 60/min/IP | Delete by id |
| `POST` | `/api/contact` | none | 5/15min/IP | Contact form. CRLF stripped from short fields. JSON-only |
| `POST` | `/api/newsletter` | none | 3/hour/IP | Newsletter signup. JSON-only |

All admin routes export `dynamic = "force-dynamic"`. All write routes require `Content-Type: application/json` (or for login, also urlencoded/multipart).

---

## 4. Server-side modules (`lib/`)

### `lib/admin-auth.ts`

Stateless cookie-based auth. **Fail-closed in production**: if `ADMIN_PASSWORD` or `ADMIN_SECRET` is missing in `NODE_ENV=production`, `getCredentials()` returns null and **all auth checks return false** — login cannot succeed, protected pages redirect.

Session token format: `<issuedAtMs>.<sha256-hmac>`. The HMAC binds the `issuedAt` to the secret.
- Tokens older than 7 days (`MAX_SESSION_AGE_MS`) are rejected.
- Tokens with `issuedAt > now + 60s` are rejected (clock-skew protection).
- Constant-time compare on the MAC.

Public surface:
- `verifyPassword(input)` — SHA-256-then-timingSafeEqual to avoid leaking length
- `createSessionToken()` — throws if creds missing (callers should catch in prod and return 503)
- `isValidSession(token)` — full validation chain
- `isAuthenticated()` — reads cookie via `next/headers`, returns boolean
- `requireAuth()` — throws (via `redirect()`) if not authed; use at top of admin server components
- `ADMIN_COOKIE_NAME` = `"ct_admin_session"`
- `SESSION_MAX_AGE_SECONDS` — exported for use as cookie maxAge

In dev, falls back to defaults (`changeme` / a baked-in secret) and logs a warning. `.env.local` in this worktree contains a different test password to demonstrate that path works.

### `lib/rate-limit.ts`

In-memory IP-keyed rate limiter. State doesn't persist across function instances on Vercel — fine for low-volume admin use, but note that on serverless cold starts the counter resets.

`getClientIp(req)` order of trust:
1. `x-vercel-forwarded-for` (set by Vercel edge, not spoofable)
2. `req.ip` (NextRequest, populated by Vercel runtime)
3. `x-forwarded-for` first hop (only safe behind a trusted proxy)
4. `"unknown"` (groups all anonymous clients under one bucket)

`x-real-ip` is intentionally NOT trusted.

### `lib/blog.ts`

Reads `content/blog/*.md` files, parses frontmatter with `gray-matter`, sorts by date descending. `renderMarkdown(content)` runs `remark().use(html, { sanitize: true })` — explicitly passes `sanitize: true` so a future remark-html upgrade can't silently disable sanitization.

The sanitizer strips `<script>`, `on*` handlers, `javascript:` URLs, and other vectors.

### `lib/products.ts`

Reads `content/products.json` fresh on every call (so admin edits show up without rebuild). On Vercel the filesystem is read-only at runtime, so writes from `/api/admin/products` only persist within a single function invocation — **for production persistence, the user would need to commit `content/products.json` and redeploy.** This is documented at the bottom of the admin dashboard. _(Future enhancement: move to a database.)_

### `lib/utils.ts`

- `cn(...inputs)` — tailwind-merge + clsx
- `formatDate(dateString)` — parses `YYYY-MM-DD` manually to avoid UTC midnight timezone shift
- `estimateReadingTime(content)` — words / 200
- `safeUrl(value)` — allowlists http/https/mailto, returns null otherwise. **Use this anywhere data-driven URLs are rendered as `href`.**

---

## 5. Security posture (DO NOT REGRESS)

The following invariants are load-bearing for the deployed site. All verified by an 84-test live attack suite (recreate-able from this doc — see Section 9).

### Hardenings in place
1. **Admin auth fails closed in prod** when env vars missing — no static defaults.
2. **Session tokens expire** at 7 days, are tamper-resistant via HMAC, and reject future-dated values.
3. **CSRF Origin/Referer check** on every admin write endpoint AND login.
4. **Path traversal closed** on blog post slugs at write — strict regex + `path.resolve` containment check.
5. **URL scheme allowlist** (`safeUrl`) at write (admin API) and at render (product page) — rejects `javascript:`, `data:`, `vbscript:`, `file:`, `ftp:`, protocol-relative `//evil.com`.
6. **XSS via blog body sanitized** by `remark-html` with explicit `sanitize: true`.
7. **CRLF stripped** from contact form short fields (name, email, company) before being interpolated into the email subject.
8. **Rate limits** on login (10/10min), admin endpoints (60/min), contact (5/15min), newsletter (3/hr) — keyed by IP via `getClientIp`.
9. **Security headers** via `next.config.mjs`: HSTS preload, full CSP with `frame-ancestors 'none'`, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy disabling camera/mic/geo.
10. **`/admin/*` and `/api/admin/*`** get `Cache-Control: no-store`, `X-Robots-Tag: noindex` — no shared-cache leakage of authenticated responses.
11. **Resend SDK error path checked** — `result.error` inspected so a quietly-rejected send doesn't return success to the client.
12. **`/admin` and `/api`** disallowed in `robots.txt`.

### Known limitations
- Rate limit is in-memory — across Vercel function instances, an attacker could get up to N×limit rather than just limit. Acceptable for current traffic. Upstash Redis is the obvious upgrade.
- CSP includes `'unsafe-inline'` for both script-src and style-src (Next.js 14 hydration + Tailwind require it). Documented in `next.config.mjs`. Consider per-request nonce via middleware on Next 15+ migration.
- No CAPTCHA / proof-of-work on contact form. Rate limit is the only spam defense beyond email validation.

### How to verify after future changes
The security test script at `/tmp/security-test.sh` was generated this session. It's not in the repo. To recreate: see _Section 9 — How to start a new session productively_.

Or just run the dev server (`npm run dev`) and:
- `curl -X POST -H "Content-Type: application/json" -H "Origin: http://evil.com" -d '{}' http://localhost:3000/api/admin/posts` should return 401 (unauth) or 403 (bad origin)
- `curl http://localhost:3000/admin` should redirect to `/admin/login` (307)
- All security headers should appear on `curl -I http://localhost:3000/`

---

## 6. Environment variables — full reference

### Required in production
| Name | Source of truth | Effect if missing |
|---|---|---|
| `ADMIN_PASSWORD` | User's password manager | Admin login disabled (fails closed) |
| `ADMIN_SECRET` | Vercel env (auto-generated) | Admin login disabled |
| `NEXT_PUBLIC_BASE_URL` | Vercel env (`https://charger.tools`) | Sitemap and OG URLs use a fallback |

### Optional in production
| Name | Default | Notes |
|---|---|---|
| `RESEND_API_KEY` | _none_ | If unset, contact form & newsletter return success but only log to console. The user has this set with a sending-only key. |
| `CONTACT_EMAIL` | `hello@chargertools.com` | Currently `kaden@charger.tools`. |
| `CONTACT_FROM` | `ChargerTools <onboarding@resend.dev>` | Set to a verified-domain sender once `charger.tools` is verified in Resend. |

### Local dev (`.env.local`)
The worktree has a `.env.local` with throwaway test credentials for the dev-mode admin path. It's gitignored. Don't commit it.

To regenerate the dev password locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. Operational knowledge

### Deploying

Manual (CLI):
```bash
# from the project root
npx vercel --prod
```
First call will pick up `.vercel/project.json` and route to the right project. New commits on `main` are NOT yet auto-deploying — the GitHub-Vercel integration was deliberately NOT wired up so deploys remain manual. **Connecting it is a one-click change in the Vercel dashboard** (`Settings → Git → Connect Git Repository`).

### Updating env vars
```bash
# remove + re-add (Vercel CLI doesn't support in-place edit)
npx vercel env rm <NAME> production --yes
echo "<value>" | npx vercel env add <NAME> production

# trigger redeploy to pick up changes
npx vercel --prod --yes
```

Or use the Vercel dashboard at `https://vercel.com/charging-ports-projects/charger-tools/settings/environment-variables`.

### Editing blog posts
Either:
- Through the admin panel at `/admin/blog` (changes only persist for that one Vercel function invocation — so this is more of a draft/preview UI). For real persistence:
- Edit `content/blog/<slug>.md` directly in the repo, commit, push, redeploy.

### Editing products
Same pattern — admin panel for previewing, but real changes go through `content/products.json` in git.

### Where logs live
- Build logs: `https://vercel.com/charging-ports-projects/charger-tools/deployments`
- Runtime function logs: same project → individual deployment → "Functions" tab. Errors from `console.error` appear here.
- Resend delivery log: https://resend.com/emails

### Rolling back
- Vercel: dashboard → deployments → previous deployment → "Promote to Production"
- Git: `git revert <commit>` then redeploy

### Rotating ADMIN_PASSWORD or ADMIN_SECRET
1. Generate a new value (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` for the secret; pick a memorable strong password for the password)
2. Update on Vercel via dashboard or CLI
3. Trigger a redeploy
4. **Rotating `ADMIN_SECRET` invalidates ALL existing sessions** — existing browsers will need to log in again. Useful as an "emergency log everyone out" button.

---

## 8. Recent timeline (this session, 2026-04-30 → 2026-05-01)

In rough order:

1. **Security audit pass** — read all server-side code, mapped attack surface.
2. **Identified vulnerabilities** — 15 flagged across CRITICAL/HIGH/MEDIUM/LOW. Critical ones: path traversal in `/api/admin/posts` POST, default fallback to `"changeme"` password if env var missing, no rate limit on login.
3. **Implemented fixes** in `lib/admin-auth.ts`, `lib/rate-limit.ts`, `lib/utils.ts`, `app/api/admin/login/route.ts`, `app/api/admin/posts/route.ts`, `app/api/admin/products/route.ts`, `app/api/contact/route.ts`, `next.config.mjs`, `app/(public)/products/[slug]/page.tsx`.
4. **Built 84-test live attack suite** at `/tmp/security-test.sh` (not in repo) and iterated until all 84 + 8 edge cases passed.
5. **Production build verified** — all 31 routes generated cleanly, no type errors.
6. **Committed** as `d2abefe` — "Security hardening pass: auth, CSRF, path traversal, XSS, rate limits".
7. **GitHub migration** — created `Charging-Port/Charger-Tools` repo, pushed `main` and `standout-effects` to it.
8. **Vercel deployment** — installed CLI via `npx`, logged in as `charging-port`, deployed, attached to project.
9. **Domain setup** — bought on Squarespace; deleted Squarespace's parking A records, added Vercel's `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`. Kept Google Workspace MX records intact.
10. **Cert auto-issued** by Vercel (Let's Encrypt) within ~3 minutes of DNS propagating.
11. **Resend integration** — user provided initial key, then rotated it (sending-only) after security warning. Updated CONTACT_EMAIL to `kaden@charger.tools`.
12. **Resend SDK bug fix** — discovered the SDK doesn't throw on API errors, only sets `result.error`. Fixed both contact and newsletter routes to inspect it. Committed as `84331b6`.
13. **Final verification** — contact form delivery confirmed working to `kaden@charger.tools`.

---

## 9. How to start a new session productively

When you open a new chat, paste this whole document and add a one-line ask. Examples:

> "Here's the full project context. Help me set up the Resend custom-domain sender (`noreply@charger.tools`) — verify the domain and update CONTACT_FROM."

> "Context attached. The /now page hardcodes a SECTIONS const — I want to make this admin-editable. Plan the change before implementing."

> "Context attached. I want to add a tags system to blog posts. Let's design it together first, then implement."

The new session will then know:
- Where everything lives
- What the security invariants are
- How to deploy
- What's already been done and shouldn't be re-litigated

### To regenerate the security test suite

The 84-test attack suite was at `/tmp/security-test.sh` but probably got cleaned up. Ask the new session something like:

> "Re-create the live security test suite from CONTEXT.md Section 5. Cover all 84 categories listed there. Run it against `npm run dev` on port 3457 with X-Forwarded-For spoofing for per-test IPs."

The categories to test (each with multiple cases):
1. Public 200s on /, /blog, /products, /about, /contact, /now
2. Security headers (HSTS, CSP, X-Frame, X-Content-Type, Referrer-Policy, Permissions-Policy) on public + Cache-Control no-store on /admin
3. /admin and /admin/* redirect when unauth
4. All admin API verb/path combos return 401 unauth
5. Login validation (bad pw, cross-origin, missing Origin, wrong Content-Type, oversized password, success)
6. Path traversal — `../../../tmp/pwn`, `..%2F`, `/tmp/x`, `..\\windows`, `foo/bar`, `foo bar`, `FOO`, `-leading`, `trailing-`, `.env`, `.gitignore`, `.htaccess`, `.bashrc`
7. CSRF on writes — no Origin, evil Origin, wrong Content-Type
8. URL scheme allowlist — `javascript:`, `JaVaScRiPt:`, `data:text/html,...`, `vbscript:`, `file:///etc/passwd`, `ftp://...`, `//evil.com/x`
9. Body size limits — title >200, oversized body, oversized name (clamps not rejects)
10. Tampered session — random MAC, garbage, empty, future-dated, negative-ts
11. XSS in blog body — verify `<script>`, `javascript:` href, `onclick=`, payload all stripped from rendered prose div
12. Contact form — wrong CT, bad email, empty body, oversized message, happy path, rate-limit
13. Newsletter — bad email, happy
14. Login rate-limit
15. Admin API rate-limit
16. Robots disallows /admin and /api
17. Logout

---

## 10. Recommended next steps (in priority order)

These are NOT done yet but are obvious follow-ups:

### 1. Verify `charger.tools` as a sending domain in Resend
- Currently the contact form sends FROM `onboarding@resend.dev` (Resend's shared test sender). Recipients see "via resend.dev" in some clients, deliverability is mediocre, and the test sender has historical limitations.
- **Action:** Resend dashboard → Domains → Add `charger.tools` → it gives 3 DNS records (SPF TXT, DKIM TXT, DMARC TXT). Add them at Squarespace alongside the existing records (don't delete anything Google-related). Then set `CONTACT_FROM=ChargerTools <noreply@charger.tools>` in Vercel and redeploy.
- **Why:** Better deliverability + branded sender. Solves any future "to address must be verified" weirdness.

### 2. Connect GitHub → Vercel for auto-deploy
- Vercel dashboard → project → Settings → Git → Connect → choose `Charging-Port/Charger-Tools` → branch `main`.
- After connecting: every push to `main` auto-deploys. Pushes to other branches get preview URLs.
- **Why:** Removes manual `npx vercel --prod` step. Standard convention for this kind of project.

### 3. Move admin writes to a database (or Git-as-database)
- Current state: `/api/admin/posts` and `/api/admin/products` write to local files. On Vercel, the filesystem is read-only at runtime, so changes don't persist.
- **Options:**
  - **Lightweight:** Have admin writes commit-and-push back to GitHub via the GitHub API (so changes persist via the standard build pipeline). Means changes auto-redeploy.
  - **Full DB:** Vercel Postgres or Neon. Bigger lift, but enables features like comments, view counts, etc.
  - **Decision in repo:** documented at the bottom of `app/admin/page.tsx` as "Edits are saved to local files... To deploy changes to production, commit the files and push." So today it's a "preview/draft" tool. Decide if that's enough.

### 4. Real OG image generation
- Currently every page uses a static `/og-image.png`. Move to `next/og` (`@vercel/og`) for per-page dynamic OG images.

### 5. Analytics
- Vercel Analytics is one click in the dashboard. Plausible or Fathom are alternatives.

### 6. Rate-limit upgrade to Upstash Redis
- Drop-in for `lib/rate-limit.ts`. Removes the cross-instance limit inconsistency on Vercel.

### 7. Tests
- Zero unit/integration tests right now. Even a small jest+supertest suite for the admin API would be valuable.

### 8. The /now page
- Hardcoded SECTIONS const. Either make it admin-editable, or accept that updates are commit-driven.

### 9. Image hosting
- All product images today are SVG generated client-side via `<ProductMockup>`. No real screenshots/photos. If user wants real images, decide on a pattern (`public/products/<slug>/<n>.webp`?) and update `Product.images` to be used.

### 10. SEO/canonical audit
- Sitemap is auto-generated. Canonicals point at `NEXT_PUBLIC_BASE_URL`. Worth running the live site through Lighthouse/PageSpeed/securityheaders.com once.

---

## 11. Known gotchas / things to remember

- **Two GitHub accounts in `gh`** — `0verclock3d` and `Charging-Port`. Active matters. `gh auth switch --user Charging-Port` if you see push errors.
- **Two git remotes** — `origin` is the OLD account, `charging-port` is the new one. Always push to `charging-port`. **Consider deleting the `origin` remote** to avoid mistakes: `git remote remove origin`.
- **Vercel CLI invocation** — `npx -y vercel@latest`. Global `npm install -g vercel` failed (EACCES on `/usr/local/lib/node_modules`); using `npx` avoids this.
- **The worktree path is long** — `/Users/charger/Charger Tools/Website/.claude/worktrees/cranky-faraday-3d9beb`. Always quote it.
- **`.env.local` exists in this worktree** with dev test creds. Gitignored, harmless. Don't commit it.
- **Resend onboarding sender restriction** — the default `onboarding@resend.dev` sender historically only delivered to the Resend account owner's verified email. If the contact form mysteriously stops working after changing `CONTACT_EMAIL`, this is probably why. Fix is to verify the custom domain (Section 10 item 1).
- **Squarespace DNS presets** — Squarespace bundles records as named "presets" (Squarespace Defaults, Google Workspace, Domain Connect). Deleting a preset deletes ALL records in it at once. Don't accidentally delete the Google Workspace preset.
- **`force-dynamic` on `/blog/[slug]`** — re-reads disk per request. Not a security issue but inefficient at scale. Switch to ISR with revalidation when the read volume actually matters.
- **Two product files** — `content/products.json` (canonical, used by `lib/products.ts`) and `content/products.ts` (legacy, unused). Don't get them confused.
- **macOS Keychain has both Vercel and gh tokens** — they're cached. Logging out of gh doesn't drop the keychain entry.

---

## 12. Quick command reference

```bash
# Dev server
npm run dev                          # http://localhost:3000

# Type check
npx tsc --noEmit

# Production build
npm run build && npm start

# Vercel deploy (production)
npx -y vercel@latest --prod --yes

# View production env vars
npx -y vercel@latest env ls production

# Add/update env var
npx -y vercel@latest env rm <NAME> production --yes
echo "<value>" | npx -y vercel@latest env add <NAME> production

# Inspect a deployment
npx -y vercel@latest inspect <deployment-url>

# Push to new GitHub
git push charging-port HEAD:main

# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test live security headers
curl -sI https://charger.tools/ | grep -iE 'csp|strict-transport|x-frame|x-content-type'

# Test live contact form
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"test","email":"a@b.co","message":"hi"}' \
  https://charger.tools/api/contact

# Generate a valid admin session token directly (for scripted testing — needs ADMIN_SECRET)
node -e 'const c=require("crypto"); const t=Date.now(); console.log(t+"."+c.createHmac("sha256",process.env.ADMIN_SECRET).update("admin:"+t).digest("hex"))'
```

---

## 13. Memory files (persistent across sessions)

Two memory files were created at `~/.claude/projects/-Users-charger-Charger-Tools-Website/memory/`:
- `project_deployment.md` — domain/repo/Vercel facts
- `project_security_posture.md` — security invariants

Indexed in `MEMORY.md` at the same path. These auto-load in future sessions if you continue from the same working directory.

---

## 14. End-of-session state

- ✅ Working tree clean (all changes committed and pushed)
- ✅ Production deploy live and verified
- ✅ Contact form delivers to `kaden@charger.tools` end-to-end
- ✅ All 84 security tests passing
- ✅ Temp files holding password / session token deleted from `/tmp`
- ⚠️ `.env.local` exists locally with throwaway test creds (gitignored)
- ⚠️ Resend domain `charger.tools` not yet verified — contact form uses test sender (works but suboptimal)
- ⚠️ GitHub→Vercel auto-deploy not connected (manual deploys for now)
- ⚠️ `/tmp/security-test.sh` was not committed to repo; will not survive a reboot. Recreate from Section 9 if needed.

Last commits on `main`:
```
84331b6 Inspect Resend SDK result.error so failed sends don't return success
d2abefe Security hardening pass: auth, CSRF, path traversal, XSS, rate limits
cdb29fd Signature pass: live constellation, studio clock, editorial section marks
605e53b Depth pass: animated mockups, shipping log, keyboard shortcuts, visual prev/next
b92d9b7 Lead with the work — product mockup tiles, not editorial ego
```
