import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "../../content/docs",
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
