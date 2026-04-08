import type { Metadata } from "next";
import type { ReactElement } from "react";

export interface SiteSeoConfig {
  name: string;
  siteUrl: string;
  locale: string;
  titleTemplate: string;
  description: string;
  defaultOgImage: string;
  social?: {
    x?: string;
    linkedIn?: string;
  };
}

export interface MetadataInput {
  path?: string;
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
}

function trimSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function absoluteUrl(siteUrl: string, path = "/") {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = trimSlash(siteUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildMetadata(
  site: SiteSeoConfig,
  input: MetadataInput,
): Metadata {
  const canonical = absoluteUrl(site.siteUrl, input.path ?? "/");
  const image = absoluteUrl(site.siteUrl, input.image ?? site.defaultOgImage);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: site.name,
      locale: site.locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
      creator: site.social?.x,
    },
    keywords: input.keywords,
  };
}

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

interface OrganizationSchemaInput {
  name: string;
  siteUrl: string;
  description: string;
  logo: string;
  sameAs?: string[];
}

export function buildOrganizationSchema(input: OrganizationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.siteUrl,
    description: input.description,
    logo: absoluteUrl(input.siteUrl, input.logo),
    sameAs: input.sameAs,
  };
}

interface WebSiteSchemaInput {
  siteUrl: string;
  name: string;
  description: string;
}

export function buildWebSiteSchema(input: WebSiteSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: input.description,
    name: input.name,
    url: input.siteUrl,
  };
}

interface ArticleSchemaInput {
  siteUrl: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  image?: string;
  authorName: string;
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
    image: input.image ? [absoluteUrl(input.siteUrl, input.image)] : undefined,
    author: {
      "@type": "Organization",
      name: input.authorName,
    },
    mainEntityOfPage: absoluteUrl(input.siteUrl, `/blog/${input.slug}`),
  };
}

interface ProductSchemaInput {
  siteUrl: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  sku?: string;
  brand: string;
}

export function buildProductSchema(input: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: input.image ? [absoluteUrl(input.siteUrl, input.image)] : undefined,
    brand: {
      "@type": "Brand",
      name: input.brand,
    },
    url: absoluteUrl(input.siteUrl, `/products/${input.slug}`),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
