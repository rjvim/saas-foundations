import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import { source } from "@foundations/cms/source";
import { RootProvider } from "fumadocs-ui/provider";

export default function Layout({
  isStatic = false,
  children,
}: {
  isStatic?: boolean;
  children: ReactNode;
}) {
  return (
    <RootProvider
      {...(isStatic
        ? {
            search: {
              options: {
                type: "static",
              },
            },
          }
        : {})}
    >
      <DocsLayout
        tree={source.pageTree}
        sidebar={{ prefetch: false, tabs: false }}
        {...baseOptions}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
