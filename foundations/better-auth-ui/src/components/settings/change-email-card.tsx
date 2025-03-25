"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";

import { Loader2 } from "lucide-react";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@foundations/shadcn/components/card";
import { SettingsCard, type SettingsCardClassNames } from "./settings-card";

export interface ChangeEmailCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  isPending?: boolean;
  localization?: AuthLocalization;
}

export function ChangeEmailCard({
  className,
  classNames,
  isPending,
  localization,
}: ChangeEmailCardProps) {
  const shownVerifyEmailToast = useRef(false);

  const {
    authClient,
    emailVerification,
    hooks: { useSession },
    localization: authLocalization,
  } = useContext(AuthUIContext);
  localization = { ...authLocalization, ...localization };

  const {
    data: sessionData,
    isPending: sessionPending,
    refetch,
  } = useSession();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!sessionData) return;
    if (shownVerifyEmailToast.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("verifyEmail") && !sessionData.user.emailVerified) {
      shownVerifyEmailToast.current = true;
      setTimeout(() => toast(localization?.emailVerification));
    }
  }, [localization, sessionData]);

  const formAction = async (formData: FormData) => {
    const newEmail = (formData.get("email") as string) || "";
    if (newEmail === sessionData?.user.email) return {};

    const callbackURL = `${window.location.pathname}?verifyEmail=true`;

    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL,
    });

    if (!error) {
      if (sessionData?.user.emailVerified) {
        toast(localization?.emailVerifyChange);
      } else {
        refetch();
      }
    }

    return { error };
  };

  return (
    <>
      <SettingsCard
        key={sessionData?.user.email}
        className={className}
        classNames={classNames}
        defaultValue={sessionData?.user?.email}
        description={localization.emailDescription}
        field="email"
        formAction={formAction}
        instructions={localization.emailInstructions}
        isPending={isPending || sessionPending}
        label={localization.email}
        localization={localization}
        placeholder={localization.emailPlaceholder}
      />

      {emailVerification &&
        sessionData?.user &&
        !sessionData?.user.emailVerified && (
          <Card className={cn("w-full overflow-hidden", classNames?.base)}>
            <CardHeader className={classNames?.header}>
              <CardTitle
                className={cn("text-lg md:text-xl", classNames?.title)}
              >
                {localization.verifyYourEmail}
              </CardTitle>

              <CardDescription className={classNames?.description}>
                {localization.verifyYourEmailDescription}
              </CardDescription>
            </CardHeader>

            <CardFooter
              className={cn(
                "flex flex-col justify-between gap-4 border-t bg-muted py-4 md:flex-row md:py-3 dark:bg-transparent",
                classNames?.footer
              )}
            >
              <Button
                className={cn("md:ms-auto", classNames?.button)}
                disabled={isResending || resendDisabled}
                size="sm"
                onClick={async () => {
                  setIsResending(true);
                  setResendDisabled(true);

                  const { error } = await authClient.sendVerificationEmail({
                    email: sessionData.user.email,
                  });

                  setIsResending(false);

                  if (error) {
                    toast(error.message || error.statusText);
                    setResendDisabled(false);
                  } else {
                    toast(localization.emailVerification);
                  }
                }}
              >
                <span className={cn(isResending && "opacity-0")}>
                  {localization.resendVerificationEmail}
                </span>

                {isResending && (
                  <span className="absolute">
                    <Loader2 className="animate-spin" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
    </>
  );
}
