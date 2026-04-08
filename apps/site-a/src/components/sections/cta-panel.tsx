import { Container, SectionShell } from "@site-factory/ui";
import { siteConfig } from "@site-config";
import { getCtaHref } from "@/lib/site";
import { CtaLink } from "@/components/site/cta-link";

export function CtaPanelSection() {
  return (
    <SectionShell surface="accent">
      <Container className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
            Conversion boundary
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            {siteConfig.cta.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
            {siteConfig.cta.description}
          </p>
        </div>
        <div className="flex justify-start lg:justify-end">
          <CtaLink
            className="min-w-56"
            href={getCtaHref()}
            label={siteConfig.cta.label}
            size="large"
          />
        </div>
      </Container>
    </SectionShell>
  );
}
