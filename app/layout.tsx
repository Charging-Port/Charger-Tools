import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://charger.tools";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Charger Tools",
    template: "%s — Charger Tools",
  },
  description: "Charger Tools.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
