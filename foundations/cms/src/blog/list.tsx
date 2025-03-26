import Link from "next/link";
import { blog } from "@foundations/cms/source";
import { Card } from "@foundations/shadcn/components/card";
import { ArrowRight } from "lucide-react";
import { GridBackground } from "@workspace/ui/grid-background";

export default function Home() {
  const posts = blog.getPages();
  const heading = "Blog Posts";
  const description =
    "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.";

  return (
    <section className="relative flex w-full flex-col items-center overflow-x-hidden">
      <GridBackground maxWidthClass="max-w-7xl" />
      <div className="relative flex flex-col items-center justify-center w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-24 space-y-16">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.map((post) => (
            <Card
              key={post.url}
              className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
            >
              <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                <div className="sm:col-span-5">
                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-5 lg:gap-6">
                      {post.data.tags?.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                    <Link href={post.url} className="hover:underline">
                      {post.data.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-muted-foreground md:mt-5">
                    {post.data.description}
                  </p>
                  <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                    <span className="text-muted-foreground capitalize">
                      {post.data.author || "Anonymous"}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {new Date(post.data.date).toDateString()}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center space-x-2 md:mt-8">
                    <Link
                      href={post.url}
                      className="inline-flex items-center font-semibold hover:underline md:text-base"
                    >
                      <span>Read more</span>
                      <ArrowRight className="ml-2 size-4 transition-transform" />
                    </Link>
                  </div>
                </div>
                <div className="order-first sm:order-last sm:col-span-5">
                  <Link href={post.url} className="block">
                    <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                      <img
                        src={
                          post.data.image ||
                          "https://shadcnblocks.com/images/block/placeholder-2.svg"
                        }
                        alt={post.data.title}
                        className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// import { ArrowRight } from "lucide-react";

// import { Card } from "@/components/ui/card";

// interface Post {
//   id: string;
//   title: string;
//   summary: string;
//   label: string;
//   author: string;
//   published: string;
//   url: string;
//   image: string;
//   tags?: string[];
// }

// interface Blog8Props {
//   heading?: string;
//   description?: string;
//   posts?: Post[];
// }

// const Blog8 = ({
//   heading = "Blog Posts",
//   description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
//   posts = [
//     {
//       id: "post-1",
//       title:
//         "Building Modern UIs: A Deep Dive into Shadcn and React Components",
//       summary:
//         "Join us for an in-depth exploration of building modern user interfaces using shadcn/ui and React. Learn best practices and advanced techniques.",
//       label: "Web Design",
//       author: "Sarah Chen",
//       published: "15 Feb 2024",
//       url: "https://shadcnblocks.com",
//       image: "/images/block/placeholder-dark-1.svg",
//       tags: ["Web Design", "UI Development"],
//     },
//     {
//       id: "post-2",
//       title: "Mastering Tailwind CSS: From Basics to Advanced Techniques",
//       summary:
//         "Discover how to leverage the full power of Tailwind CSS to create beautiful, responsive websites with clean and maintainable code.",
//       label: "Web Design",
//       author: "Michael Park",
//       published: "22 Feb 2024",
//       url: "https://shadcnblocks.com",
//       image: "/images/block/placeholder-dark-1.svg",
//       tags: ["Web Design", "CSS"],
//     },
//   ],
// }: Blog8Props) => {
//   return (
//     <section className="py-32">
//       <div className="container flex flex-col items-center gap-16">
//         <div className="text-center">
//           <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl">
//             {heading}
//           </h2>
//           <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
//             {description}
//           </p>
//         </div>

//         <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
//           {posts.map((post) => (
//             <Card
//               key={post.id}
//               className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
//             >
//               <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
//                 <div className="sm:col-span-5">
//                   <div className="mb-4 md:mb-6">
//                     <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground md:gap-5 lg:gap-6">
//                       {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
//                     <a
//                       href={post.url}
//                       target="_blank"
//                       className="hover:underline"
//                     >
//                       {post.title}
//                     </a>
//                   </h3>
//                   <p className="mt-4 text-muted-foreground md:mt-5">
//                     {post.summary}
//                   </p>
//                   <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
//                     <span className="text-muted-foreground">{post.author}</span>
//                     <span className="text-muted-foreground">•</span>
//                     <span className="text-muted-foreground">
//                       {post.published}
//                     </span>
//                   </div>
//                   <div className="mt-6 flex items-center space-x-2 md:mt-8">
//                     <a
//                       href={post.url}
//                       target="_blank"
//                       className="inline-flex items-center font-semibold hover:underline md:text-base"
//                     >
//                       <span>Read more</span>
//                       <ArrowRight className="ml-2 size-4 transition-transform" />
//                     </a>
//                   </div>
//                 </div>
//                 <div className="order-first sm:order-last sm:col-span-5">
//                   <a href={post.url} target="_blank" className="block">
//                     <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
//                       <img
//                         src={post.image}
//                         alt={post.title}
//                         className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
//                       />
//                     </div>
//                   </a>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export { Blog8 };
