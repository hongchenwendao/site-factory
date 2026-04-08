import { groq } from "next-sanity";
import { getSanityClient } from "./client";
import { demoCategories, demoPosts, demoProducts, demoSiteSettings } from "./demo/data";
import type { PostDetail, PostSummary, ProductCategorySummary, ProductDetail, ProductSummary, SiteSettings } from "./types";

function normalizePostSummary(post: PostSummary): PostSummary {
  return {
    ...post,
    categories: post.categories ?? [],
    relatedProducts: post.relatedProducts ?? [],
  };
}

function normalizePostDetail(post: PostDetail): PostDetail {
  return {
    ...normalizePostSummary(post),
    body: post.body ?? [],
    faq: post.faq ?? [],
  };
}

function normalizeProductSummary(product: ProductSummary): ProductSummary {
  return {
    ...product,
    images: product.images ?? [],
    specifications: product.specifications ?? [],
    certifications: product.certifications ?? [],
    relatedPosts: product.relatedPosts ?? [],
  };
}

function normalizeProductDetail(product: ProductDetail): ProductDetail {
  return {
    ...normalizeProductSummary(product),
    faq: product.faq ?? [],
  };
}

const postSummaryQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "featuredImage": {
      "alt": coalesce(featuredImage.alt, title),
      "asset": {
        "url": featuredImage.asset->url,
        "width": featuredImage.asset->metadata.dimensions.width,
        "height": featuredImage.asset->metadata.dimensions.height
      }
    },
    "categories": categories[]->title,
    "relatedProducts": relatedProducts[]->{
      name,
      "slug": slug.current
    },
    "seo": {
      "title": seo.metaTitle,
      "description": seo.metaDescription,
      keywords,
      "ogImage": {
        "alt": coalesce(seo.ogImage.alt, title),
        "asset": {
          "url": seo.ogImage.asset->url,
          "width": seo.ogImage.asset->metadata.dimensions.width,
          "height": seo.ogImage.asset->metadata.dimensions.height
        }
      }
    }
  }
`;

const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    body,
    "faq": faq[]{
      question,
      answer
    },
    "featuredImage": {
      "alt": coalesce(featuredImage.alt, title),
      "asset": {
        "url": featuredImage.asset->url,
        "width": featuredImage.asset->metadata.dimensions.width,
        "height": featuredImage.asset->metadata.dimensions.height
      }
    },
    "categories": categories[]->title,
    "relatedProducts": relatedProducts[]->{
      name,
      "slug": slug.current
    },
    "seo": {
      "title": seo.metaTitle,
      "description": seo.metaDescription,
      keywords,
      "ogImage": {
        "alt": coalesce(seo.ogImage.alt, title),
        "asset": {
          "url": seo.ogImage.asset->url,
          "width": seo.ogImage.asset->metadata.dimensions.width,
          "height": seo.ogImage.asset->metadata.dimensions.height
        }
      }
    }
  }
`;

const productSummaryQuery = groq`
  *[_type == "product"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    description,
    "images": images[]{
      "alt": coalesce(alt, name),
      "asset": {
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    },
    "category": category->{
      name,
      "slug": slug.current
    },
    specifications,
    moq,
    leadTime,
    certifications,
    "relatedPosts": relatedPosts[]->{
      title,
      "slug": slug.current
    },
    "seo": {
      "title": seo.metaTitle,
      "description": seo.metaDescription,
      keywords,
      "ogImage": {
        "alt": coalesce(seo.ogImage.alt, name),
        "asset": {
          "url": seo.ogImage.asset->url,
          "width": seo.ogImage.asset->metadata.dimensions.width,
          "height": seo.ogImage.asset->metadata.dimensions.height
        }
      }
    }
  }
`;

const productDetailQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    "id": _id,
    name,
    "slug": slug.current,
    description,
    "images": images[]{
      "alt": coalesce(alt, name),
      "asset": {
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    },
    "category": category->{
      name,
      "slug": slug.current
    },
    specifications,
    moq,
    leadTime,
    certifications,
    "faq": faq[]{
      question,
      answer
    },
    "relatedPosts": relatedPosts[]->{
      title,
      "slug": slug.current
    },
    "seo": {
      "title": seo.metaTitle,
      "description": seo.metaDescription,
      keywords,
      "ogImage": {
        "alt": coalesce(seo.ogImage.alt, name),
        "asset": {
          "url": seo.ogImage.asset->url,
          "width": seo.ogImage.asset->metadata.dimensions.width,
          "height": seo.ogImage.asset->metadata.dimensions.height
        }
      }
    }
  }
`;

const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyStory,
    "navigation": navigation[]{
      label,
      href
    },
    "footerLinks": footerLinks[]{
      label,
      href
    },
    "socialLinks": socialLinks[]{
      label,
      href
    },
    contactHeadline,
    contactBody
  }
`;

const productCategoryQuery = groq`
  *[_type == "productCategory"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    description
  }
`;

async function fetchWithFallback<T>(
  query: string,
  params: Record<string, string> | undefined,
  fallback: T,
): Promise<T> {
  const client = getSanityClient();
  if (!client) {
    return fallback;
  }

  try {
    const result = params
      ? await client.fetch<T>(query, params)
      : await client.fetch<T>(query);
    return result ?? fallback;
  } catch (error) {
    console.error("[sanity] fetch failed, using fallback content", error);
    return fallback;
  }
}

export async function getPostSummaries(): Promise<PostSummary[]> {
  const posts = await fetchWithFallback(postSummaryQuery, undefined, demoPosts);
  return posts.map(normalizePostSummary);
}

export async function getPostDetail(slug: string): Promise<PostDetail | null> {
  const post = await fetchWithFallback(
    postDetailQuery,
    { slug },
    demoPosts.find((post) => post.slug === slug) ?? null,
  );
  return post ? normalizePostDetail(post) : null;
}

export async function getProductSummaries(): Promise<ProductSummary[]> {
  const products = await fetchWithFallback(productSummaryQuery, undefined, demoProducts);
  return products.map(normalizeProductSummary);
}

export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
  const product = await fetchWithFallback(
    productDetailQuery,
    { slug },
    demoProducts.find((product) => product.slug === slug) ?? null,
  );
  return product ? normalizeProductDetail(product) : null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchWithFallback(siteSettingsQuery, undefined, demoSiteSettings);
}

export async function getProductCategories(): Promise<ProductCategorySummary[]> {
  return fetchWithFallback(productCategoryQuery, undefined, demoCategories);
}
