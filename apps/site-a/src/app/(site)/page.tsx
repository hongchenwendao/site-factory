import { siteConfig } from "@site-config";
import { HeroSection } from "@/components/sections/hero";
import { ValuePropsSection } from "@/components/sections/value-props";
import { FeaturedPostsSection } from "@/components/sections/featured-posts";
import { FeaturedProductsSection } from "@/components/sections/featured-products";
import { CtaPanelSection } from "@/components/sections/cta-panel";
import { getPostSummaries, getProductSummaries } from "@site-factory/sanity";

export default async function HomePage() {
  const [posts, products] = await Promise.all([
    getPostSummaries(),
    getProductSummaries(),
  ]);

  const featuredPosts = siteConfig.content.featuredPostSlugs.length > 0
    ? posts.filter((p) => siteConfig.content.featuredPostSlugs.includes(p.slug))
    : posts.slice(0, 2);

  const featuredProducts = siteConfig.content.featuredProductSlugs.length > 0
    ? products.filter((p) => siteConfig.content.featuredProductSlugs.includes(p.slug))
    : products.slice(0, 2);

  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      {siteConfig.content.productsEnabled && featuredProducts.length > 0 ? (
        <FeaturedProductsSection products={featuredProducts} />
      ) : null}
      {siteConfig.content.blogEnabled && featuredPosts.length > 0 ? (
        <FeaturedPostsSection posts={featuredPosts} />
      ) : null}
      <CtaPanelSection />
    </>
  );
}
