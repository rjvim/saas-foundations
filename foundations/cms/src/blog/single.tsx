import { notFound } from "next/navigation";
import Link from "next/link";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Toc, TOCItems } from "fumadocs-ui/components/layout/toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blog } from "@foundations/cms/source";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <div className="relative flex flex-col items-center justify-center w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-0 pt-0 bg-red-200">
      <div className="rounded-xl border py-12">
        <h1 className="mb-2 text-3xl font-bold">{page.data.title}</h1>
        <p className="mb-4 text-fd-muted-foreground">{page.data.description}</p>
        <Link href="/blog">Back</Link>
      </div>

      <div className="flex flex-row gap-4">
        <TOCItems items={page.data.toc} />

        <article className="flex flex-col py-8 bg-blue-50">
          <div className="prose min-w-0">
            <Mdx components={defaultMdxComponents} />
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="mb-1 text-fd-muted-foreground">Written by</p>
              <p className="font-medium">{page.data.author}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
              <p className="font-medium">
                {new Date(page.data.date).toDateString()}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0] || "",
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
