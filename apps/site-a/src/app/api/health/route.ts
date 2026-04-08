import { apiSuccess } from "@/lib/api-response";
import { isSanityEnabled } from "@site-factory/sanity";
import { siteConfig } from "@site-config";

export async function GET() {
  return apiSuccess({
    ok: true as const,
    site: siteConfig.name,
    cms: isSanityEnabled() ? "connected" : "demo",
    timestamp: new Date().toISOString(),
  }, 200);
}
