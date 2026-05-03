import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAbout } from "@/lib/content";
import { EditableAbout } from "@/components/admin/editable-about";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden MacLean — Hyperform Fitness co-founder, FRC Team 254, ChargerTools, computer vision, robotics, and music.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <EditableAbout initial={about} />

        <div className="mx-auto max-w-3xl">
          <div className="py-12 border-t border-border">
            <p className="text-foreground/75 leading-relaxed mb-5">
              Want to collaborate, ask a question, or just chat? I&apos;m open
              to hardware/software collaborations, technical advising, speaking,
              and the kind of email that starts with &ldquo;this is going to
              sound dumb but…&rdquo;
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              Get in touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
