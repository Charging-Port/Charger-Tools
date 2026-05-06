import { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Mail, Github, ArrowUpRight } from "lucide-react";
import { getSiteText } from "@/lib/site-text";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kaden MacLean.",
};

export default function ContactPage() {
  const text = getSiteText();
  const contact = text.contact;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12 md:mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Get in touch
          </h1>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-xl">
            {contact.intro}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <ContactForm />
          </div>
          <aside className="md:col-span-5 space-y-8 md:border-l md:border-border md:pl-10">
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">
                Direct
              </h2>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:kadenmac0077@gmail.com"
                  className="group flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors"
                >
                  <Mail size={14} />
                  <span className="link-underline">kadenmac0077@gmail.com</span>
                </a>
                <a
                  href="https://github.com/chargertools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-foreground/75 hover:text-foreground transition-colors"
                >
                  <Github size={14} />
                  <span className="link-underline">github.com/chargertools</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground mb-3">
                Open to
              </h2>
              <ul className="space-y-2 text-sm text-foreground/70 leading-relaxed">
                {contact.openTo.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
