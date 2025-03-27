import { ImageResponse } from "next/og";
import { OhImgBaseTemplate, ohimgConfig } from "@workspace/ui/ohimg/template";
import type { ImageResponseOptions } from "next/server";

export const contentType = "image/png";
export const dynamic = "force-static";
export const revalidate = false; // Revalidate every hour (or your preferred interval)

const imageOptions: ImageResponseOptions = {
  width: 1200,
  height: 630,
};

// Image generation
export function generateOGImage(title: string) {
  const config = ohimgConfig;
  config.content.title = title;
  return new ImageResponse(OhImgBaseTemplate(config), imageOptions);
}
