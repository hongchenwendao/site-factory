import { revalidatePath } from "next/cache";
import { z } from "zod";

import { apiSuccess, apiError } from "@/lib/api-response";
import { revalidateSchema } from "@/lib/validation";
import { getSanityRuntimeConfig } from "@site-factory/sanity";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = revalidateSchema.parse(body);

    const config = getSanityRuntimeConfig();
    if (!config?.revalidateSecret) {
      return apiError("Revalidation not configured", "NOT_CONFIGURED", 500);
    }

    if (validated.secret !== config.revalidateSecret) {
      return apiError("Invalid secret", "UNAUTHORIZED", 401);
    }

    const paths: string[] = [];

    switch (validated.type) {
      case "post": {
        paths.push("/blog");
        if (validated.slug) {
          paths.push(`/blog/${validated.slug}`);
        }
        break;
      }
      case "product": {
        paths.push("/products");
        if (validated.slug) {
          paths.push(`/products/${validated.slug}`);
        }
        break;
      }
      case "siteSettings": {
        paths.push("/");
        paths.push("/about");
        paths.push("/contact");
        break;
      }
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    console.log("[revalidate] Paths revalidated:", paths);

    return apiSuccess({ revalidated: true as const, now: Date.now(), paths }, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Invalid payload", "VALIDATION_ERROR", 400, error.issues);
    }

    console.error("[revalidate] Unexpected error:", error);
    return apiError("Revalidation failed", "INTERNAL_ERROR", 500);
  }
}
