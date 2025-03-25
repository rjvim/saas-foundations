import type { ReactNode } from "react";
import StripeHeader from "@workspace/ui/headers/stripe";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <StripeHeader />
      {children}
    </div>
  );
}
