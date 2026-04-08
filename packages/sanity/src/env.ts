import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),
});

export interface SanityRuntimeConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  readToken?: string;
  revalidateSecret?: string;
}

const apiVersion = "2025-03-04";

export function getSanityRuntimeConfig(): SanityRuntimeConfig | null {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    return null;
  }

  const config: SanityRuntimeConfig = {
    projectId: result.data.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: result.data.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion,
  };

  if (result.data.SANITY_API_READ_TOKEN) {
    config.readToken = result.data.SANITY_API_READ_TOKEN;
  }

  if (result.data.SANITY_REVALIDATE_SECRET) {
    config.revalidateSecret = result.data.SANITY_REVALIDATE_SECRET;
  }

  return config;
}

export function isSanityEnabled() {
  return getSanityRuntimeConfig() !== null;
}
