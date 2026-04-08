import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const socialSchema = linkSchema.extend({
  handle: z.string().optional(),
});

const valuePropSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
});

const ctaBaseSchema = z.object({
  label: z.string().min(1),
  headline: z.string().min(1),
  description: z.string().min(1),
});

const ctaSchema = z.discriminatedUnion("type", [
  ctaBaseSchema.extend({
    type: z.literal("form"),
    submitLabel: z.string().min(1),
    successMessage: z.string().min(1),
  }),
  ctaBaseSchema.extend({
    type: z.literal("email"),
    email: z.email(),
  }),
  ctaBaseSchema.extend({
    type: z.literal("whatsapp"),
    phoneNumber: z.string().min(6),
    prefilledMessage: z.string().min(1),
  }),
]);

const siteConfigSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  locale: z.string().min(1),
  logo: z.string().min(1),
  type: z.enum(["b2b-product", "b2b-service", "b2c-dtc"]),
  defaultMeta: z.object({
    description: z.string().min(1),
    keywords: z.array(z.string().min(1)).min(1),
    ogImage: z.string().min(1),
    titleTemplate: z.string().min(1),
  }),
  cta: ctaSchema,
  content: z.object({
    autoPublish: z.boolean(),
    blogEnabled: z.boolean(),
    featuredPostSlugs: z.array(z.string().min(1)),
    featuredProductSlugs: z.array(z.string().min(1)),
    productsEnabled: z.boolean(),
    sanityDataset: z.string().min(1),
  }),
  company: z.object({
    founded: z.string().min(1),
    headquarters: z.string().min(1),
    story: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    description: z.string().min(1),
    primaryAction: linkSchema,
    secondaryAction: linkSchema,
    title: z.string().min(1),
  }),
  map: z.object({
    address: z.string().min(1),
    embedUrl: z.string().min(1),
    label: z.string().min(1),
  }),
  metrics: z.array(metricSchema).min(3),
  nav: z.array(linkSchema).min(1),
  social: z.array(socialSchema).min(1),
  team: z.array(teamMemberSchema).min(2),
  valueProps: z.array(valuePropSchema).min(3),
});

const rawConfig = {
  name: "Solar Panel Pro",
  domain: "solarpanelpro.com",
  locale: "en_US",
  logo: "/favicon.ico",
  type: "b2b-product",
  defaultMeta: {
    titleTemplate: "%s | Solar Panel Pro",
    description:
      "Config-driven B2B energy websites that launch quickly, rank cleanly, and keep content operations inside one reusable system.",
    keywords: [
      "commercial solar website",
      "sanity nextjs starter",
      "b2b product marketing site",
    ],
    ogImage:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
  },
  cta: {
    type: "form",
    label: "Request Quote",
    headline: "Launch a new market-facing site without rebuilding your stack.",
    description:
      "Tell us what product line or geography you need to support next. We will map content, pages, and launch steps into one config-driven rollout.",
    submitLabel: "Send request",
    successMessage: "Thanks. We will follow up with a rollout plan within one business day.",
  },
  content: {
    sanityDataset: "production",
    blogEnabled: true,
    productsEnabled: true,
    autoPublish: false,
    featuredPostSlugs: [
      "size-solar-for-new-facility",
      "battery-storage-for-manufacturing-uptime",
    ],
    featuredProductSlugs: ["aurora-array-420", "gridguard-battery-hub"],
  },
  company: {
    founded: "2021",
    headquarters: "Austin, Texas",
    story:
      "Solar Panel Pro helps industrial teams move from slow brochure-ware to a launch system that pairs config-driven branding with Sanity-backed content and SEO workflows.",
  },
  hero: {
    eyebrow: "Next.js + Sanity foundation",
    title: "One codebase for every site your go-to-market engine needs.",
    description:
      "Brand, navigation, metadata, CTA behavior, and content sources all live in one validated config, so a new site becomes a rollout task instead of a rebuild project.",
    primaryAction: {
      label: "See the product catalog",
      href: "/products",
    },
    secondaryAction: {
      label: "Read launch playbooks",
      href: "/blog",
    },
  },
  map: {
    label: "Austin operations office",
    address: "Domain District, Austin, TX",
    embedUrl:
      "https://www.google.com/maps?q=Austin%20TX&z=11&output=embed",
  },
  metrics: [
    { label: "First launch timeline", value: "2-3 days" },
    { label: "Next site spin-up", value: "30-120 minutes" },
    { label: "Reusable SEO system", value: "Metadata + JSON-LD + ISR" },
  ],
  nav: [
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com", handle: "solar-panel-pro" },
    { label: "X", href: "https://x.com", handle: "@solarpanelpro" },
  ],
  team: [
    {
      name: "Mira Chen",
      role: "Growth Systems Lead",
      bio: "Designs config and content operations so each new market launch inherits the same publishing and SEO backbone.",
    },
    {
      name: "Jonah Patel",
      role: "Energy Product Strategist",
      bio: "Translates technical product detail into positioning that procurement and operations teams can act on quickly.",
    },
  ],
  valueProps: [
    {
      title: "Validated config at build time",
      description:
        "Brand, SEO defaults, CTA mode, and content toggles all parse through Zod before the app boots.",
    },
    {
      title: "CMS-backed when available, seeded when not",
      description:
        "The query layer falls back to typed demo content, so local setup still boots cleanly without blocking on Sanity credentials.",
    },
    {
      title: "SEO primitives wired into every route",
      description:
        "Metadata, canonical URLs, JSON-LD, sitemap generation, and internal linking are first-class pieces of the foundation.",
    },
  ],
} satisfies z.input<typeof siteConfigSchema>;

export const siteConfig = siteConfigSchema.parse(rawConfig);

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type SiteCTA = SiteConfig["cta"];
