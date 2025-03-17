import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "../../packages/cms/content/docs",
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "../../packages/cms/content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().date().or(z.date()),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
