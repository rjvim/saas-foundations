import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "../../workspace/content/docs",
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
