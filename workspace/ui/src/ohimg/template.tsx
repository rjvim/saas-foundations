import {
  type GradientLayer,
  type OhImgBaseTemplateProps,
  type PatternLayer,
} from "./types";
import { getGradientStyle, getPatternStyle } from "./helpers";
import { cn } from "@foundations/shadcn/lib/utils";

export const ohimgConfig: OhImgBaseTemplateProps = {
  content: {
    title: "Every webpage deserves it's own open graph image",
    description:
      "Generate beautiful open graph images for your website with Ohimg. Customize the template to match your brand.",
    website: "ohimg.dev",
    tags: ["open graph", "image", "generator"],
  },
  gradient: {
    startColor: "#e2e8f0",
    endColor: "#f1f5f9",
    direction: "to bottom",
    opacity: 0.95,
  },
  pattern: {
    type: "dots",
    color: "#000000",
    opacity: 0.15,
    size: 15,
    backgroundSize: 30,
    mask: {
      enabled: true,
      direction: "circle at center",
      visibleRadius: 55,
      fadeWidth: 20,
    },
  },
  layout: {
    layoutContainer:
      "relative w-full h-full flex flex-col items-center justify-center",
    contentContainer:
      "relative flex flex-col w-full min-h-screen mx-auto px-[40px] py-[40px]",
    logoContainer: "flex items-center justify-center mx-auto",
    logo: "h-[70px] mt-3",
    tagContainer: "flex justify-between mx-auto mt-6 items-center w-[300px]",
    tag: "px-3 py-2 rounded-full text-white bg-gray-700 text-base font-medium",
    title:
      "flex-1 h-full text-6xl font-semibold text-center w-[830px] mx-auto items-center justify-center leading-tight text-gray-900",
    description:
      "flex h-16 items-center justify-center text-3xl font-semibold text-center text-gray-900",
    website:
      "flex h-16 items-center justify-center text-3xl font-semibold text-gray-700",
  },
};

export function OhImgBaseTemplate({
  content,
  background,
  pattern,
  gradient,
  layout,
}: OhImgBaseTemplateProps) {
  const mergedLayout = layout;
  const mergedGradient = gradient;
  const mergedPattern = pattern;

  return (
    <div
      tw={cn(
        "relative flex w-full h-full",
        "flex flex-col",
        mergedLayout?.layoutContainer
      )}
    >
      {background?.imageSrc && (
        <img
          tw="absolute inset-0"
          alt="Background image"
          src={background.imageSrc}
          width={1200}
          height={630}
        />
      )}

      {/* Background Gradient layer */}
      {mergedGradient && mergedGradient.direction !== "none" && (
        <div
          tw="absolute inset-0"
          style={getGradientStyle(mergedGradient as GradientLayer)}
        />
      )}

      {/* Pattern Overlay layer */}
      {mergedPattern && mergedPattern.type !== "none" && (
        <div
          tw="absolute inset-0"
          style={getPatternStyle(mergedPattern as PatternLayer)}
        />
      )}

      {/* Content container */}
      <div tw={cn("flex", mergedLayout?.contentContainer)}>
        {content?.logoSrc && (
          <div tw={cn("flex", mergedLayout?.logoContainer)}>
            <img
              alt={content.title || "Logo"}
              src={content.logoSrc}
              tw={mergedLayout?.logo}
            />
          </div>
        )}

        {content.tags && content.tags?.length > 0 && (
          <div tw={cn("flex", mergedLayout?.tagContainer)}>
            {content.tags.map((tag, index) => (
              <div key={index} tw={mergedLayout?.tag}>
                {tag}
              </div>
            ))}
          </div>
        )}

        <div
          tw={cn("flex-1", mergedLayout?.title)}
          style={{
            fontFamily: "Inter_18pt-Bold",
          }}
        >
          {content.title}
        </div>

        {content.description && (
          <div
            tw={mergedLayout?.description}
            style={{
              fontFamily: "Inter_18pt-Regular",
            }}
          >
            {content.description}
          </div>
        )}

        {content.website && (
          <div
            tw={mergedLayout?.website}
            style={{
              fontFamily: "Inter_18pt-Regular",
            }}
          >
            {content.website}
          </div>
        )}
      </div>
    </div>
  );
}
