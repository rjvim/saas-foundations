import { getSortedByDatePosts } from "@foundations/cms/source";
import { PostList } from "./post-list";

export function BlogList({ page = 1 }: { page?: number }) {
  const pageSize = 5;
  const allPosts = getSortedByDatePosts();
  const posts = allPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(allPosts.length / pageSize);

  return (
    <PostList
      posts={posts}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
