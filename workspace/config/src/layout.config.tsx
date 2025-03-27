import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Icons } from "@workspace/ui/icons";

export const title = "SaaS Foundations";
export const description = "NextJS Template to build SaaS applications";
export const owner = "Rajiv I'm";

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/rjvim/saas-foundations",
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo"
        >
          <circle cx={12} cy={12} r={12} fill="currentColor" />
        </svg>
        {title}
      </>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Blog",
      url: "/blog",
    },
    {
      text: "About",
      url: "/about",
      active: "nested-url",
    },
    {
      type: "icon",
      icon: <Icons.x />,
      text: "X",
      url: "https://x.com/rjv_im",
      secondary: true,
    },
  ],
};

export const postsPerPage = 5;
