export type PatternType = "none" | "grid" | "dots";

export type GradientDirection =
  | "none"
  | "to right"
  | "to left"
  | "to bottom"
  | "to top"
  | "to bottom right"
  | "to bottom left"
  | "to top right"
  | "to top left";

export type MaskDirection =
  | "none"
  | "circle at center"
  | "circle at center top"
  | "circle at top right"
  | "circle at center right"
  | "circle at bottom right"
  | "circle at center bottom"
  | "circle at bottom left"
  | "circle at center left"
  | "circle at top left";

export type PositionOption = "start" | "center" | "end";

export type AlignmentOption = "left" | "center" | "right";

export interface BackgroundImageLayer {
  imageSrc?: string;
}

export interface MaskLayer {
  enabled?: boolean;
  direction?: MaskDirection;
  visibleRadius?: number;
  fadeWidth?: number;
}

export interface PatternLayer {
  type?: PatternType;
  color?: string;
  opacity?: number;
  size?: number;
  backgroundSize?: number;
  lineThickness?: number;
  mask?: MaskLayer;
}

export interface GradientLayer {
  startColor?: string;
  endColor?: string;
  opacity?: number;
  direction?: GradientDirection;
  mask?: MaskLayer;
}

export interface PositionedElement {
  customClasses?: string;
  textColor?: string;
  bgColor?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  height?: string;
  hPosition?: PositionOption;
  vPosition?: PositionOption;
  alignment?: AlignmentOption;
  autoMargin?: boolean;
}

export interface ContentLayout {
  layoutContainer?: string;
  logoContainer?: string;
  logo?: string;
  tagContainer?: string;
  contentContainer?: string;
  tag?: string;
  title?: string;
  description?: string;
  website?: string;
}

// Main template interface
export interface OhImgBaseTemplateProps {
  // Required content
  content: {
    title: string;
    description?: string;
    tags?: string[];
    website?: string;
    logoSrc?: string;
  };

  // Optional layers
  background?: BackgroundImageLayer;
  pattern?: PatternLayer;
  gradient?: GradientLayer;

  // Layout configuration
  layout?: ContentLayout;
}
