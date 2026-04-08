import Link from "next/link";
import { Container } from "@site-factory/ui";
import { siteConfig } from "@site-config";
import { buttonClassName } from "@site-factory/ui";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Container className="py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-muted-foreground">
          The page you are looking for does not exist or has been moved. Head
          back to the {siteConfig.name} homepage.
        </p>
        <div className="mt-10">
          <Link className={buttonClassName({ size: "large" })} href="/">
            Back to homepage
          </Link>
        </div>
      </Container>
    </div>
  );
}
