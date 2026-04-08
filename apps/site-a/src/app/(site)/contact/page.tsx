import type { Metadata } from "next";
import { Suspense } from "react";

import { siteConfig } from "@site-config";
import { buildMetadata, buildBreadcrumbSchema, JsonLd } from "@site-factory/seo";
import { Container, SectionShell } from "@site-factory/ui";
import { ContactForm } from "@/components/site/contact-form";
import { getSeoConfig, siteUrl } from "@/lib/site";

const seo = getSeoConfig();

export const metadata: Metadata = buildMetadata(seo, {
  path: "/contact",
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
});

export default function ContactPage() {
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <SectionShell>
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Contact
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {siteConfig.cta.headline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              {siteConfig.cta.description}
            </p>
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-secondary p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Office
              </p>
              <p className="mt-3 font-display text-lg text-foreground">
                {siteConfig.map.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{siteConfig.map.address}</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border">
              <iframe
                allowFullScreen
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={siteConfig.map.embedUrl}
                title={siteConfig.map.label}
              />
            </div>
          </div>
        </Container>
      </SectionShell>
    </>
  );
}
