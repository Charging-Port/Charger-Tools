import { requireAuth } from "@/lib/admin-auth";
import { BlogAdmin } from "./_client";

export const metadata = {
  title: "Admin · Blog",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function BlogAdminPage() {
  requireAuth();
  return <BlogAdmin />;
}
