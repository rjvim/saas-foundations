import { ImageResponse } from "next/og";
import { OhImgBaseTemplate, ohimgConfig } from "@workspace/ui/ohimg/template";
import type { ImageResponseOptions } from "next/server";

// Image metadata
export const alt = "OSS";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour (or your preferred interval)

const imageOptions: ImageResponseOptions = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function Image() {
  return new ImageResponse(OhImgBaseTemplate(ohimgConfig), imageOptions);
}
