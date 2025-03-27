import { generateOGImage } from "fumadocs-ui/og";
import { docsMetaImage } from "@foundations/cms/metadata-image";
import type { ImageResponse } from "next/og";

export const GET = docsMetaImage.createAPI((page): ImageResponse => {
  console.log("Docs Page URL:", page.url);
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "OSS",
  });
});

export function generateStaticParams() {
  return docsMetaImage.generateParams();
}
