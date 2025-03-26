import { notFound } from "next/navigation";
import Link from "next/link";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import {
  Toc,
  TOCItems,
  TOCScrollArea,
} from "fumadocs-ui/components/layout/toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blog } from "@foundations/cms/source";
import ClerkTOCItems from "fumadocs-ui/components/layout/toc-clerk";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <div className="relative flex flex-col items-center justify-center w-full mx-auto max-w-7xl px-4 md:px-0 py-16">
      {/* <div className="rounded-xl border py-12">
        <h1 className="mb-2 text-3xl font-bold">{page.data.title}</h1>
        <p className="mb-4 text-fd-muted-foreground">{page.data.description}</p>
        <Link href="/blog">Back</Link>
      </div> */}

      <div className="grid grid-cols-8 gap-8">
        <article className="col-span-8 md:col-span-6 flex flex-col">
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

        <div className="col-span-2 md:col-span-0 flex flex-1 flex-row pe-(--fd-layout-offset) [--fd-tocnav-height:36px] md:[--fd-sidebar-width:268px] lg:[--fd-sidebar-width:286px] xl:[--fd-toc-width:286px] xl:[--fd-tocnav-height:0px] [--fd-nav-height:calc(var(--spacing)*14)] md:[--fd-nav-height:0px]">
          <Toc>
            <ClerkTOCItems items={page.data.toc} />
          </Toc>

          {/* <Toc> */}
          {/* <TOCScrollArea> */}
          {/* <div className="sticky top-[calc(var(--fd-banner-height)+var(--fd-nav-height))] h-(--fd-toc-height) pb-2 pt-12 max-xl:hidden">
            <TOCItems items={page.data.toc} />
          </div> */}
          {/* </TOCScrollArea> */}
          {/* </Toc> */}
        </div>
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
