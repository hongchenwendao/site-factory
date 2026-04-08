import type { SanityImage } from "./types";

export function getRenderableImage(image: SanityImage | null | undefined): SanityImage | null {
  const url = image?.asset?.url?.trim();
  const width = image?.asset?.width;
  const height = image?.asset?.height;

  if (!url) {
    return null;
  }

  if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
    return null;
  }

  if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) {
    return null;
  }

  return {
    alt: image?.alt ?? "",
    asset: {
      url,
      width,
      height,
    },
  };
}
