import type { Metadata } from "next";

import { siteConfig } from "@site-config";
import { buildMetadata, buildBreadcrumbSchema, JsonLd } from "@site-factory/seo";
import { Container, SectionShell } from "@site-factory/ui";
import { getSeoConfig, siteUrl } from "@/lib/site";

const seo = getSeoConfig();

export const metadata: Metadata = buildMetadata(seo, {
  path: "/about",
  title: "About",
  description: siteConfig.company.story,
});

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <SectionShell>
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              About us
            </p>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {siteConfig.company.story}
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Founded
                </dt>
                <dd className="mt-1 text-base font-medium text-foreground">
                  {siteConfig.company.founded}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Headquarters
                </dt>
                <dd className="mt-1 text-base font-medium text-foreground">
                  {siteConfig.company.headquarters}
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl border border-border bg-secondary p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Team
            </p>
            <div className="mt-6 space-y-6">
              {siteConfig.team.map((member) => (
                <div key={member.name}>
                  <p className="font-display text-lg text-foreground">{member.name}</p>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </SectionShell>
    </>
  );
}
