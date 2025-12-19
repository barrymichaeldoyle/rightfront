import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

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
  metadataBase: new URL("https://rightfront.app"),
  title: {
    default: "RightFront — Right Storefront Links",
    template: "%s — RightFront",
  },
  description:
    "Geo-aware links that route each user to the correct App Store or Play Store for their country or region—so you stop losing installs to Not Available and Not Found pages.",
  applicationName: "RightFront",
  keywords: [
    "app store link",
    "smart link",
    "deep link",
    "app store redirect",
    "google play redirect",
    "storefront link",
    "right storefront",
    "localization",
    "marketing links",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "RightFront",
    title: "RightFront — Right Storefront Links",
    description:
      "Geo-aware links that route each user to the correct App Store or Play Store for their country or region—so you stop losing installs to Not Available and Not Found pages.",
  },
  twitter: {
    card: "summary",
    title: "RightFront — Right Storefront Links",
    description:
      "Geo-aware links that route each user to the correct App Store or Play Store for their country or region—so you stop losing installs to Not Available and Not Found pages.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
