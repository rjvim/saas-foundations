import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "../../packages/content/docs",
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
