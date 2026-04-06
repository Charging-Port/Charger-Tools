import { MetadataRoute } from "next";
import { getPostSlugs, getAllPosts } from "@/lib/blog";
import { getProductSlugs } from "@/lib/products";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Product detail pages
  const productRoutes: MetadataRoute.Sitemap = getProductSlugs().map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Blog post pages — use the post's actual published date when available
  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = getPostSlugs().map((slug) => {
    const post = posts.find((p) => p.slug === slug);
    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: post?.date ? new Date(post.date) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
