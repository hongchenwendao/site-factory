"use client";

import { Container } from "@site-factory/ui";
import { buttonClassName } from "@site-factory/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Container className="py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Error
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button
            className={buttonClassName({ size: "large" })}
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </div>
      </Container>
    </div>
  );
}
