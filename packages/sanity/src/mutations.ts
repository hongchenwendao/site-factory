import type { PortableTextBlock } from "@portabletext/types";

import { getSanityWriteClient } from "./client";
import type { PostStatus, FAQItem, ProductSpec } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt: string;
  body: PortableTextBlock[];
  faq?: FAQItem[];
  categories?: string[];
  relatedProductIds?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  publishedAt?: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  categoryId?: string;
  specifications?: ProductSpec[];
  moq?: string;
  leadTime?: string;
  certifications?: string[];
  faq?: FAQItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface MutationResult {
  documentId: string;
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function textToPortableText(text: string): PortableTextBlock[] {
  return text.split("\n\n").filter(Boolean).map((paragraph, i) => ({
    _type: "block" as const,
    _key: `block-${i}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `span-${i}-0`,
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

function requireWriteClient() {
  const client = getSanityWriteClient();
  if (!client) {
    throw new Error(
      "Sanity write client not available. Set SANITY_API_WRITE_TOKEN env var."
    );
  }
  return client;
}

// ---------------------------------------------------------------------------
// Post mutations
// ---------------------------------------------------------------------------

/** Create a blog post in draft status. */
export async function createPost(input: CreatePostInput): Promise<MutationResult> {
  const client = requireWriteClient();

  try {
    const doc = {
      _type: "post",
      status: "draft" as PostStatus,
      title: input.title,
      slug: { _type: "slug", current: input.slug },
      excerpt: input.excerpt,
      body: input.body ?? textToPortableText(""),
      publishedAt: input.publishedAt ?? new Date().toISOString(),
      ...(input.faq?.length
        ? { faq: input.faq.map((f, i) => ({ _key: `faq-${i}`, ...f })) }
        : {}),
      ...(input.relatedProductIds?.length
        ? {
            relatedProducts: input.relatedProductIds.map((id) => ({
              _type: "reference",
              _ref: id,
              _key: `ref-${id}`,
            })),
          }
        : {}),
      ...(input.seo
        ? {
            seo: {
              _type: "seoFields",
              metaTitle: input.seo.metaTitle,
              metaDescription: input.seo.metaDescription,
              ...(input.seo.keywords?.length
                ? { keywords: input.seo.keywords }
                : {}),
            },
          }
        : {}),
    };

    const result = await client.create(doc);
    return { documentId: result._id, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mutation] createPost failed:", { slug: input.slug, error: message });
    return { documentId: "", success: false, error: message };
  }
}

/** Transition a post to a new status (draft → in_review → published). */
export async function updatePostStatus(
  documentId: string,
  status: PostStatus
): Promise<MutationResult> {
  const client = requireWriteClient();

  try {
    await client.patch(documentId).set({ status }).commit();
    return { documentId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mutation] updatePostStatus failed:", { documentId, status, error: message });
    return { documentId, success: false, error: message };
  }
}

/** Publish a post (set status to published and update publishedAt). */
export async function publishPost(documentId: string): Promise<MutationResult> {
  const client = requireWriteClient();

  try {
    await client
      .patch(documentId)
      .set({ status: "published", publishedAt: new Date().toISOString() })
      .commit();
    return { documentId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mutation] publishPost failed:", { documentId, error: message });
    return { documentId, success: false, error: message };
  }
}

/** Batch-update status for multiple posts. */
export async function batchUpdatePostStatus(
  documentIds: string[],
  status: PostStatus
): Promise<MutationResult[]> {
  return Promise.all(documentIds.map((id) => updatePostStatus(id, status)));
}

// ---------------------------------------------------------------------------
// Product mutations
// ---------------------------------------------------------------------------

/** Create a product in draft status. */
export async function createProduct(
  input: CreateProductInput
): Promise<MutationResult> {
  const client = requireWriteClient();

  try {
    const doc = {
      _type: "product",
      name: input.name,
      slug: { _type: "slug", current: input.slug },
      description: input.description,
      ...(input.categoryId
        ? {
            category: {
              _type: "reference",
              _ref: input.categoryId,
            },
          }
        : {}),
      ...(input.specifications?.length
        ? {
            specifications: input.specifications.map((s, i) => ({
              _key: `spec-${i}`,
              _type: "specificationItem",
              ...s,
            })),
          }
        : {}),
      ...(input.moq ? { moq: input.moq } : {}),
      ...(input.leadTime ? { leadTime: input.leadTime } : {}),
      ...(input.certifications?.length
        ? { certifications: input.certifications }
        : {}),
      ...(input.faq?.length
        ? { faq: input.faq.map((f, i) => ({ _key: `faq-${i}`, ...f })) }
        : {}),
      ...(input.seo
        ? {
            seo: {
              _type: "seoFields",
              metaTitle: input.seo.metaTitle,
              metaDescription: input.seo.metaDescription,
              ...(input.seo.keywords?.length
                ? { keywords: input.seo.keywords }
                : {}),
            },
          }
        : {}),
    };

    const result = await client.create(doc);
    return { documentId: result._id, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mutation] createProduct failed:", { slug: input.slug, error: message });
    return { documentId: "", success: false, error: message };
  }
}

/** Batch-create products. */
export async function batchCreateProducts(
  inputs: CreateProductInput[]
): Promise<MutationResult[]> {
  return Promise.all(inputs.map((input) => createProduct(input)));
}

// ---------------------------------------------------------------------------
// Delete mutations
// ---------------------------------------------------------------------------

/** Delete a document by ID. */
export async function deleteDocument(
  documentId: string
): Promise<MutationResult> {
  const client = requireWriteClient();

  try {
    await client.delete(documentId);
    return { documentId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[mutation] deleteDocument failed:", { documentId, error: message });
    return { documentId, success: false, error: message };
  }
}