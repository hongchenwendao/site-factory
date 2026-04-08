import { type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  surface?: "default" | "muted" | "accent";
}

export function SectionShell({
  children,
  className,
  surface = "default",
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        surface === "default" && "bg-background",
        surface === "muted" && "bg-muted",
        surface === "accent" && "bg-accent text-accent-foreground",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
}

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card/90 p-6 shadow-[0_24px_80px_-42px_rgba(18,34,24,0.42)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

interface ButtonClassNameOptions {
  variant?: "solid" | "secondary" | "ghost";
  size?: "default" | "large";
  fullWidth?: boolean;
}

export function buttonClassName({
  variant = "solid",
  size = "default",
  fullWidth = false,
}: ButtonClassNameOptions = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    size === "default" && "min-h-11 px-5 text-sm",
    size === "large" && "min-h-12 px-6 text-base",
    fullWidth && "w-full",
    variant === "solid" &&
      "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" &&
      "border border-border bg-card text-foreground hover:border-primary/30 hover:text-accent",
    variant === "ghost" && "text-muted-foreground hover:text-accent",
  );
}
