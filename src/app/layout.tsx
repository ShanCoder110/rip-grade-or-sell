import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeBootScript } from "@/components/theme-script";
import { publicEnv } from "@/env.public";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Rip, Grade or Sell — TCG sealed & grading decisions",
    template: "%s | Rip, Grade or Sell",
  },
  description:
    "Compare sealed product expected value, grading ROI, and net proceeds after marketplace fees for trading card games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 min-w-0 overflow-x-clip">
          {children}
        </main>
        <SiteFooter />
        <CookieConsent />
        <AdSenseScript />
      </body>
    </html>
  );
}
