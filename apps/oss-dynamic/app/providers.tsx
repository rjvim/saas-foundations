"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { client as authClient } from "@/lib/auth-client";
import { Toaster } from "@foundations/shadcn/components/sonner";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh();
        }}
        LinkComponent={Link}
      >
        {children}
        <Toaster />
      </AuthUIProvider>
    </ThemeProvider>
  );
}
