import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Cursor } from "@/components/cursor";
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
          {/* Skip-to-content: accessible keyboard shortcut to bypass nav */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>

          <Cursor />
          <Navbar />
          <main id="main-content" className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
