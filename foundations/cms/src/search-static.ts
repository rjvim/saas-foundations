import { docsSource, blogSource } from "@foundations/cms/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: [
    ...docsSource.getPages().map((page) => {
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        tag: "docs",
      };
    }),
    ...blogSource.getPages().map((page) => {
      console.log("Blog Page URL:", page.url);
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        tag: "blog",
      };
    }),
  ],
});
