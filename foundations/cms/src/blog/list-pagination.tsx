import { getSortedByDatePosts } from "@foundations/cms/source";
import { BlogList } from "./components/blog-list";

export const dynamic = "force-static";

type Props = {
  params: { page: string };
};

export function generateStaticParams() {
  const allPosts = getSortedByDatePosts();
  const totalPages = Math.ceil(allPosts.length / 5);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default function ListWithPagination({ params }: Props) {
  const page = Number(params.page);
  return <BlogList page={page} />;
}
