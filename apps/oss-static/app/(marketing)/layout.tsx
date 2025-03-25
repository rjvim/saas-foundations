import type { ReactNode } from "react";
import StripeHeader from "@workspace/ui/headers/stripe";
import { SimpleNavigationMenu } from "@workspace/ui/simple-navigation-menu";
import { VerticalNavigationMenu } from "@workspace/ui/vertical-navigation-menu";

export default function Layout({ children }: { children: ReactNode }) {
  const navigationItems = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
  ];

  const navigationMenu = <SimpleNavigationMenu items={navigationItems} />;

  const verticalNavigationMenu = (
    <VerticalNavigationMenu items={navigationItems} loginHref="#" />
  );

  return (
    <div className="flex flex-col min-h-screen">
      <StripeHeader
        navigationMenu={navigationMenu}
        verticalNavigationMenu={verticalNavigationMenu}
      />
      {children}
    </div>
  );
}
