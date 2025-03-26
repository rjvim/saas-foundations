import { docs, blogPosts } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import type { InferMetaType, InferPageType } from "fumadocs-core/source";

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(blogPosts),
});

export const { getPage: getBlogPost, getPages: getBlogPosts } = blogSource;

export type Post = ReturnType<typeof getBlogPost>;

const posts = getBlogPosts();

export const getSortedByDatePosts = () =>
  posts.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const getTags = () => {
  const tagSet = new Set<string>();

  for (const post of posts) {
    if (post.data.tags) {
      for (const tag of post.data.tags) {
        tagSet.add(tag);
      }
    }
  }

  return Array.from(tagSet).toSorted();
};

// export const getPostsByTag = (tag: string) => {
//   return posts
//     .filter((post) => post.data.tags?.includes(tag))
//     .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
// };
