import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX({
  configPath: "../../foundations/cms/source.config.ts",
});

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withMDX(config);
