"use client";

import { Loader2 } from "lucide-react";
import { useContext, useEffect } from "react";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import type { AuthView } from "@foundations/better-auth-ui/lib/auth-view-paths";
import { cn } from "@foundations/shadcn/lib/utils";
import {
  SettingsCards,
  type SettingsCardsClassNames,
} from "../settings/settings-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@foundations/shadcn/components/card";

import { AuthForm, type AuthFormClassNames } from "./auth-form";

export interface AuthCardClassNames {
  base?: string;
  content?: string;
  description?: string;
  footer?: string;
  footerLink?: string;
  form?: AuthFormClassNames;
  settings?: SettingsCardsClassNames;
  header?: string;
  title?: string;
}

export interface AuthCardProps {
  className?: string;
  classNames?: AuthCardClassNames;
  callbackURL?: string;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
  pathname?: string;
  redirectTo?: string;
  /**
   * @default "auto"
   */
  socialLayout?: "auto" | "horizontal" | "grid" | "vertical";
  /**
   * @remarks `AuthView`
   */
  view?: AuthView;
}

export function AuthCard({
  className,
  classNames,
  callbackURL,
  localization,
  pathname,
  redirectTo,
  socialLayout = "auto",
  view,
}: AuthCardProps) {
  const path = pathname?.split("/").pop();

  const {
    basePath,
    credentials,
    localization: authLocalization,
    magicLink,
    replace,
    settingsUrl,
    signUp,
    viewPaths,
    LinkComponent,
  } = useContext(AuthUIContext);

  localization = { ...authLocalization, ...localization };

  if (path && !Object.values(viewPaths).includes(path)) {
    console.error(`Invalid auth view: ${path}`);
  }

  view =
    view ||
    ((Object.entries(viewPaths).find(([_, value]) => value === path)?.[0] ||
      "signIn") as AuthView);

  useEffect(() => {
    if (view === "settings" && settingsUrl) {
      replace(settingsUrl);
    }
  }, [replace, settingsUrl, view]);

  if (["signOut", "callback"].includes(view)) {
    return (
      <AuthForm
        callbackURL={callbackURL}
        classNames={classNames?.form}
        localization={localization}
        redirectTo={redirectTo}
        socialLayout={socialLayout}
        view={view}
      />
    );
  }

  if (view === "settings")
    return settingsUrl ? (
      <Loader2 className="animate-spin" />
    ) : (
      <SettingsCards
        className={cn(className)}
        classNames={classNames?.settings}
      />
    );

  const description =
    !credentials && !magicLink
      ? localization.disabledCredentialsDescription
      : localization[`${view}Description` as keyof typeof localization];

  return (
    <Card className={cn("w-full max-w-sm", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
          {localization[view as keyof typeof localization]}
        </CardTitle>

        {description && (
          <CardDescription
            className={cn("text-xs md:text-sm", classNames?.description)}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className={classNames?.content}>
        <AuthForm
          callbackURL={callbackURL}
          classNames={classNames?.form}
          localization={localization}
          redirectTo={redirectTo}
          socialLayout={socialLayout}
          view={view}
        />
      </CardContent>

      {credentials && signUp && (
        <CardFooter
          className={cn(
            "justify-center gap-1 text-muted-foreground text-sm",
            classNames?.footer
          )}
        >
          {view === "signIn"
            ? localization.dontHaveAnAccount
            : localization.alreadyHaveAnAccount}

          <LinkComponent
            className={cn("text-foreground underline", classNames?.footerLink)}
            href={`${basePath}/${viewPaths[view === "signIn" ? "signUp" : "signIn"]}`}
            to={`${basePath}/${viewPaths[view === "signIn" ? "signUp" : "signIn"]}`}
          >
            {view === "signIn" ? localization.signUp : localization.signIn}
          </LinkComponent>
        </CardFooter>
      )}
    </Card>
  );
}
