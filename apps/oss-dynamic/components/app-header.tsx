"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@foundations/shadcn/components/card";
import { client, signOut, useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Button } from "@foundations/shadcn/components/button";
import { toast } from "sonner";

export default function AppHeader() {
  const { data: session, isPending, error } = useSession();

  return (
    <div className="p-2 bg-red-200">
      <h1>This is to check if is logged in or not</h1>

      {/* Session Display */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>
            {isPending
              ? "Loading session..."
              : session
                ? "You are currently logged in"
                : "You are not logged in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              Error: {error.message}
            </div>
          ) : session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {session.user.name?.charAt(0) ||
                        session.user.email?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium mb-2">Session Details:</p>
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>Sign in to view your session information</p>
            </div>
          )}
        </CardContent>
        {session && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                client.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Successfully signed out!");
                    },
                  },
                })
              }
            >
              Sign Out
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
