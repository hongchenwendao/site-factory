import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@site-config";
import {
  buildMetadata,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFaqSchema,
  JsonLd,
} from "@site-factory/seo";
import { Container, SectionShell } from "@site-factory/ui";
import { PortableText } from "@/components/content/portable-text";
import { FAQGridSection } from "@/components/sections/faq-grid";
import { CtaPanelSection } from "@/components/sections/cta-panel";
import {
  getPostDetail,
  getPostSummaries,
  getProductSummaries,
  getRenderableImage,
} from "@site-factory/sanity";
import { getRelatedProducts } from "@/lib/related-content";
import { getSeoConfig, siteUrl } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const seo = getSeoConfig();

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPostSummaries();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) return {};
  const metadataImage = getRenderableImage(post.seo?.ogImage) ?? getRenderableImage(post.featuredImage);

  return buildMetadata(seo, {
    path: `/blog/${slug}`,
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    ...(metadataImage ? { image: metadataImage.asset.url } : {}),
    ...(post.seo?.keywords ? { keywords: post.seo.keywords } : {}),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostDetail(slug);

  if (!post) {
    notFound();
  }

  const [products] = await Promise.all([getProductSummaries()]);
  const relatedProducts = getRelatedProducts(post, products);
  const image = getRenderableImage(post.featuredImage);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ]);

  const articleSchema = buildArticleSchema({
    siteUrl,
    title: post.title,
    description: post.seo?.description ?? post.excerpt ?? "",
    slug,
    publishedAt: post.publishedAt,
    ...(image ? { image: image.asset.url } : {}),
    authorName: siteConfig.name,
  });

  const schemas: Record<string, unknown>[] = [breadcrumb, articleSchema];
  if (post.faq && post.faq.length > 0) {
    schemas.push(buildFaqSchema(post.faq));
  }

  return (
    <>
      <JsonLd data={schemas} />
      <SectionShell>
        <Container className="max-w-3xl">
          <Link
            className="text-sm font-medium text-accent transition-colors hover:text-primary"
            href="/blog"
          >
            &larr; Back to blog
          </Link>
          <h1 className="mt-8 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {image ? (
            <Image
              alt={image.alt}
              className="mt-8 w-full rounded-2xl"
              height={image.asset.height}
              src={image.asset.url}
              width={image.asset.width}
            />
          ) : null}
          {post.body ? <PortableText value={post.body} /> : null}
          {relatedProducts.length > 0 ? (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                Related products
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {relatedProducts.map((product) => (
                  <Link
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-primary hover:text-primary-foreground"
                    href={`/products/${product.slug}`}
                    key={product.slug}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </SectionShell>
      {post.faq && post.faq.length > 0 ? (
        <FAQGridSection
          eyebrow="FAQ"
          items={post.faq}
          title="Frequently asked questions"
        />
      ) : null}
      <CtaPanelSection />
    </>
  );
}
