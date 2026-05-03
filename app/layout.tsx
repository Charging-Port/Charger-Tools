import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminProvider } from "@/components/admin/admin-context";
import { EditBar } from "@/components/admin/edit-bar";
import { isAuthenticated } from "@/lib/admin-auth";
import { getStorageMode } from "@/lib/storage";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kaden MacLean — ChargerTools",
    template: "%s — ChargerTools",
  },
  description:
    "Kaden MacLean — building wearable computing, native macOS, and on-device AI under ChargerTools LLC.",
  openGraph: {
    title: "Kaden MacLean — ChargerTools",
    description:
      "Wearable computing, native macOS, and on-device AI from Kaden MacLean.",
    url: BASE_URL,
    siteName: "ChargerTools",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "ChargerTools" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaden MacLean — ChargerTools",
    description:
      "Wearable computing, native macOS, and on-device AI from Kaden MacLean.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check so the EditBar never flashes for visitors.
  // Cached as no-store on /admin and /api/admin paths via next.config.mjs;
  // public pages are dynamic anyway because of the cookie read here.
  const authed = isAuthenticated();
  const storageMode = getStorageMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} ${serif.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider initialAuthed={authed} storageMode={storageMode}>
            {children}
            <EditBar />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
