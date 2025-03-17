import Link from "next/link";
import { Button } from "@saas-foundations/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{" "}
        and see the documentation.
      </p>
      <Button
        className="bg-red-300 p-2 max-w-sm rounded cursor-pointer"
        appName="oss-dynamic"
      >
        Click Me
      </Button>
    </main>
  );
}
