import { Container, SectionHeading, SectionShell, SurfaceCard } from "@site-factory/ui";
import { siteConfig } from "@site-config";

export function ValuePropsSection() {
  return (
    <SectionShell surface="muted">
      <Container>
        <SectionHeading
          description="The foundation is built around contracts instead of page-by-page improvisation, so rollout speed improves without losing structure."
          eyebrow="Architecture"
          title="What changes when the website is treated like a system"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {siteConfig.valueProps.map((valueProp) => (
            <SurfaceCard className="h-full" key={valueProp.title}>
              <h3 className="font-display text-2xl tracking-tight text-foreground">
                {valueProp.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-foreground/72">
                {valueProp.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
