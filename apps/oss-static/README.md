This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

oss-static is a static site for OSS projects, it has

1. Landing Pages
2. Docs
3. Blogs
4. Individual Pages

The codebase is structures as monorepo and depends on following packages:

1. `@foundations/cms` - It has the CMS functionality, and you are not expected to touch this
2. `@foundations/shadcn` - It has the UI components, and you are not expected to touch this either

The idea behind @foundation packages is that these can be upgraded and won't make template dependent only on what you got the first time you cloned oss-static package.

The pieces which you can touch are:

1. `@workspace/config` - This mostly has baseUrl etc.,
2. `@workspace/ui` - This has the UI components, which override or use shadcn components
3. `@workspace/ui` - components can be used inside @foundations/cms, so don't use cms inside ui package
