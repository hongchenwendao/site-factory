import Image from "next/image";
import Link from "next/link";
import { getRenderableImage, type ProductSummary } from "@site-factory/sanity";
import { SurfaceCard } from "@site-factory/ui";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = getRenderableImage(product.images[0]);

  return (
    <article>
      <SurfaceCard className="flex h-full flex-col overflow-hidden p-0">
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
            <div className="flex h-full items-center justify-center text-muted-foreground/40">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
          {product.category ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
              {product.category.name}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl tracking-tight text-foreground">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-4 text-sm leading-7 text-foreground/72">{product.description}</p>
          <dl className="mt-6 space-y-3">
            {product.specifications.slice(0, 3).map((specification) => (
              <div className="flex items-center justify-between gap-6 border-t border-black/6 pt-3" key={specification.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/48">
                  {specification.label}
                </dt>
                <dd className="text-sm font-medium text-foreground">{specification.value}</dd>
              </div>
            ))}
          </dl>
          {product.moq ? (
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              MOQ: {product.moq}
            </p>
          ) : null}
        </div>
      </SurfaceCard>
    </article>
  );
}
