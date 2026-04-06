import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/contact-form";
import { Mail, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ChargerTools.",
};

export default function ContactPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number="01"
          title="Get in touch"
          description="Have a project idea, question, or just want to say hello?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Direct email */}
            <div className="rounded-2xl border border-border/35 bg-card/40 p-6">
              <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
                Direct email
              </p>
              <a
                href="mailto:hello@chargertools.com"
                className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors group"
              >
                <Mail size={15} className="text-muted-foreground" />
                <span className="text-sm">hello@chargertools.com</span>
                <ArrowUpRight
                  size={12}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <p className="mt-3 text-xs font-mono text-muted-foreground/50">
                Response within 24–48h
              </p>
            </div>

            {/* What I&apos;m open to */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">
                Open to
              </p>
              <div className="space-y-3">
                {[
                  "Hardware / software collaborations",
                  "Technical consulting or advising",
                  "Demo or speaking opportunities",
                  "Feedback on products",
                  "Just cool conversations",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-accent text-sm mt-0.5">→</span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-sm text-muted-foreground/60 font-mono text-xs">
                Currently open to collaboration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
