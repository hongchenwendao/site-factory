import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        href="#main-content"
      >
        Skip to content
      </a>
      <Header />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
