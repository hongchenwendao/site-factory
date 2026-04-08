import type {
  PostDetail,
  PostSummary,
  ProductDetail,
  ProductSummary,
} from "@site-factory/sanity";

export function getRelatedProducts(
  post: PostDetail,
  products: ProductSummary[],
  limit = 2,
) {
  const relatedSlugs = new Set((post.relatedProducts ?? []).map((item) => item.slug));

  return products
    .filter((product) => relatedSlugs.has(product.slug))
    .slice(0, limit);
}

export function getRelatedPosts(
  product: ProductDetail,
  posts: PostSummary[],
  limit = 2,
) {
  const relatedSlugs = new Set((product.relatedPosts ?? []).map((item) => item.slug));

  return posts.filter((post) => relatedSlugs.has(post.slug)).slice(0, limit);
}
