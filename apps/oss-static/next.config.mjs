import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX({
  configPath: "../../foundations/cms/source.config.ts",
});

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  basePath: "",
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
  ],
};

export default withMDX(config);
