import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

import { features } from "@/lib/features";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const androidEnabled = features.androidEnabled;

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://rightfront.app"),
  title: {
    default: "RightFront — Geo-Aware App Store Links",
    template: "%s — RightFront • Smart App Store Links",
  },
  description:
    "Geo‑aware App Store links that automatically route users to the correct regional storefront—so you never lose installs to “Not Available” pages again.",
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
  openGraph: {
    type: "website",
    siteName: "RightFront",
    title: "RightFront — Geo‑Aware App Store Links",
    description:
      "RightFront automatically routes users to the correct App Store for their country—so you stop losing installs to Not Available pages.",
    url: "https://rightfront.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "RightFront — Geo‑Aware App Store Links",
    description:
      "Automatically route users to the correct App Store storefront worldwide with RightFront.",
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
    "Geo-aware links that route users to the correct App Store automatically.",
  url: "https://rightfront.app",
} as const;

const appearance = {
  variables: {
    colorPrimary: "#2563eb",
    colorBackground: "#020617",
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorDanger: "#ef4444",
    colorBorder: "rgba(148,163,184,0.25)",
    colorInputBackground: "rgba(2,6,23,0.6)",
    colorInputText: "#e2e8f0",
    colorInputTextSecondary: "#94a3b8",
    borderRadius: "12px",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    userButtonPopoverCard:
      "border border-slate-600/50 bg-slate-950/95 text-slate-100 shadow-2xl ring-1 ring-slate-600/30 backdrop-blur",
    userButtonPopoverFooter: "border-t border-slate-700/60",
    userButtonPopoverActionButton:
      "rounded-md text-slate-100 hover:bg-slate-800/70 [&_*]:text-slate-100",
    userButtonPopoverActionButtonText: "text-slate-100",
    userButtonPopoverActionButtonText__manageAccount: "text-slate-100",
    userButtonPopoverActionButtonIcon: "text-slate-300 [&_svg]:text-slate-300",
    userButtonPopoverActionButton__signOut: "rounded-md hover:bg-red-500/10",
    userButtonPopoverActionButtonText__signOut: "text-red-200",
    userButtonPopoverActionButtonIcon__signOut: "text-red-300",
    userButtonPopoverActionButton__manageAccount:
      "rounded-md hover:bg-slate-800/60",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider appearance={appearance}>
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
          <Analytics />
          <SpeedInsights />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
