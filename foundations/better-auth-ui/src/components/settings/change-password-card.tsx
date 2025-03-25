"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useContext, useState } from "react";
import { toast } from "sonner";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@foundations/shadcn/components/card";
import { Label } from "@foundations/shadcn/components/label";

// import { PasswordInput } from "../password-input";
import type { SettingsCardClassNames } from "./settings-card";
import { ChangePasswordCardSkeleton } from "./skeletons/change-password-card-skeleton";
import { PasswordInput } from "@foundations/shadcn/components/password-input";

export interface ChangePasswordCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  accounts?: { provider: string }[] | null;
  isPending?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
  skipHook?: boolean;
}

export function ChangePasswordCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
}: ChangePasswordCardProps) {
  const {
    authClient,
    basePath,
    hooks: { useSession, useListAccounts },
    localization: authLocalization,
    viewPaths,
  } = useContext(AuthUIContext);

  localization = { ...authLocalization, ...localization };

  const { data: sessionData } = useSession();

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }

  const [disabled, setDisabled] = useState(true);
  const [isSetPasswordLoading, setIsSetPasswordLoading] = useState(false);

  const handleSetPassword = async () => {
    const email = sessionData?.user.email;

    if (!email) {
      toast.error("Email not found");
      return;
    }

    setIsSetPasswordLoading(true);

    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: `${basePath}/${viewPaths.resetPassword}`,
    });

    setIsSetPasswordLoading(false);

    if (error) {
      toast.error(error.message || error.statusText);
    } else {
      toast.success(localization.setPasswordEmailSent);
    }
  };

  const formAction = async (_: unknown, formData: FormData) => {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || error.statusText);
    } else {
      toast.success(localization.changePasswordSuccess);
    }
  };

  const [_, action, isSubmitting] = useActionState(formAction, null);

  if (isPending || !accounts) {
    return (
      <ChangePasswordCardSkeleton
        className={className}
        classNames={classNames}
      />
    );
  }

  const credentialsLinked = accounts.some(
    (acc) => acc.provider === "credential"
  );

  if (!credentialsLinked) {
    return (
      <Card
        className={cn("w-full overflow-hidden", className, classNames?.base)}
      >
        <CardHeader className={classNames?.header}>
          <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
            {localization.changePassword}
          </CardTitle>

          <CardDescription
            className={cn("text-xs md:text-sm", classNames?.description)}
          >
            {localization.setPasswordDescription}
          </CardDescription>
        </CardHeader>

        <CardFooter
          className={cn(
            "flex justify-center border-t bg-muted py-4 md:justify-end md:py-3 dark:bg-transparent",
            classNames?.footer
          )}
        >
          <Button
            disabled={isSetPasswordLoading}
            size="sm"
            onClick={handleSetPassword}
          >
            <span className={cn(isSetPasswordLoading && "opacity-0")}>
              {localization.setPassword}
            </span>

            {isSetPasswordLoading && (
              <span className="absolute">
                <Loader2 className="animate-spin" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full overflow-hidden", className, classNames?.base)}>
      <form action={action}>
        <CardHeader className={classNames?.header}>
          <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
            {localization.changePassword}
          </CardTitle>

          <CardDescription
            className={cn("text-xs md:text-sm", classNames?.description)}
          >
            {localization.changePasswordDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("grid gap-4", classNames?.content)}>
          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="currentPassword">
              {localization.currentPassword}
            </Label>

            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              className={classNames?.input}
              autoComplete="current-password"
              placeholder={localization.currentPasswordPlaceholder}
              required
              onChange={() => setDisabled(false)}
            />
          </div>

          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="newPassword">
              {localization.newPassword}
            </Label>

            <PasswordInput
              id="newPassword"
              name="newPassword"
              className={classNames?.input}
              autoComplete="new-password"
              placeholder={localization.newPasswordPlaceholder}
              required
              enableToggle
              onChange={() => setDisabled(false)}
            />
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            "flex flex-col justify-between gap-4 border-t bg-muted py-4 md:flex-row md:py-3 dark:bg-transparent",
            classNames?.footer
          )}
        >
          <CardDescription
            className={cn("text-xs md:text-sm", classNames?.instructions)}
          >
            {localization.changePasswordInstructions}
          </CardDescription>

          <Button
            className={classNames?.button}
            disabled={disabled || isSubmitting}
            size="sm"
          >
            <span className={cn(isSubmitting && "opacity-0")}>
              {localization.save}
            </span>

            {isSubmitting && (
              <span className="absolute">
                <Loader2 className="animate-spin" />
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
