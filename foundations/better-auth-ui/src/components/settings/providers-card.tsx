"use client";

import type { SocialProvider } from "better-auth/social-providers";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import { socialProviders } from "@foundations/better-auth-ui/lib/social-providers";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@foundations/shadcn/components/card";

import type { SettingsCardClassNames } from "./settings-card";
import { ProvidersCardSkeleton } from "./skeletons/providers-card-skeleton";

export interface ProvidersCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  accounts?: { accountId: string; provider: string }[] | null;
  isPending?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: Partial<AuthLocalization>;
  skipHook?: boolean;
  refetch?: () => void;
}

export function ProvidersCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
  refetch,
}: ProvidersCardProps) {
  const {
    authClient,
    colorIcons,
    hooks,
    mutates: { unlinkAccount },
    localization: authLocalization,
    noColorIcons,
    optimistic,
    providers,
  } = useContext(AuthUIContext);
  const { useListAccounts } = hooks;

  localization = { ...authLocalization, ...localization };

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
    refetch = result.refetch;
  }

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const hasShownLinkedToast = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("providerLinked") && !hasShownLinkedToast.current) {
      hasShownLinkedToast.current = true;
      setTimeout(() => {
        toast.success(localization.providerLinkSuccess);

        // Remove the parameter from URL
        params.delete("providerLinked");
        const query = params.toString();
        const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
        window.history.replaceState(null, "", url);
      }, 0);
    }
  }, [localization.providerLinkSuccess]);

  const handleLink = async (provider: SocialProvider) => {
    setActionLoading(provider);
    const callbackURL = `${window.location.pathname}?providerLinked=true`;
    const { error } = await authClient.linkSocial({ provider, callbackURL });

    if (error) {
      toast.error(error.message || error.statusText);
      setActionLoading(null);
    }
  };

  const handleUnlink = async ({
    accountId,
    providerId,
  }: {
    accountId: string;
    providerId: string;
  }) => {
    if (!optimistic) setActionLoading(providerId);

    const { error } = await unlinkAccount({ accountId, providerId });

    if (error) {
      toast.error(error.message || error.statusText);
    } else {
      toast.success(localization.providerUnlinkSuccess);
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
          {localization.providers}
        </CardTitle>

        <CardDescription
          className={cn("text-xs md:text-sm", classNames?.description)}
        >
          {localization.providersDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("flex flex-col gap-3", classNames?.content)}>
        {providers?.map((provider) => {
          const socialProvider = socialProviders.find(
            (socialProvider) => socialProvider.provider === provider
          );
          if (!socialProvider) return null;

          const account = accounts?.find((acc) => acc.provider === provider);
          const isLinked = !!account;

          const isButtonLoading =
            actionLoading === provider || actionLoading === provider;

          return (
            <Card
              key={provider}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                classNames?.cell
              )}
            >
              {colorIcons ? (
                <socialProvider.icon className="size-4" color />
              ) : noColorIcons ? (
                <socialProvider.icon className="size-4" />
              ) : (
                <>
                  <socialProvider.icon className="size-4 dark:hidden" color />
                  <socialProvider.icon className="hidden size-4 dark:block" />
                </>
              )}

              <span className="text-sm">{socialProvider.name}</span>

              <Button
                className={cn("relative ms-auto", classNames?.button)}
                disabled={isButtonLoading}
                size="sm"
                type="button"
                variant={isLinked ? "outline" : "default"}
                onClick={() => {
                  if (actionLoading) return;

                  if (isLinked) {
                    handleUnlink({
                      accountId: account.accountId,
                      providerId: provider,
                    });
                  } else {
                    handleLink(provider);
                  }
                }}
              >
                <span className={isButtonLoading ? "opacity-0" : "opacity-100"}>
                  {isLinked ? localization.unlink : localization.link}
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
