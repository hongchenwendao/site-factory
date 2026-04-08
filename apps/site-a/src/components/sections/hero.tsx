import { Container } from "@site-factory/ui";
import { siteConfig } from "@site-config";
import { CtaLink } from "@/components/site/cta-link";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-background pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24">
      <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="inline-flex rounded-full border border-primary/30 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {siteConfig.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {siteConfig.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {siteConfig.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaLink href={siteConfig.hero.primaryAction.href} label={siteConfig.hero.primaryAction.label} size="large" />
            <CtaLink
              href={siteConfig.hero.secondaryAction.href}
              label={siteConfig.hero.secondaryAction.label}
              size="large"
              variant="secondary"
            />
          </div>
        </div>
        <div className="rounded-4xl border border-border bg-[radial-gradient(circle_at_top,rgba(243,179,61,0.28),transparent_50%),linear-gradient(135deg,rgba(25,71,58,1),rgba(18,49,36,0.96))] p-8 text-white shadow-[0_24px_80px_-36px_rgba(25,71,58,0.55)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/64">
            Foundation metrics
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {siteConfig.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="font-display text-3xl">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{metric.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-md text-sm leading-7 text-white/72">
            Config, metadata, content model, and revalidation boundaries are aligned before the
            first market-specific page ever goes live.
          </p>
        </div>
      </Container>
    </section>
  );
}
