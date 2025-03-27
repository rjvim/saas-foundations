import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://saas-foundations-oss-static.vercel.app",
      siteName: "OSS",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@rjv_im",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
    },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/api/rss.xml",
      },
      ...override.alternates,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3001")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
