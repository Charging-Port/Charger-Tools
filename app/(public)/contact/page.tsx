import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/contact-form";
import { Mail, ArrowUpRight, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ChargerTools.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          number="00"
          title="Get in touch"
          italic="anytime"
          description="Have a project idea, technical question, or just want to say hi? Send a message — I read everything."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Direct email */}
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
              <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-4">
                ◆ direct line
              </p>
              <a
                href="mailto:kadenmac0077@gmail.com"
                className="flex items-center gap-2.5 text-foreground hover:text-accent transition-colors group"
              >
                <Mail size={15} className="text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="text-sm font-mono">kadenmac0077@gmail.com</span>
                <ArrowUpRight
                  size={12}
                  className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </a>
              <a
                href="https://github.com/chargertools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 mt-3 text-foreground hover:text-accent transition-colors group"
              >
                <Github size={15} className="text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="text-sm font-mono">github.com/chargertools</span>
                <ArrowUpRight
                  size={12}
                  className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </a>
              <p className="mt-4 text-xs font-mono text-muted-foreground/55">
                Response within 24–48h
              </p>
            </div>

            {/* What I'm open to */}
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6">
              <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-4">
                ◇ open to
              </p>
              <div className="space-y-2.5">
                {[
                  "Hardware / software collaborations",
                  "Technical consulting or advising",
                  "Demo or speaking opportunities",
                  "Feedback on products in flight",
                  "Just cool conversations",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-accent text-sm mt-0.5">▸</span>
                    <span className="text-sm text-foreground/75">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-accent/30 bg-accent/8 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs text-accent/85 font-mono">
                Currently open to collaboration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
