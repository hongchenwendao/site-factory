import Link from "next/link";
import { Container } from "@site-factory/ui";
import { siteConfig } from "@site-config";
import { CtaLink } from "./cta-link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <Container className="flex min-h-18 items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link className="font-display text-2xl tracking-tight text-foreground" href="/">
            {siteConfig.name}
          </Link>
          <span className="hidden text-sm text-muted-foreground lg:inline">
            {siteConfig.hero.eyebrow}
          </span>
        </div>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <CtaLink href="/contact" label={siteConfig.cta.label} variant="secondary" />
      </Container>
    </header>
  );
}
