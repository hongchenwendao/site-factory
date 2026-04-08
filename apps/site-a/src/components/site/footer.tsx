import Link from "next/link";
import { Container } from "@site-factory/ui";
import { siteConfig } from "@site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent py-14 text-accent-foreground">
      <Container className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">{siteConfig.name}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-accent-foreground/72">{siteConfig.company.story}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-accent-foreground/45">
            Founded {siteConfig.company.founded} · {siteConfig.company.headquarters}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-foreground/60">
            Navigation
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-accent-foreground/78">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-accent-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-foreground/60">
            Social
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-accent-foreground/78">
            {siteConfig.social.map((item) => (
              <li key={item.label}>
                <a className="transition-colors hover:text-accent-foreground" href={item.href} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
