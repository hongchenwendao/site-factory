import type { SiteSeoConfig } from "@site-factory/seo";
import { siteConfig } from "@site-config";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;

export function getSeoConfig(): SiteSeoConfig {
  const xHandle = siteConfig.social.find((link) => link.label === "X")?.handle;
  const linkedInHref = siteConfig.social.find((link) => link.label === "LinkedIn")?.href;

  const social: { x?: string; linkedIn?: string } = {};
  if (xHandle) social.x = xHandle;
  if (linkedInHref) social.linkedIn = linkedInHref;

  return {
    name: siteConfig.name,
    siteUrl,
    locale: siteConfig.locale,
    titleTemplate: siteConfig.defaultMeta.titleTemplate,
    description: siteConfig.defaultMeta.description,
    defaultOgImage: siteConfig.defaultMeta.ogImage,
    social,
  };
}

export function getCtaHref() {
  switch (siteConfig.cta.type) {
    case "email":
      return `mailto:${siteConfig.cta.email}`;
    case "whatsapp": {
      const phoneNumber = siteConfig.cta.phoneNumber.replace(/[^\d]/g, "");
      const text = encodeURIComponent(siteConfig.cta.prefilledMessage);
      return `https://wa.me/${phoneNumber}?text=${text}`;
    }
    default:
      return "/contact#contact-form";
  }
}

export function getSocialUrls() {
  return siteConfig.social.map((item) => item.href);
}
