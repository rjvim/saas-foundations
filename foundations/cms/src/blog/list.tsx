import Link from "next/link";
import { blog } from "@foundations/cms/source";

export default function Home() {
  const posts = blog.getPages();

  // https://21st.dev/shadcnblockscom/blog8/default

  return (
    <main className="grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Latest Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="block bg-fd-secondary rounded-lg shadow-md overflow-hidden p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{post.data.title}</h2>
            <p className="mb-4">{post.data.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
