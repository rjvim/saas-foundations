"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import type { AuthView } from "@foundations/better-auth-ui/lib/auth-view-paths";
import {
  type SocialProvider,
  socialProviders,
} from "@foundations/better-auth-ui/lib/social-providers";
import { isValidEmail } from "@foundations/better-auth-ui/lib/utils";
import { Checkbox } from "@foundations/shadcn/components/checkbox";
import { Input } from "@foundations/shadcn/components/input";
import { Label } from "@foundations/shadcn/components/label";

import { ActionButton } from "./action-button";
import { MagicLinkButton } from "./magic-link-button";
import { PasskeyButton } from "./passkey-button";
import { ProviderButton } from "./provider-button";
import { PasswordInput } from "../password-input";
import { cn } from "@foundations/shadcn/lib/utils";

export type AuthFormClassNames = {
  base?: string;
  actionButton?: string;
  forgotPasswordLink?: string;
  input?: string;
  label?: string;
  description?: string;
  providerButton?: string;
  secondaryButton?: string;
};

export function AuthForm({
  className,
  classNames,
  callbackURL,
  localization,
  pathname,
  redirectTo,
  socialLayout = "auto",
  view,
}: {
  className?: string;
  classNames?: AuthFormClassNames;
  callbackURL?: string;
  localization?: Partial<AuthLocalization>;
  pathname?: string;
  redirectTo?: string;
  socialLayout?: "auto" | "horizontal" | "grid" | "vertical";
  view?: AuthView;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    additionalFields,
    authClient,
    basePath,
    defaultRedirectTo,
    credentials,
    forgotPassword,
    hooks: { useIsRestoring, useSession },
    localization: authLocalization,
    magicLink,
    nameRequired,
    navigate,
    passkey,
    persistClient,
    providers,
    rememberMe,
    replace,
    signUp,
    signUpFields,
    username: usernamePlugin,
    viewPaths,
    onSessionChange,
    LinkComponent,
  } = useContext(AuthUIContext);

  const { data: sessionData, error } = useSession();

  localization = { ...authLocalization, ...localization };

  const isRestoring = useIsRestoring();

  const signingOut = useRef(false);
  const isRedirecting = useRef(false);
  const checkingResetPasswordToken = useRef(false);

  if (socialLayout === "auto") {
    socialLayout = !credentials
      ? "vertical"
      : providers && providers.length > 3
        ? "horizontal"
        : "vertical";
  }

  const path = pathname?.split("/").pop();

  if (path && !Object.values(viewPaths).includes(path)) {
    console.error(`Invalid auth view: ${path}`);
  }

  view =
    view ||
    ((Object.entries(viewPaths).find(([_, value]) => value === path)?.[0] ||
      "signIn") as AuthView);

  const getRedirectTo = useCallback(
    () =>
      redirectTo ||
      new URLSearchParams(window.location.search).get("redirectTo") ||
      defaultRedirectTo,
    [defaultRedirectTo, redirectTo]
  );

  const getCallbackURL = useCallback(
    () =>
      callbackURL ||
      (persistClient
        ? `${window.location.pathname.replace(viewPaths[view], viewPaths.callback)}?redirectTo=${getRedirectTo()}`
        : getRedirectTo()),
    [callbackURL, persistClient, view, viewPaths, getRedirectTo]
  );

  const successRef = useRef(false);

  const onSuccess = useCallback(() => {
    onSessionChange?.();
    successRef.current = true;
    setIsLoading(true);
  }, [onSessionChange]);

  useEffect(() => {
    if (!isLoading || !successRef.current) return;

    if (error) {
      setIsLoading(false);
      toast.error(error.message || error.statusText);
      successRef.current = false;
      return;
    }

    if (sessionData) {
      navigate(getRedirectTo());
    }
  }, [isLoading, error, navigate, sessionData, getRedirectTo]);

  const formAction = async (formData: FormData) => {
    const provider = formData.get("provider") as SocialProvider;

    if (provider) {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: getCallbackURL(),
      });
      if (error) {
        toast.error(error.message || error.statusText);
      } else {
        setIsLoading(true);
      }

      return;
    }

    if (formData.get("passkey")) {
      // @ts-expect-error Optional plugin
      const response = await authClient.signIn.passkey();

      if (response?.error) {
        toast.error(response.error.message || response.error.statusText);
      } else {
        onSuccess();
      }

      return;
    }

    let email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") || ("" as string);

    switch (view) {
      case "signIn": {
        if (!credentials) {
          // @ts-expect-error Optional plugin
          const { error } = await authClient.signIn.magicLink({
            email,
            callbackURL: getCallbackURL(),
          });

          if (error) {
            toast.error(error.message || error.statusText);
          } else {
            toast.success(localization.magicLinkEmail);
          }

          return;
        }

        const params = {
          password,
          rememberMe: !rememberMe || formData.has("rememberMe"),
        };

        if (usernamePlugin) {
          const username = formData.get("username") as string;

          if (isValidEmail(username)) {
            email = username;
          } else {
            // @ts-expect-error Optional plugin
            const { error } = await authClient.signIn.username({
              username,
              ...params,
            });

            if (error) {
              toast.error(error.message || error.statusText);
            } else {
              onSuccess();
            }

            return;
          }
        }

        console.log("email", email);
        console.log("params", params);

        const { error } = await authClient.signIn.email({
          email,
          ...params,
        });
        console.log("error", error);
        console.log("toast", toast);

        if (error) {
          toast.error(error.message || error.statusText);
        } else {
          onSuccess();
        }

        break;
      }

      case "magicLink": {
        // @ts-expect-error Optional plugin
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: getCallbackURL(),
        });

        if (error) {
          toast.error(error.message || error.statusText);
        } else {
          toast.success(localization.magicLinkEmail);
        }

        break;
      }

      case "signUp": {
        const params = {
          email,
          password,
          name,
          callbackURL: getCallbackURL(),
        } as Record<string, unknown>;

        if (usernamePlugin) {
          params.username = formData.get("username");
        }

        signUpFields?.map((field) => {
          if (field === "name") return;

          const additionalField = additionalFields?.[field];
          if (!additionalField) return;

          if (formData.has(field)) {
            const value = formData.get(field) as string;

            if (additionalField.validate && !additionalField.validate(value)) {
              toast.error(`${localization.failedToValidate} ${field}`);
              return;
            }

            params[field] =
              additionalField.type === "number"
                ? Number.parseFloat(value)
                : additionalField.type === "boolean"
                  ? value === "on"
                  : value;
          }
        });

        // @ts-expect-error We omit signUp from the authClient type to support additional fields
        const { data, error } = await authClient.signUp.email(params);

        if (error) {
          toast.error(error.message || error.statusText);
        } else if (data.token) {
          onSuccess();
        } else {
          navigate(`${basePath}/${viewPaths.signIn}`);
          toast.success(localization.signUpEmail);
        }

        break;
      }

      case "forgotPassword": {
        const { error } = await authClient.forgetPassword({
          email: email,
          redirectTo: window.location.pathname.replace(
            viewPaths.forgotPassword,
            viewPaths.resetPassword
          ),
        });

        if (error) {
          toast.error(error.message || error.statusText);
        } else {
          toast.success(localization.forgotPasswordEmail);
          navigate(`${basePath}/${viewPaths.signIn}`);
        }

        break;
      }

      case "resetPassword": {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token") as string;

        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        });

        if (error) {
          toast.error(error.message || error.statusText);
        } else {
          toast.success(localization.resetPasswordSuccess);
          navigate(`${basePath}/${viewPaths.signIn}`);
        }

        break;
      }
    }
  };

  useEffect(() => {
    if (view !== "signOut") {
      signingOut.current = false;
    }

    if (view !== "callback") {
      isRedirecting.current = false;
    }
  }, [view]);

  useEffect(() => {
    if (view !== "signOut" || signingOut.current) return;

    signingOut.current = true;
    authClient.signOut().finally(async () => {
      replace(`${basePath}/${viewPaths.signIn}`);
      onSessionChange?.();
    });
  }, [view, authClient, basePath, replace, viewPaths.signIn, onSessionChange]);

  useEffect(() => {
    if (view !== "resetPassword" || checkingResetPasswordToken.current) return;

    checkingResetPasswordToken.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    if (!token || token === "INVALID_TOKEN") {
      navigate(`${basePath}/${viewPaths.signIn}`);
      setTimeout(() => {
        toast.error(localization.resetPasswordInvalidToken);
        checkingResetPasswordToken.current = false;
      }, 100);
    }
  }, [basePath, view, viewPaths, navigate, localization]);

  useEffect(() => {
    if (view === "magicLink" && !magicLink) {
      replace(`${basePath}/${viewPaths.signIn}`);
    }

    if (view === "signUp" && !signUp) {
      replace(`${basePath}/${viewPaths.signIn}`);
    }

    if (
      ["signUp", "forgotPassword", "resetPassword"].includes(view) &&
      !credentials
    ) {
      replace(`${basePath}/${viewPaths.signIn}`);
    }
  }, [basePath, view, viewPaths, credentials, replace, signUp, magicLink]);

  useEffect(() => {
    if (view !== "callback" || isRedirecting.current) return;

    if (!persistClient) {
      replace(getRedirectTo());
      return;
    }

    if (isRestoring) return;

    isRedirecting.current = true;

    onSuccess();
  }, [isRestoring, view, replace, persistClient, getRedirectTo, onSuccess]);

  if (["signOut", "callback"].includes(view))
    return <Loader2 className="animate-spin" />;

  return (
    <form
      action={formAction}
      className={cn("grid w-full gap-4", className, classNames?.base)}
    >
      {credentials &&
        view === "signUp" &&
        (nameRequired || signUpFields?.includes("name")) && (
          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="name">
              {localization.name}
            </Label>

            <Input
              className={classNames?.input}
              id="name"
              name="name"
              placeholder={localization.namePlaceholder}
              required={nameRequired}
            />
          </div>
        )}

      {credentials && usernamePlugin && ["signIn", "signUp"].includes(view) && (
        <div className="grid gap-2">
          <Label className={classNames?.label} htmlFor="username">
            {localization.username}
          </Label>

          <Input
            className={classNames?.input}
            id="username"
            name="username"
            placeholder={
              view === "signIn"
                ? localization.usernameSignInPlaceholder
                : localization.usernamePlaceholder
            }
            required
          />
        </div>
      )}

      {(credentials || (["signIn", "magicLink"].includes(view) && magicLink)) &&
        ((!usernamePlugin && view !== "resetPassword") ||
          ["signUp", "magicLink", "forgotPassword"].includes(view)) && (
          <div className="grid gap-2">
            <Label className={classNames?.label} htmlFor="email">
              {localization.email}
            </Label>

            <Input
              className={classNames?.input}
              id="email"
              name="email"
              placeholder={localization.emailPlaceholder}
              required
              type="email"
            />
          </div>
        )}

      {credentials && ["signUp", "signIn", "resetPassword"].includes(view) && (
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label className={classNames?.label} htmlFor="password">
              {localization.password}
            </Label>

            {view === "signIn" && forgotPassword && (
              <LinkComponent
                className={cn(
                  "-my-1 ml-auto inline-block text-sm hover:underline",
                  classNames?.forgotPasswordLink
                )}
                href={`${basePath}/${viewPaths.forgotPassword}`}
                to={`${basePath}/${viewPaths.forgotPassword}`}
              >
                {localization.forgotPasswordLink}
              </LinkComponent>
            )}
          </div>

          <PasswordInput
            id="password"
            name="password"
            autoComplete={
              ["signUp", "resetPassword"].includes(view)
                ? "new-password"
                : "password"
            }
            className={classNames?.input}
            enableToggle={view !== "signIn"}
            placeholder={localization.passwordPlaceholder}
            required
          />
        </div>
      )}

      {view === "signIn" && rememberMe && (
        <div className="flex items-center gap-2">
          <Checkbox id="rememberMe" name="rememberMe" />

          <Label htmlFor="rememberMe">{localization.rememberMe}</Label>
        </div>
      )}

      {view === "signUp" &&
        signUpFields
          ?.filter((field) => field !== "name")
          .map((field) => {
            const additionalField = additionalFields?.[field];

            if (!additionalField) {
              console.error(`Invalid additional field: ${field}`);
              return null;
            }

            return additionalField.type === "boolean" ? (
              <div key={field} className="flex items-center gap-2">
                <Checkbox
                  id={field}
                  name={field}
                  required={additionalField.required}
                />

                <Label className={cn(classNames?.label)} htmlFor={field}>
                  {additionalField?.label}
                </Label>
              </div>
            ) : (
              <div key={field} className="grid gap-2">
                <Label className={classNames?.label} htmlFor={field}>
                  {additionalField?.label}
                </Label>

                <Input
                  className={classNames?.input}
                  id={field}
                  name={field}
                  placeholder={
                    additionalField?.placeholder ||
                    (typeof additionalField?.label === "string"
                      ? additionalField?.label
                      : "")
                  }
                  required={additionalField?.required}
                  type={additionalField?.type === "number" ? "number" : "text"}
                />
              </div>
            );
          })}

      {(credentials ||
        (["signIn", "magicLink"].includes(view) && magicLink)) && (
        <ActionButton
          authView={view}
          className={classNames?.actionButton}
          isLoading={isLoading}
          localization={localization}
        />
      )}

      {magicLink && credentials && view !== "resetPassword" && (
        <MagicLinkButton
          className={classNames?.secondaryButton}
          isLoading={isLoading}
          localization={localization}
          view={view}
        />
      )}

      {!["forgotPassword", "resetPassword"].includes(view) &&
        providers?.length && (
          <div
            className={cn(
              "flex w-full items-center gap-2",
              "justify-between",
              socialLayout === "horizontal" && "flex-wrap",
              socialLayout === "vertical" && "flex-col",
              socialLayout === "grid" && "grid grid-cols-2"
            )}
          >
            {providers?.map((provider) => {
              const socialProvider = socialProviders.find(
                (socialProvider) => socialProvider.provider === provider
              );
              if (!socialProvider) return null;

              return (
                <ProviderButton
                  key={provider}
                  className={classNames?.providerButton}
                  isLoading={isLoading}
                  localization={localization}
                  socialLayout={socialLayout}
                  socialProvider={socialProvider}
                />
              );
            })}
          </div>
        )}

      {passkey && (
        <PasskeyButton
          className={classNames?.secondaryButton}
          isLoading={isLoading}
          localization={localization}
        />
      )}
    </form>
  );
}
