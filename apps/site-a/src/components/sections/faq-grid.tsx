import { Container, SectionHeading, SectionShell, SurfaceCard } from "@site-factory/ui";
import type { FAQItem } from "@site-factory/sanity";

interface FAQGridSectionProps {
  eyebrow?: string;
  title: string;
  items: FAQItem[];
}

export function FAQGridSection({ eyebrow, title, items }: FAQGridSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionShell surface="muted">
      <Container>
        <SectionHeading
          {...(eyebrow ? { eyebrow } : {})}
          title={title}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <SurfaceCard key={item.question}>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.question}</h3>
              <p className="mt-4 text-sm leading-7 text-foreground/72">{item.answer}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}
