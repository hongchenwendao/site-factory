import type { Metadata } from "next";

import { siteConfig } from "@site-config";
import { buildMetadata, buildBreadcrumbSchema, JsonLd } from "@site-factory/seo";
import { Container, SectionHeading, SectionShell } from "@site-factory/ui";
import { ProductCard } from "@/components/content/product-card";
import { getProductSummaries, getProductCategories } from "@site-factory/sanity";
import { getSeoConfig, siteUrl } from "@/lib/site";
import { CategoryFilter } from "./category-filter";

const seo = getSeoConfig();

export const metadata: Metadata = buildMetadata(seo, {
  path: "/products",
  title: "Products",
  description: `Explore products from ${siteConfig.name}.`,
  keywords: siteConfig.defaultMeta.keywords,
});

interface ProductListPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductListPage({ searchParams }: ProductListPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProductSummaries(),
    getProductCategories(),
  ]);

  const filtered = params.category
    ? products.filter((p) => p.category?.slug === params.category)
    : products;

  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <SectionShell>
        <Container>
          <SectionHeading
            description="Commercial-grade hardware designed for industrial-scale deployment."
            eyebrow="Products"
            title="Our product lineup"
          />
          {categories.length > 1 ? (
            <CategoryFilter
              categories={categories}
              active={params.category ?? null}
            />
          ) : null}
          {filtered.length > 0 ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-lg text-foreground/72">No products found in this category.</p>
          )}
        </Container>
      </SectionShell>
    </>
  );
}
