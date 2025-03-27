import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import SimpleFooter from "@workspace/ui/footers/simple";
import { Icons } from "@workspace/ui/icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { baseOptions } from "@workspace/config/layout.config";

// const baseOptions: BaseLayoutProps = {
//   githubUrl: "https://github.com/rjvim/saas-foundations",
//   nav: {
//     title: (
//       <>
//         <svg
//           width="24"
//           height="24"
//           xmlns="http://www.w3.org/2000/svg"
//           aria-label="Logo"
//         >
//           <circle cx={12} cy={12} r={12} fill="currentColor" />
//         </svg>
//         SaaS Foundations
//       </>
//     ),
//   },
//   links: [
//     {
//       text: "Documentation",
//       url: "/docs",
//       active: "nested-url",
//     },
//     {
//       text: "Blog",
//       url: "/blog",
//     },
//     {
//       text: "About",
//       url: "/about",
//       active: "nested-url",
//     },
//   ],
// };

export default function Layout({ children }: { children: ReactNode }) {
  const footerNavigation = [
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
    <HomeLayout {...baseOptions}>
      {children}
      <SimpleFooter navigation={footerNavigation} />
      {/* <GridBackground maxWidthClass="max-w-7xl" /> */}
    </HomeLayout>
  );
}
