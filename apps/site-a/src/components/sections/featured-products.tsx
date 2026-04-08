import { Container, SectionHeading, SectionShell } from "@site-factory/ui";
import { ProductCard } from "@/components/content/product-card";
import type { ProductSummary } from "@site-factory/sanity";

interface FeaturedProductsSectionProps {
  products: ProductSummary[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <SectionShell surface="muted">
      <Container>
        <SectionHeading
          description="Commercial-grade hardware designed for industrial-scale deployment."
          eyebrow="Products"
          title="What we build and ship"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
