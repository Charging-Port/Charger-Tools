# ChargerTools Website

Portfolio and product showcase for ChargerTools LLC. Built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for contact form emails | For email delivery |
| `CONTACT_EMAIL` | Email address to receive form submissions | No (defaults to hello@chargertools.com) |
| `NEXT_PUBLIC_BASE_URL` | Site URL for SEO metadata | No (defaults to chargertools.com) |

Without `RESEND_API_KEY`, the contact form and newsletter will log submissions to the console instead of sending emails.

## Project Structure

```
app/                  # Next.js App Router pages + API routes
  products/[slug]/    # Dynamic product detail pages
  blog/[slug]/        # Dynamic blog post pages
  api/contact/        # Contact form endpoint (Resend)
  api/newsletter/     # Newsletter signup endpoint
  sitemap.ts          # Auto-generated sitemap.xml
  robots.ts           # Auto-generated robots.txt
components/           # React components
  ui/                 # Primitives (Button, Badge, Input, SectionHeader)
content/              # Content data
  products.ts         # Product definitions (add new products here)
  blog/               # Markdown blog posts (add .md files here)
lib/                  # Utilities and data helpers
  rate-limit.ts       # In-memory rate limiter for API routes
types/                # TypeScript interfaces
public/images/        # Static assets
```

## Adding Products

Edit `content/products.ts` and add a new entry to the `products` array. The product will automatically appear on the home page, products grid, and get its own detail page at `/products/{slug}`.

## Adding Blog Posts

Create a new `.md` file in `content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
date: "2026-04-01"
category: "Hardware"
excerpt: "A short description for the card."
---

Post content in markdown...
```

The post will automatically appear on the blog page and get its own page at `/blog/{filename-without-extension}`.

## Deploy to Vercel

Push to GitHub and import the repository on [vercel.com](https://vercel.com). Add environment variables in the Vercel dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Resend
- **Theme**: next-themes (dark/light mode)
- **Markdown**: remark + gray-matter

---

## Security Follow-Up Checklist

The following items require manual action — most are dashboard or hosting configuration changes that cannot be made from code alone. Items are ordered by priority.

### 1 — Rotate / verify secrets (do this first)

Run this locally to confirm no real API key was ever committed:

```bash
git log --all -p | grep -i "re_[a-zA-Z0-9]"
# Expected: no output
```

If output appears, rotate your Resend API key immediately at [resend.com/api-keys](https://resend.com/api-keys), then update the key in your Vercel environment variables.

**Relevant files:**
- `.env.local.example` — placeholder only; ensure no real `.env.local` was ever committed
- Vercel dashboard → Settings → Environment Variables → confirm `RESEND_API_KEY` is set as an encrypted secret

---

### 2 — Resend sending limits (prevents quota exhaustion)

The API routes include rate limiting per IP, but a rotating proxy can bypass it. Add a hard server-side cap at the Resend level:

1. Go to [resend.com/emails](https://resend.com) → Settings → Sending limits
2. Set a daily cap appropriate for your expected volume (e.g. 50/day)
3. Verify your domain at Resend and update the `from:` address in both routes:

**Files to update after domain verification:**
- `app/api/contact/route.ts` line 73 — change `from: "ChargerTools <onboarding@resend.dev>"` to your verified domain address
- `app/api/newsletter/route.ts` line 63 — same change

---

### 3 — GitHub repository hardening

None of these can be done in code; they require a GitHub admin account:

| Setting | Location |
|---------|----------|
| Branch protection on `main` (require PR review, no direct push) | Settings → Branches → Branch protection rules |
| Dependabot security alerts | Settings → Security → Dependabot alerts → Enable |
| Dependabot version updates | Add `.github/dependabot.yml` (see below) |
| Secret scanning | Settings → Security → Secret scanning → Enable |
| CodeQL code scanning | Security → Code scanning → Set up CodeQL |

Recommended `.github/dependabot.yml` to add:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

---

### 4 — Next.js version (CVE resolution)

`npm audit` still flags four CVEs in `next` because the advisory range includes all 14.x versions. The definitive fix requires upgrading to Next.js 15.

**When you're ready to do this migration, these files need changes:**

| File | Line | Change |
|------|------|--------|
| `package.json` | 13 | `"next": "^15.x.x"` |
| `app/blog/[slug]/page.tsx` | 8–9 | `params` becomes `Promise<{ slug: string }>` — change to `async function` and `await params` |
| `app/products/[slug]/page.tsx` | 8–9 | Same async params change |
| `app/layout.tsx` | 46–50 | Minor: `children` type stays the same but verify any new warnings |

Before upgrading, run `npx @next/codemod@canary upgrade` to apply official codemods automatically.

---

### 5 — Rate limiting: upgrade to Redis for multi-instance deployments

The current rate limiter (`lib/rate-limit.ts`) uses an in-memory Map. This resets on each cold start (important on Vercel's serverless model where instances are ephemeral). For a higher-traffic site or to make limits fully reliable, replace it with Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

**File to rewrite:** `lib/rate-limit.ts` — replace the entire in-memory implementation with `Ratelimit.slidingWindow()` from `@upstash/ratelimit`. Upstash free tier is sufficient for this use case.

Then add these environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

---

### 6 — Add CAPTCHA to public forms

An attacker with many IP addresses can distribute requests to work around per-IP rate limits. Adding Cloudflare Turnstile (free, privacy-preserving) is the most robust defense:

**Files requiring changes:**
| File | Change |
|------|--------|
| `components/contact-form.tsx` | Add `<Turnstile siteKey={...}>` widget and include the token in the POST body |
| `components/newsletter-signup.tsx` | Same |
| `app/api/contact/route.ts` | Add Turnstile server-side token verification before the Resend call (~5 lines) |
| `app/api/newsletter/route.ts` | Same |
| `.env.local.example` | Add `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |

Turnstile setup: [developers.cloudflare.com/turnstile](https://developers.cloudflare.com/turnstile/get-started/)

---

### 7 — Nonce-based CSP (after Next.js 15 upgrade)

The current CSP in `next.config.mjs` includes `'unsafe-inline'` on `script-src` because Next.js 14 injects inline hydration scripts with no nonce mechanism. After upgrading to Next.js 15, you can remove `'unsafe-inline'` and use a per-request nonce instead:

**Files requiring changes (after Next.js 15):**
| File | Change |
|------|--------|
| `middleware.ts` (new file) | Generate a random nonce per request using `crypto.randomUUID()`, set it in a response header, pass it via `Content-Security-Policy` |
| `app/layout.tsx` line 46–69 | Read the nonce from headers and pass it to `<Script nonce={nonce}>` tags |
| `next.config.mjs` line 37 | Replace `'unsafe-inline'` in `script-src` with `'nonce-{nonce}'` |

---

### 8 — HSTS preload list submission

The `Strict-Transport-Security` header is already set with `preload` in `next.config.mjs`. To submit the domain to browser preload lists (maximum HTTPS enforcement):

1. Verify your site is HTTPS-only with no HTTP redirects serving content
2. Submit at [hstspreload.org](https://hstspreload.org)

This is a one-way door — once submitted, removing HSTS support requires months to propagate. Only do this when you're confident the site will always be HTTPS.

---

### 9 — Open Graph image

The site metadata references an OG image path but no image exists yet. To make shared links on Twitter/LinkedIn/iMessage render with a card:

1. Create a 1200×630px image (PNG or JPG) and save it to `public/og-image.png`
2. The metadata in `app/layout.tsx` lines 28–44 will automatically pick it up

Alternatively, generate OG images dynamically:
- Create `app/opengraph-image.tsx` using `next/og` (`ImageResponse`)
- This allows per-page dynamic cards (useful when you have many blog posts)
