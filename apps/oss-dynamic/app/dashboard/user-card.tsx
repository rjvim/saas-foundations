"use client";
import { client, signOut, useSession } from "@/lib/auth-client";
import { Button } from "@foundations/shadcn/components/button";
import { useRouter } from "next/navigation";

export default function UserCard() {
  const router = useRouter();

  return (
    <>
      <Button
        className="gap-2 z-10"
        variant="secondary"
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess() {
                router.push("/");
              },
            },
          });
        }}
      >
        <span className="text-sm">
          <div className="flex items-center gap-2">Sign Out</div>
        </span>
      </Button>
    </>
  );
}
