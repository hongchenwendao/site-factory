import type { Metadata } from "next";

import { siteConfig } from "@site-config";
import { buildMetadata, buildBreadcrumbSchema, JsonLd } from "@site-factory/seo";
import { Container, SectionHeading, SectionShell } from "@site-factory/ui";
import { PostCard } from "@/components/content/post-card";
import { getPostSummaries } from "@site-factory/sanity";
import { getSeoConfig, siteUrl } from "@/lib/site";

const seo = getSeoConfig();

export const metadata: Metadata = buildMetadata(seo, {
  path: "/blog",
  title: "Blog",
  description: `Articles and insights from ${siteConfig.name}.`,
  keywords: siteConfig.defaultMeta.keywords,
});

export default async function BlogListPage() {
  const posts = await getPostSummaries();
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <SectionShell>
        <Container>
          <SectionHeading
            description="Practical guides and playbooks drawn from real launch experience."
            eyebrow="Blog"
            title="Latest articles"
          />
          {posts.length > 0 ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-lg text-foreground/72">No posts yet.</p>
          )}
        </Container>
      </SectionShell>
    </>
  );
}
