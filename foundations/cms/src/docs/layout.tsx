import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { source } from "@saas-foundations/cms/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{ prefetch: false, tabs: false }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
