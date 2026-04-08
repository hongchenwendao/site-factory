import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@site-config";
import {
  buildMetadata,
  buildBreadcrumbSchema,
  buildProductSchema,
  buildFaqSchema,
  JsonLd,
} from "@site-factory/seo";
import { Container, SectionShell, SurfaceCard, buttonClassName } from "@site-factory/ui";
import { FAQGridSection } from "@/components/sections/faq-grid";
import { CtaPanelSection } from "@/components/sections/cta-panel";
import {
  getPostSummaries,
  getProductDetail,
  getProductSummaries,
  getRenderableImage,
} from "@site-factory/sanity";
import { getRelatedPosts } from "@/lib/related-content";
import { getSeoConfig, siteUrl } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const seo = getSeoConfig();

export const revalidate = 86400;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProductSummaries();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) return {};
  const metadataImage = getRenderableImage(product.seo?.ogImage) ?? getRenderableImage(product.images[0]);

  return buildMetadata(seo, {
    path: `/products/${slug}`,
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.description,
    ...(metadataImage ? { image: metadataImage.asset.url } : {}),
    ...(product.seo?.keywords ? { keywords: product.seo.keywords } : {}),
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  const [posts] = await Promise.all([getPostSummaries()]);
  const relatedPosts = getRelatedPosts(product, posts);
  const galleryImages = product.images
    .map((image) => getRenderableImage(image))
    .filter((image) => image !== null);
  const schemaImage = galleryImages[0];
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${slug}` },
  ]);

  const productSchema = buildProductSchema({
    siteUrl,
    name: product.name,
    description: product.description,
    slug,
    ...(schemaImage ? { image: schemaImage.asset.url } : {}),
    brand: siteConfig.name,
  });

  const schemas: Record<string, unknown>[] = [breadcrumb, productSchema];
  if (product.faq.length > 0) {
    schemas.push(buildFaqSchema(product.faq));
  }

  return (
    <>
      <JsonLd data={schemas} />
      <SectionShell>
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Link
              className="text-sm font-medium text-accent transition-colors hover:text-primary"
              href="/products"
            >
              &larr; Back to products
            </Link>
            <h1 className="mt-8 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {product.description}
            </p>
            {galleryImages.length > 0 ? (
              <div className="mt-8 space-y-4">
                {galleryImages.map((image) => (
                  <Image
                    alt={image.alt}
                    className="w-full rounded-2xl"
                    height={image.asset.height}
                    key={image.alt}
                    src={image.asset.url}
                    width={image.asset.width}
                  />
                ))}
              </div>
            ) : null}
            {relatedPosts.length > 0 ? (
              <div className="mt-12 border-t border-border pt-8">
                <h2 className="font-display text-2xl tracking-tight text-foreground">
                  Related articles
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {relatedPosts.map((post) => (
                    <Link
                      className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-primary hover:text-primary-foreground"
                      href={`/blog/${post.slug}`}
                      key={post.slug}
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="space-y-6">
            {product.category ? (
              <div>
                <Link
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-primary hover:text-primary-foreground"
                  href={`/products?category=${product.category.slug}`}
                >
                  {product.category.name}
                </Link>
              </div>
            ) : null}
            {product.specifications.length > 0 ? (
              <SurfaceCard>
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Specifications
                </h2>
                <dl className="mt-6 space-y-4">
                  {product.specifications.map((spec) => (
                    <div
                      className="flex items-center justify-between gap-4 border-t border-border pt-3"
                      key={spec.label}
                    >
                      <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </SurfaceCard>
            ) : null}
            {(product.moq || product.leadTime || (product.certifications && product.certifications.length > 0)) ? (
              <SurfaceCard>
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Ordering info
                </h2>
                <dl className="mt-6 space-y-4">
                  {product.moq ? (
                    <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                      <dt className="text-sm text-muted-foreground">Minimum order</dt>
                      <dd className="text-sm font-semibold text-foreground">{product.moq}</dd>
                    </div>
                  ) : null}
                  {product.leadTime ? (
                    <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                      <dt className="text-sm text-muted-foreground">Lead time</dt>
                      <dd className="text-sm font-semibold text-foreground">{product.leadTime}</dd>
                    </div>
                  ) : null}
                  {product.certifications && product.certifications.length > 0 ? (
                    <div className="border-t border-border pt-3">
                      <dt className="text-sm text-muted-foreground">Certifications</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {product.certifications.map((cert) => (
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground" key={cert}>
                            {cert}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </SurfaceCard>
            ) : null}
            <Link
              className={buttonClassName({ size: "large" })}
              href={`/contact?product=${product.slug}`}
            >
              Request a Quote
            </Link>
          </div>
        </Container>
      </SectionShell>
      {product.faq.length > 0 ? (
        <FAQGridSection
          eyebrow="FAQ"
          items={product.faq}
          title="Frequently asked questions"
        />
      ) : null}
      <CtaPanelSection />
    </>
  );
}
