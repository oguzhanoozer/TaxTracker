import config from "@/lib/config"
import type { Metadata, Viewport } from "next"
import { Hanken_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Ledger",
    default: "Ledger — Bookkeeping for builders",
  },
  description: config.app.description,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.app.baseURL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.app.baseURL,
    title: "Ledger",
    description: config.app.description,
    siteName: "Ledger",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledger",
    description: config.app.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#F2EEE4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${newsreader.variable} ${mono.variable}`}
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
