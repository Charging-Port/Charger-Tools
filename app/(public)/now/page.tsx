import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNow } from "@/lib/content";
import { EditableNow } from "@/components/admin/editable-now";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What Kaden MacLean is currently working on, reading, and thinking about.",
};

export const dynamic = "force-dynamic";

export default async function NowPage() {
  const now = await getNow();

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Home
        </Link>

        <EditableNow initial={now} />
      </div>
    </div>
  );
}
