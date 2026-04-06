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
components/           # React components
  ui/                 # Primitives (Button, Badge, Input, SectionHeader)
content/              # Content data
  products.ts         # Product definitions (add new products here)
  blog/               # Markdown blog posts (add .md files here)
lib/                  # Utilities and data helpers
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
