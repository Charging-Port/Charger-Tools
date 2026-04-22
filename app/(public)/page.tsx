import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { MarqueeStrip } from "@/components/marquee-strip";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { ProductCard } from "@/components/product-card";
import { NowPanel } from "@/components/now-panel";
import { TimelineRow } from "@/components/timeline-row";
import { SkillCloud } from "@/components/skill-cloud";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Home() {
  const products = getAllProducts();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />

      <MarqueeStrip />

      {/* ── Now panel ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <NowPanel />
        </div>
      </section>

      {/* ── Work section ──────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-end justify-between mb-14 md:mb-20">
            <SectionHeader
              number="01"
              title="Work"
              italic="& experiments"
              description="Hardware, software, and systems built from scratch. Each one a thread of the bigger picture."
              className="mb-0"
            />
            <Link
              href="/products"
              data-cursor-hover
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground/70 hover:text-accent transition-colors uppercase tracking-widest border border-border/50 px-3 py-2 rounded-full"
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

      <MarqueeStrip reverse />

      {/* ── Timeline ──────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeader
            number="02"
            title="Timeline"
            italic="of recent shipped things"
            description="A rolling log of what's gotten built recently."
          />
          <TimelineRow />
        </div>
      </section>

      {/* ── About preview ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <SectionHeader
                number="03"
                title="About"
                italic="me"
                className="mb-10"
              />
              <div className="space-y-5 text-foreground/70 leading-relaxed">
                <p className="text-foreground/95 text-xl md:text-2xl leading-snug font-editorial">
                  I&apos;m{" "}
                  <span className="text-accent">Kaden MacLean</span> — a junior
                  at Bellarmine College Prep building at the intersection of
                  hardware, software, and human movement.
                </p>
                <p className="text-base text-foreground/65">
                  I co-founded{" "}
                  <span className="text-foreground font-medium">
                    Hyperform Fitness
                  </span>
                  , a computer-vision startup delivering real-time corrective
                  feedback to athletes during their actual sets — over 1M reps
                  analyzed across pilot installations. I run{" "}
                  <span className="text-foreground font-medium">ChargerTools LLC</span>{" "}
                  for native macOS and personal R&amp;D, and I&apos;m on FRC
                  Team 254 (The Cheesy Poofs) for manufacturing, wiring, and
                  Human Player.
                </p>
                <p className="text-base text-foreground/65">
                  Outside engineering: piano since age four, principal bassist
                  of BCP Chamber Orchestra, FIRST Hall of Fame Student Advisory
                  Council member, former CyberPatriot team captain.
                </p>
              </div>
              <Link
                href="/about"
                data-cursor-hover
                className="mt-10 inline-flex items-center gap-3 text-sm font-medium text-foreground border border-border/70 px-6 py-3 rounded-full hover:bg-muted/30 hover:border-accent/40 transition-all group"
              >
                Full bio
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <SkillCloud />
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ── Writing section ───────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="flex items-end justify-between mb-14 md:mb-20">
              <SectionHeader
                number="04"
                title="Writing"
                italic="& notes"
                description="Notes on building, learning, and shipping."
                className="mb-0"
              />
              <Link
                href="/blog"
                data-cursor-hover
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground/70 hover:text-accent transition-colors uppercase tracking-widest border border-border/50 px-3 py-2 rounded-full"
              >
                All posts <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="border-t border-border/50">
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

      {/* ── CTA + Newsletter ──────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
            {/* Newsletter */}
            <div>
              <SectionHeader
                number="05"
                title="Signal"
                italic="& subscribe"
                className="mb-8"
              />
              <p className="text-base text-foreground/65 mb-8 max-w-md leading-relaxed">
                Occasional updates on new projects and writeups. No noise — just signal.
              </p>
              <NewsletterSignup />
            </div>

            {/* Contact CTA */}
            <div className="lg:pt-16">
              <div className="relative rounded-2xl border border-border/60 bg-card/50 p-8 md:p-10 overflow-hidden group hover:border-accent/40 transition-all duration-500 backdrop-blur-sm">
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-accent/15 rounded-full blur-3xl group-hover:bg-accent/25 transition-all pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-tertiary/12 rounded-full blur-3xl pointer-events-none" />

                <p className="text-[10px] font-mono text-accent/80 uppercase tracking-[0.2em] mb-5">
                  ◆ get in touch
                </p>
                <h3 className="font-editorial text-3xl md:text-5xl text-foreground mb-4 leading-[1.05]">
                  Have an idea?
                  <br />
                  <span className="italic text-accent">Let&apos;s build it.</span>
                </h3>
                <p className="text-base text-foreground/65 mb-8 leading-relaxed max-w-sm">
                  I&apos;m always open to talking about new ideas, technical
                  challenges, or collaboration.
                </p>
                <Link
                  href="/contact"
                  data-cursor-magnet
                  className="magnet-zone inline-flex items-center gap-3 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)]"
                >
                  Reach out <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
