import { createMetadataImage } from "fumadocs-core/server";
import { docsSource, blogSource } from "@foundations/cms/source";
import type { Metadata } from "next";

// Define the interface for the return type of createMetadataImage
interface MetadataImageResult {
  getImageMeta: (slugs: string[]) => { alt: string; url: string };
  withImage: (slugs: string[], metadata?: Metadata) => Metadata;
  generateParams: () => { slug: string[] }[];
  createAPI: (handler: any) => any;
}

export const docsMetaImage = createMetadataImage({
  imageRoute: "/docs-og",
  source: docsSource,
}) as MetadataImageResult;

export const blogsMetaImage = createMetadataImage({
  imageRoute: "/blogs-og",
  source: blogSource,
}) as MetadataImageResult;
