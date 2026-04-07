import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ChargerTools — Building tools that matter",
    template: "%s — ChargerTools",
  },
  description:
    "Personal technology company focused on wearable computing, native macOS applications, and AI-powered tools.",

  openGraph: {
    title: "ChargerTools",
    description:
      "Personal technology company focused on wearable computing, native macOS applications, and AI-powered tools.",
    url: BASE_URL,
    siteName: "ChargerTools",
    type: "website",
    locale: "en_US",
    // Place a 1200×630 image at public/og-image.png to activate OG cards
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChargerTools — Building tools that matter",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ChargerTools",
    description:
      "Personal technology company focused on wearable computing, native macOS applications, and AI-powered tools.",
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
    // Place favicon files in public/ to activate
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} ${display.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/*
            Public pages (in app/(public)/) and admin pages (in app/admin/)
            each provide their own chrome via their own layouts. The root
            layout stays bare so React's hydration tree shape is identical
            for all pages — no conditional rendering, no mismatch.
          */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
