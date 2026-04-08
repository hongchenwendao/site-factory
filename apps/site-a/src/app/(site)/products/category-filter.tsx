import Link from "next/link";
import type { ProductCategorySummary } from "@site-factory/sanity";

interface CategoryFilterProps {
  categories: ProductCategorySummary[];
  active: string | null;
}

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label="Product categories">
      <Link
        href="/products"
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          active === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          href={`/products?category=${category.slug}`}
          key={category.slug}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
