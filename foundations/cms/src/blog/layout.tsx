import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { blogSource } from "@foundations/cms/source";
import { GridBackground } from "@workspace/ui/grid-background";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{ enabled: false }}
      tree={blogSource.pageTree}
      sidebar={{ enabled: false, prefetch: false, tabs: false }}
      containerProps={{
        className: "relative max-w-7xl mx-auto md:[--fd-nav-height:59px]",
      }}
    >
      <GridBackground maxWidthClass="max-w-7xl" />
      {children}
    </DocsLayout>
  );
}
