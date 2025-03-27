import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@workspace/config/layout.config";
import { docsSource } from "@foundations/cms/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docsSource.pageTree}
      sidebar={{ prefetch: false, tabs: false }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
