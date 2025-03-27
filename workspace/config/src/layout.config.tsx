import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

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
};

export const postsPerPage = 5;
