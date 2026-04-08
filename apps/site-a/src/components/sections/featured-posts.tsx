import { Container, SectionHeading, SectionShell } from "@site-factory/ui";
import { PostCard } from "@/components/content/post-card";
import type { PostSummary } from "@site-factory/sanity";

interface FeaturedPostsSectionProps {
  posts: PostSummary[];
}

export function FeaturedPostsSection({ posts }: FeaturedPostsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <SectionShell>
      <Container>
        <SectionHeading
          description="Practical guides and playbooks drawn from real launch experience."
          eyebrow="From the blog"
          title="Recent articles"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
