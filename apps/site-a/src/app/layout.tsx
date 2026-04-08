import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSeoConfig, siteUrl } from "@/lib/site";
import { siteConfig } from "@site-config";
import {
  buildMetadata,
  buildOrganizationSchema,
  buildWebSiteSchema,
  JsonLd,
} from "@site-factory/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const seo = getSeoConfig();

export const metadata: Metadata = {
  ...buildMetadata(seo, {
    path: "/",
    title: siteConfig.name,
    description: seo.description,
    image: seo.defaultOgImage,
    keywords: siteConfig.defaultMeta.keywords,
  }),
  title: {
    default: siteConfig.name,
    template: seo.titleTemplate,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = buildOrganizationSchema({
    name: siteConfig.name,
    siteUrl,
    description: seo.description,
    logo: siteConfig.logo,
    sameAs: siteConfig.social.map((s) => s.href),
  });

  const websiteSchema = buildWebSiteSchema({
    siteUrl,
    name: siteConfig.name,
    description: seo.description,
  });

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[orgSchema, websiteSchema]} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
