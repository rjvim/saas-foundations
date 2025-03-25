import type { ReactNode } from "react";
import SimpleHeader from "@workspace/ui/headers/simple";
import { SimpleNavigationMenu } from "@workspace/ui/navigation-menus/simple-horizontal";
import { VerticalNavigationMenu } from "@workspace/ui/navigation-menus/simple-vertical";
import SimpleFooter, {
  type FooterNavigationItem,
} from "@workspace/ui/footers/simple";
import { Icons } from "@workspace/ui/icons";

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

  // Social media icons for SimpleFooter
  const footerNavigation: FooterNavigationItem[] = [
    {
      name: "Twitter",
      href: "https://twitter.com/company",
      icon: Icons.x,
    },
    {
      name: "GitHub",
      href: "https://github.com/company",
      icon: Icons.github,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/company",
      icon: Icons.youtube,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader
        navigationMenu={navigationMenu}
        verticalNavigationMenu={verticalNavigationMenu}
      />
      {children}
      <SimpleFooter navigation={footerNavigation} />
    </div>
  );
}
