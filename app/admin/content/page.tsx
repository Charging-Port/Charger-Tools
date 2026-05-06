import { requireAuth } from "@/lib/admin-auth";
import { ContentAdmin } from "./_client";

export const metadata = {
  title: "Admin · Content",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function ContentAdminPage() {
  requireAuth();
  return <ContentAdmin />;
}
