import { PortableText as SanityPortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface PortableTextProps {
  value: PortableTextBlock[];
}

const components = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-10 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 text-xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-4 text-base leading-8 text-muted-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-8 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li>{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li>{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
      <a
        className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-primary"
        href={value?.href}
        rel="noreferrer"
        target={value?.href?.startsWith("/") ? undefined : "_blank"}
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
  },
};

export function PortableText({ value }: PortableTextProps) {
  return <SanityPortableText components={components} value={value} />;
}
