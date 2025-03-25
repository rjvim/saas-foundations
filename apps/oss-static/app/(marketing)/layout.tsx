import type { ReactNode } from "react";
import StripeHeader from "@workspace/ui/headers/stripe";
import { SimpleNavigationMenu } from "@workspace/ui/navigation-menus/simple-horizontal";
import { VerticalNavigationMenu } from "@workspace/ui/navigation-menus/simple-vertical";
import BigFooter from "@workspace/ui/footers/big";
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

  // Footer navigation configuration
  const footerNavigation = {
    solutions: [
      { name: "Marketing", href: "/marketing" },
      { name: "Analytics", href: "/analytics" },
      { name: "Automation", href: "/automation" },
      { name: "Commerce", href: "/commerce" },
    ],
    support: [
      { name: "Documentation", href: "/docs" },
      { name: "Guides", href: "/guides" },
      { name: "API Status", href: "/api-status" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
    social: [
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
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StripeHeader
        navigationMenu={navigationMenu}
        verticalNavigationMenu={verticalNavigationMenu}
      />
      {children}
      <BigFooter 
        solutions={footerNavigation.solutions}
        support={footerNavigation.support}
        company={footerNavigation.company}
        legal={footerNavigation.legal}
        social={footerNavigation.social}
        companyName="SaaS Foundations"
        companyDescription="Building the foundation for your next SaaS product."
      />
    </div>
  );
}
