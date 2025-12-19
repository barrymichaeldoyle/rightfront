import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://rightfront.app"),
  title: {
    default: "RightFront — Geo-Aware App Store & Play Store Links",
    template: "%s — RightFront • Smart App Store Links",
  },
  description:
    "Geo‑aware App Store and Play Store links that automatically route users to the correct regional storefront—so you never lose installs to “Not Available” pages again.",
  applicationName: "RightFront",
  keywords: [
    "app store link",
    "app store redirect",
    "geo-aware links",
    "smart link generator",
    "app marketing link",
    "play store redirect",
    "mobile app localization",
    "deep link alternative",
    "storefront redirect",
    "global app distribution",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "RightFront",
    title: "RightFront — Geo‑Aware App Store & Play Store Links",
    description:
      "RightFront automatically routes users to the correct App Store or Play Store for their country—so you stop losing installs to Not Available pages.",
  },
  twitter: {
    card: "summary",
    title: "RightFront — Geo‑Aware App Store & Play Store Links",
    description:
      "Automatically route users to the correct App Store or Play Store storefront worldwide with RightFront.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RightFront",
  operatingSystem: "Web",
  applicationCategory: "DeveloperTool",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Geo-aware links that route users to the correct App Store or Play Store automatically.",
  url: "https://rightfront.app",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
