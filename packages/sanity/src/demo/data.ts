import type { PortableTextBlock } from "@portabletext/types";
import type { PostDetail, ProductCategorySummary, ProductDetail, SiteSettings } from "../types";

function block(children: string[]): PortableTextBlock {
  return {
    _key: children.join("-").slice(0, 24),
    _type: "block",
    children: children.map((text, index) => ({
      _key: `${index}-${text.slice(0, 8)}`,
      _type: "span",
      marks: [],
      text,
    })),
    markDefs: [],
    style: "normal",
  };
}

const solarImage = {
  alt: "Rows of rooftop solar panels at an industrial facility",
  asset: {
    url: "/placeholder-solar.svg",
    width: 1400,
    height: 933,
  },
};

const batteryImage = {
  alt: "Commercial battery storage units with dashboard readouts",
  asset: {
    url: "/placeholder-battery.svg",
    width: 1400,
    height: 933,
  },
};

export const demoCategories: ProductCategorySummary[] = [
  {
    id: "cat-solar-panels",
    name: "Solar Panels",
    slug: "solar-panels",
    description: "Commercial and industrial photovoltaic modules for large-scale energy generation.",
  },
  {
    id: "cat-energy-storage",
    name: "Energy Storage",
    slug: "energy-storage",
    description: "Battery systems and monitoring solutions for grid resilience and demand management.",
  },
];

export const demoProducts: ProductDetail[] = [
  {
    id: "product-solar-array",
    name: "Aurora Array 420",
    slug: "aurora-array-420",
    description:
      "A commercial solar panel package tuned for warehouses, logistics parks, and industrial rooftops that need predictable output with minimal maintenance.",
    images: [solarImage],
    category: { name: "Solar Panels", slug: "solar-panels" },
    specifications: [
      { label: "Panel efficiency", value: "22.1%" },
      { label: "Warranty", value: "25 years" },
      { label: "Deployment lead time", value: "6 weeks" },
    ],
    moq: "50 panels",
    leadTime: "15-20 business days",
    certifications: ["IEC 61215", "IEC 61730", "CE"],
    relatedPosts: [{ title: "How to size a solar deployment for a new facility", slug: "size-solar-for-new-facility" }],
    faq: [
      {
        question: "How quickly can Aurora Array 420 go live?",
        answer: "Most deployments reach commissioning in six weeks once roof surveys and procurement are approved.",
      },
      {
        question: "Is it suitable for phased rollouts?",
        answer: "Yes. The array is designed around modular strings so operators can expand in stages without replacing the first installation.",
      },
    ],
    seo: {
      title: "Aurora Array 420 | Commercial Solar Panels",
      description: "Industrial solar package for warehouse and manufacturing rooftops.",
      keywords: ["commercial solar panel", "industrial solar rooftop", "warehouse energy"],
      ogImage: solarImage,
    },
  },
  {
    id: "product-gridguard-battery",
    name: "GridGuard Battery Hub",
    slug: "gridguard-battery-hub",
    description:
      "Battery storage and monitoring stack that turns intermittent generation into a stable energy reserve for mission-critical operations.",
    images: [batteryImage],
    category: { name: "Energy Storage", slug: "energy-storage" },
    specifications: [
      { label: "Storage capacity", value: "1.8 MWh" },
      { label: "Peak discharge", value: "900 kW" },
      { label: "Monitoring", value: "24/7 telemetry + alerting" },
    ],
    moq: "1 unit",
    leadTime: "20-30 business days",
    certifications: ["UL 9540", "IEC 62619", "CE", "UN 38.3"],
    relatedPosts: [{ title: "What battery storage changes for manufacturing uptime", slug: "battery-storage-for-manufacturing-uptime" }],
    faq: [
      {
        question: "Can it pair with existing solar infrastructure?",
        answer: "Yes. GridGuard is built to sit behind both existing solar arrays and utility feeds, so retrofits are straightforward.",
      },
      {
        question: "Does it include remote monitoring?",
        answer: "Yes. Operators get live telemetry, threshold alerts, and monthly utilization summaries.",
      },
    ],
    seo: {
      title: "GridGuard Battery Hub | Commercial Storage",
      description: "Battery storage platform for operators that need resilience and demand smoothing.",
      keywords: ["battery energy storage", "commercial BESS", "industrial power resilience"],
      ogImage: batteryImage,
    },
  },
];

export const demoPosts: PostDetail[] = [
  {
    id: "post-size-solar",
    title: "How to size a solar deployment for a new facility",
    slug: "size-solar-for-new-facility",
    excerpt:
      "Answer-first framework for estimating panel count, roof area, and payback before you engage EPC vendors.",
    publishedAt: "2026-04-02T08:00:00.000Z",
    featuredImage: solarImage,
    categories: ["Planning", "Procurement"],
    relatedProducts: [{ name: "Aurora Array 420", slug: "aurora-array-420" }],
    body: [
      block(["The fastest way to size a new deployment is to anchor everything on your peak daytime load and the roof area you can actually use."]),
      block(["Start with the energy profile, then subtract shade loss, access corridors, and future maintenance lanes before you calculate panel count."]),
      block(["Once those numbers are stable, compare the capacity target against your procurement window and incentive deadlines."]),
    ],
    faq: [
      {
        question: "What is the first number I should calculate?",
        answer: "Start with peak daytime demand because it tells you how much on-site generation can offset your highest-cost usage.",
      },
      {
        question: "Should I fill every available roof surface?",
        answer: "No. Leave space for access, maintenance, and sections with poor solar exposure so output stays reliable.",
      },
    ],
    seo: {
      title: "How to size a solar deployment for a new facility",
      description: "Use an answer-first workflow to estimate solar capacity, roof fit, and payback with less guesswork.",
      keywords: ["solar sizing", "facility planning", "commercial solar guide"],
      ogImage: solarImage,
    },
  },
  {
    id: "post-battery-storage",
    title: "What battery storage changes for manufacturing uptime",
    slug: "battery-storage-for-manufacturing-uptime",
    excerpt:
      "Battery storage is not just backup power. It smooths load swings, protects critical lines, and gives operators more control over energy costs.",
    publishedAt: "2026-04-01T08:00:00.000Z",
    featuredImage: batteryImage,
    categories: ["Operations", "Energy Storage"],
    relatedProducts: [{ name: "GridGuard Battery Hub", slug: "gridguard-battery-hub" }],
    body: [
      block(["Battery storage improves uptime because it reduces the blast radius of grid instability and lets plant operators prioritize the lines that matter most."]),
      block(["That translates into fewer abrupt shutdowns, more predictable startup cycles, and less equipment stress when demand spikes."]),
      block(["It also gives finance teams a cleaner demand-management story because the same system that protects uptime can clip costly peaks."]),
    ],
    faq: [
      {
        question: "Is battery storage only useful during outages?",
        answer: "No. The system delivers value every day through demand smoothing, load shifting, and power quality support.",
      },
      {
        question: "How do operators measure the business case?",
        answer: "Track avoided downtime, clipped demand peaks, and the share of energy shifted away from the highest tariff windows.",
      },
    ],
    seo: {
      title: "What battery storage changes for manufacturing uptime",
      description: "See how storage improves resilience, trims demand spikes, and supports critical operations.",
      keywords: ["battery storage manufacturing", "plant uptime", "energy resilience"],
      ogImage: batteryImage,
    },
  },
];

export const demoSiteSettings: SiteSettings = {
  companyStory:
    "Site Factory ships B2B sites that turn technical differentiation into a clear commercial narrative, so growth teams can launch faster without rebuilding their stack for every new market.",
  navigation: [
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Studio", href: "/studio" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
  contactHeadline: "Tell us the next market you want to launch into.",
  contactBody:
    "We turn brand, content, and SEO requirements into a reusable operating system instead of another one-off website rebuild.",
};
