import { requireAuth } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/products";
import { ProductsAdmin } from "./_client";

export const metadata = {
  title: "Admin · Products",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function ProductsAdminPage() {
  requireAuth();
  const products = getAllProducts();
  return <ProductsAdmin initialProducts={products} />;
}
