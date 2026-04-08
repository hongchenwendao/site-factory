import Link from "next/link";
import { buttonClassName, cn } from "@site-factory/ui";

interface CtaLinkProps {
  href: string;
  label: string;
  className?: string;
  variant?: "solid" | "secondary" | "ghost";
  size?: "default" | "large";
}

export function CtaLink({
  href,
  label,
  className,
  variant = "solid",
  size = "default",
}: CtaLinkProps) {
  const classes = cn(buttonClassName({ size, variant }), className);

  if (href.startsWith("/")) {
    return (
      <Link className={classes} href={href}>
        {label}
      </Link>
    );
  }

  return (
    <a className={classes} href={href} rel="noreferrer" target="_blank">
      {label}
    </a>
  );
}
