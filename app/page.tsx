import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { MarqueeStrip } from "@/components/marquee-strip";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Home() {
  const products = getAllProducts();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />

      {/* Marquee ticker — between hero and work */}
      <MarqueeStrip />

      {/* ── Work section ──────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between mb-14 md:mb-20">
            <SectionHeader
              number="01"
              title="Work"
              description="Hardware and software built from scratch."
              className="mb-0"
            />
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 hover:text-foreground transition-colors link-underline-accent link-underline uppercase tracking-widest"
            >
              All projects <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                featured={i === 0}
              />
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              All projects <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider strip */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      {/* ── About preview ─────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: header + bio */}
            <div className="lg:col-span-7">
              <SectionHeader number="02" title="About me" className="mb-8" />
              <div className="space-y-4 text-muted-foreground/70 leading-relaxed">
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  I&apos;m Kaden — a high school junior building at the
                  intersection of hardware and software.
                </p>
                <p>
                  I started ChargerTools LLC to formalize the projects I was
                  already building. The name comes from the approach: take an
                  idea, charge at it, build the tools to make it real. FRC Team
                  254 taught me that the best engineering happens under
                  constraints.
                </p>
                <p>
                  I&apos;m most alive when a project doesn&apos;t exist
                  yet — designing optics for AR glasses, writing firmware for
                  glove input systems, or shipping a native macOS app from
                  scratch.
                </p>
              </div>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/50 px-5 py-2.5 rounded-xl hover:bg-muted/30 hover:border-border transition-all"
              >
                Full bio <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: skills + quick facts */}
            <div className="lg:col-span-5 space-y-5">
              {/* Domain tags */}
              <div>
                <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">
                  Domains
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Wearable Computing",
                    "Augmented Reality",
                    "macOS Development",
                    "AI / ML",
                    "Computer Vision",
                    "Robotics",
                    "Optics",
                    "Embedded Systems",
                    "Directed Energy",
                    "Biomechanics",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag text-[11px] font-mono text-muted-foreground/55 bg-muted/25 border border-border/35 px-3 py-1.5 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick credentials */}
              <div className="rounded-2xl border border-border/35 bg-card/40 p-5 space-y-0">
                {[
                  { icon: "◈", label: "FRC Team", value: "254 — The Cheesy Poofs" },
                  { icon: "◈", label: "Current build", value: "AR glasses from scratch" },
                  { icon: "◈", label: "Platform", value: "Native macOS & Swift" },
                  { icon: "◈", label: "Approach", value: "AI-powered, privacy-first" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground/70">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second marquee — reverse direction */}
      <MarqueeStrip reverse />

      {/* ── Writing section ───────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between mb-14 md:mb-20">
              <SectionHeader
                number="03"
                title="Writing"
                description="Notes on building, learning, and shipping."
                className="mb-0"
              />
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 hover:text-foreground transition-colors link-underline link-underline-accent uppercase tracking-widest"
              >
                All posts <ArrowUpRight size={12} />
              </Link>
            </div>
            <div>
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
            <div className="mt-6 md:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All posts <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      {/* ── CTA + Newsletter ──────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Newsletter */}
            <div>
              <SectionHeader number="04" title="Stay in the loop" className="mb-6" />
              <p className="text-sm text-muted-foreground/60 mb-8 max-w-sm leading-relaxed">
                Occasional updates on new projects and writeups. No noise.
              </p>
              <NewsletterSignup />
            </div>

            {/* Contact CTA */}
            <div className="lg:pt-16">
              <div className="relative rounded-2xl border border-border/35 bg-card/40 p-8 md:p-10 overflow-hidden group hover:border-border/65 transition-all duration-500 card-lift">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/4 rounded-full blur-3xl group-hover:bg-accent/8 transition-colors pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/3 rounded-full blur-2xl pointer-events-none" />

                <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">
                  Let&apos;s talk
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                  Have a project idea?
                </h3>
                <p className="text-sm text-muted-foreground/60 mb-7 leading-relaxed">
                  I&apos;m always interested in talking about new ideas,
                  technical challenges, or collaboration.
                </p>
                <Link
                  href="/contact"
                  className="btn-accent-glow inline-flex items-center gap-2.5 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
                >
                  Get in touch <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
