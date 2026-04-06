/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // No remotePatterns: only self-hosted images are allowed
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Deny framing entirely (also covered by CSP frame-ancestors)
          { key: "X-Frame-Options", value: "DENY" },

          // Enforce HTTPS for 2 years; include subdomains; eligible for preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Don't send full Referer to cross-origin destinations
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Disable unused browser features
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // Content Security Policy
          // NOTE: 'unsafe-inline' on script-src is required by Next.js 14 because it
          // injects inline <script id="__NEXT_DATA__"> for hydration. A nonce-based
          // approach would require middleware rewriting every response — too costly for
          // this static site. When migrating to Next.js 15+ with Partial Prerendering,
          // revisit this and add a per-request nonce via middleware.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js hydration requires unsafe-inline for inline script tags
              "script-src 'self' 'unsafe-inline'",
              // Tailwind and next-themes inject runtime inline styles
              "style-src 'self' 'unsafe-inline'",
              // next/font self-hosts fonts at /_next/static — no external font CDN needed
              "font-src 'self'",
              // Allow data URIs for inline SVGs/images and blob for future media
              "img-src 'self' data: blob:",
              // Only talk to self (API routes are same-origin)
              "connect-src 'self'",
              // Disallow all frames
              "frame-ancestors 'none'",
              // Restrict <base> tag abuse
              "base-uri 'self'",
              // Forms can only submit to same origin
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
