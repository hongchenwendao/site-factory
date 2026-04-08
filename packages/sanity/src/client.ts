import imageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { getSanityRuntimeConfig } from "./env";

export function getSanityClient(options?: { useToken?: boolean }) {
  const config = getSanityRuntimeConfig();
  if (!config) {
    return null;
  }

  return createClient({
    apiVersion: config.apiVersion,
    dataset: config.dataset,
    projectId: config.projectId,
    ...(options?.useToken && config.readToken ? { token: config.readToken } : {}),
    useCdn: !options?.useToken,
    perspective: "published" as const,
    stega: {
      enabled: false,
      studioUrl: "/studio",
    },
  });
}

function getImageBuilder(): ImageUrlBuilder | null {
  const config = getSanityRuntimeConfig();
  if (!config) {
    return null;
  }

  return imageUrlBuilder({
    dataset: config.dataset,
    projectId: config.projectId,
  });
}

export function resolveImageUrl(source: SanityImageSource | { asset?: { url?: string } } | null | undefined) {
  if (!source) {
    return undefined;
  }

  const assetUrl =
    typeof source === "object" && "asset" in source && source.asset?.url
      ? source.asset.url
      : undefined;

  if (assetUrl) {
    return assetUrl;
  }

  const builder = getImageBuilder();
  return builder ? builder.image(source as SanityImageSource).auto("format").fit("max").url() : undefined;
}
