import type { PortableTextBlock } from "@portabletext/types";

export interface ImageAsset {
  url: string;
  width: number;
  height: number;
}

export interface SanityImage {
  alt: string;
  asset: ImageAsset;
}

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImage;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductReference {
  name: string;
  slug: string;
}

export interface PostReference {
  title: string;
  slug: string;
}

export interface ProductCategoryReference {
  name: string;
  slug: string;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featuredImage: SanityImage;
  categories: string[];
  relatedProducts: ProductReference[];
  seo?: SeoFields;
}

export interface PostDetail extends PostSummary {
  body: PortableTextBlock[];
  faq: FAQItem[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: SanityImage[];
  category?: ProductCategoryReference;
  specifications: ProductSpec[];
  moq?: string;
  leadTime?: string;
  certifications?: string[];
  relatedPosts: PostReference[];
  seo?: SeoFields;
}

export interface ProductDetail extends ProductSummary {
  faq: FAQItem[];
}

export interface SiteSettings {
  companyStory: string;
  navigation: LinkItem[];
  footerLinks: LinkItem[];
  socialLinks: SocialLink[];
  contactHeadline: string;
  contactBody: string;
}

export interface ProductCategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
