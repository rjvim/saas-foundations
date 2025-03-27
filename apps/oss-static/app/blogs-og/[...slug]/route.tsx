import { generateOGImage } from "fumadocs-ui/og";
import { blogsMetaImage } from "@foundations/cms/metadata-image";
import type { ImageResponse } from "next/og";

export const GET = blogsMetaImage.createAPI((page): ImageResponse => {
  console.log("Generate Image Blog Page URL:", page.url);
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "OSS",
  });
});

export function generateStaticParams() {
  return blogsMetaImage.generateParams();
}
