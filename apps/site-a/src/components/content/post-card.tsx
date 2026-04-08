import Image from "next/image";
import Link from "next/link";
import { getRenderableImage, type PostSummary } from "@site-factory/sanity";
import { SurfaceCard } from "@site-factory/ui";

interface PostCardProps {
  post: PostSummary;
}

export function PostCard({ post }: PostCardProps) {
  const image = getRenderableImage(post.featuredImage);

  return (
    <article>
      <SurfaceCard className="h-full overflow-hidden p-0">
        <div className="relative h-56 w-full bg-muted">
          {image ? (
            <Image
              alt={image.alt}
              className="h-56 w-full object-cover"
              height={image.asset.height}
              src={image.asset.url}
              width={image.asset.width}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(post.categories ?? []).map((category) => (
              <span
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </SurfaceCard>
    </article>
  );
}
