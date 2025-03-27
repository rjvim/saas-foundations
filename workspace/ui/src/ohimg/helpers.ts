import { cn } from "@foundations/shadcn/lib/utils";
import type {
  BackgroundImageLayer,
  ContentLayout,
  GradientLayer,
  OhImgBaseTemplateProps,
  PatternLayer,
  PositionedElement,
} from "./types";

/**
 * Converts hex color to rgba format with specified opacity
 */
// Helper function to validate hex colors
export const isValidHex = (color: string): boolean => {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexPattern.test(color);
};

export const hexToRgba = (color: string, opacity: number): string => {
  // Default fallback color (black)
  const defaultColor = "#000000";

  // Normalize color format
  let normalizedColor = color?.startsWith("#") ? color : `#${color}`;

  // Validate and use fallback if invalid
  if (!isValidHex(normalizedColor)) {
    console.warn(`Invalid hex color: ${color}, using default black`);
    normalizedColor = defaultColor;
  }

  // Convert to RGB
  const r = parseInt(normalizedColor.slice(1, 3), 16);
  const g = parseInt(normalizedColor.slice(3, 5), 16);
  const b = parseInt(normalizedColor.slice(5, 7), 16);

  // Clamp opacity between 0 and 1
  const safeOpacity = Math.max(0, Math.min(1, opacity ?? 1));

  return `rgba(${r}, ${g}, ${b}, ${safeOpacity})`;
};

export const getMask = ({
  direction = "circle at center",
  visibleRadius = 30,
  fadeWidth = 20,
}) => {
  const outerRadius = visibleRadius + fadeWidth;

  return {
    maskImage: `radial-gradient(${direction}, black ${visibleRadius}%, transparent ${outerRadius}%)`,
    WebkitMaskImage: `radial-gradient(${direction}, black ${visibleRadius}%, transparent ${outerRadius}%)`,
  };
};

export const getDotPattern = ({
  color = "#000000",
  opacity = 0.5,
  size = 25,
  backgroundSize = 20,
}) => {
  const dotColor = hexToRgba(color, opacity);

  return {
    backgroundImage: `radial-gradient(${dotColor} ${size}%, transparent ${
      size + 1
    }%), radial-gradient(${dotColor} ${size - 0.5}%, transparent ${
      size + 0.5
    }%)`,
    backgroundSize: `${backgroundSize}px ${backgroundSize}px, ${backgroundSize}px ${backgroundSize}px`,
    backgroundPosition: `0 0, ${backgroundSize / 2}px ${backgroundSize / 2}px`,
  };
};

export const getGridPattern = ({
  color = "#000000",
  opacity = 0.5,
  size = 20,
  lineThickness = 1,
}: {
  color?: string;
  opacity?: number;
  size?: number;
  lineThickness?: number;
}) => {
  const colorWithOpacity = hexToRgba(color, opacity);

  return {
    backgroundImage: `
      linear-gradient(to right, ${colorWithOpacity} ${lineThickness}px, transparent ${lineThickness}px),
      linear-gradient(to bottom, ${colorWithOpacity} ${lineThickness}px, transparent ${lineThickness}px)
    `,
    backgroundSize: `${size}px ${size}px`,
  };
};

export const getPatternStyle = (props: PatternLayer) => {
  switch (props.type) {
    case "dots":
      return {
        ...getDotPattern({
          color: props.color,
          opacity: props.opacity,
          size: props.size,
          backgroundSize: props.backgroundSize,
        }),
        ...(props.mask &&
          props.mask.enabled === true &&
          getMask({
            direction: props.mask.direction,
            visibleRadius: props.mask.visibleRadius,
            fadeWidth: props.mask.fadeWidth,
          })),
      };
    case "grid":
      return {
        ...getGridPattern({
          color: props.color,
          opacity: props.opacity,
          size: props.size,
          lineThickness: props.lineThickness,
        }),
        ...(props.mask &&
          props.mask.enabled === true &&
          getMask({
            direction: props.mask.direction,
            visibleRadius: props.mask.visibleRadius,
            fadeWidth: props.mask.fadeWidth,
          })),
      };

    default:
      return {};
  }
};

export const getGradientStyle = (props: GradientLayer) => {
  if (!props.direction || props.direction === "none") {
    return {};
  }

  const baseGradient = {
    background: `linear-gradient(${props.direction || "to bottom"}, ${
      props.startColor || "#000000"
    }, ${props.endColor || "#000000"})`,
    opacity: props.opacity ?? 0.7,
  };

  return {
    ...baseGradient,
    ...(props.mask &&
      props.mask.enabled === true &&
      getMask({
        direction: props.mask.direction,
        visibleRadius: props.mask.visibleRadius,
        fadeWidth: props.mask.fadeWidth,
      })),
  };
};

export function calculateMaxWidth(paddingX: string | undefined): number {
  const baseWidth = 1200;

  // If paddingX is undefined or empty, return baseWidth
  if (!paddingX) {
    return baseWidth;
  }

  // Extract numeric value from paddingX (assuming it ends with 'px')
  const paddingValue = parseInt(paddingX.replace("px", ""), 10);

  // If parsing fails or results in NaN, return baseWidth
  if (isNaN(paddingValue)) {
    return baseWidth;
  }

  // Calculate adjusted width: 1200 - 2 * paddingX
  const adjustedWidth = baseWidth - 2 * paddingValue;

  // Ensure maximum of 1200 (though in this case it would be larger anyway)
  const finalWidth = Math.min(adjustedWidth, baseWidth);

  return finalWidth;
}

export function getPositionClasses(
  element: PositionedElement,
  maxWidth: number
) {
  return cn(
    element.customClasses && element.customClasses,
    `max-w-[${maxWidth}px]`
  );
}
