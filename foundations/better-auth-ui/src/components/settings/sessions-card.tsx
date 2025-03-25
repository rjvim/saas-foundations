"use client";

import { LaptopIcon, Loader2, SmartphoneIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@foundations/shadcn/components/card";

import type { Session } from "better-auth";
import type { SettingsCardClassNames } from "./settings-card";
import { ProvidersCardSkeleton } from "./skeletons/providers-card-skeleton";

export interface SessionsCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  isPending?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
  sessions?: Session[] | null;
  skipHook?: boolean;
  refetch?: () => void;
}

export function SessionsCard({
  className,
  classNames,
  isPending,
  localization,
  sessions,
  skipHook,
  refetch,
}: SessionsCardProps) {
  const {
    hooks: { useListSessions, useSession },
    mutates: { revokeSession },
    localization: authLocalization,
    optimistic,
    navigate,
    basePath,
    viewPaths,
  } = useContext(AuthUIContext);

  localization = { ...authLocalization, ...localization };

  if (isPending === undefined && sessions === undefined) {
    const result = useListSessions();
    sessions = result.data;
    isPending = result.isPending;
    refetch = result.refetch;
  }

  const { data: sessionData } = useSession();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleRevoke = async (token: string) => {
    if (token === sessionData?.session?.token) {
      navigate(`${basePath}/${viewPaths.signOut}`);
      return;
    }

    if (!optimistic) setActionLoading(token);

    const { error } = await revokeSession({ token });

    if (error) {
      toast.error(error.message || error.statusText);
    } else if (!optimistic) {
      refetch?.();
    }

    setActionLoading(null);
  };

  if (isPending) {
    return (
      <ProvidersCardSkeleton className={className} classNames={classNames} />
    );
  }

  return (
    <Card className={cn("w-full", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
          {localization.sessions}
        </CardTitle>

        <CardDescription
          className={cn("text-xs md:text-sm", classNames?.description)}
        >
          {localization.sessionsDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("flex flex-col gap-3", classNames?.content)}>
        {sessions?.map((session) => {
          const parser = UAParser(session.userAgent as string);

          const isButtonLoading = actionLoading === session.token;

          return (
            <Card
              key={session.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                classNames?.cell
              )}
            >
              {parser.device.type === "mobile" ? (
                <SmartphoneIcon className="size-4" />
              ) : (
                <LaptopIcon className="size-4" />
              )}

              <span className="text-sm">
                {session.id === sessionData?.session?.id ? (
                  localization.currentSession
                ) : (
                  <>
                    {parser.os.name}, {parser.browser.name}
                  </>
                )}
              </span>

              <Button
                className={cn("relative ms-auto", classNames?.button)}
                disabled={isButtonLoading}
                size="sm"
                variant="outline"
                onClick={() => {
                  handleRevoke(session.token);
                }}
              >
                <span className={isButtonLoading ? "opacity-0" : "opacity-100"}>
                  {session.id === sessionData?.session?.id
                    ? localization.signOut
                    : localization.revoke}
                </span>

                {isButtonLoading && (
                  <span className="absolute">
                    <Loader2 className="animate-spin" />
                  </span>
                )}
              </Button>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
