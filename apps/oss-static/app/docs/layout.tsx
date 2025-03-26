import Layout from "@foundations/cms/docs/layout";
import type { ReactNode } from "react";

export default function StaticLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
