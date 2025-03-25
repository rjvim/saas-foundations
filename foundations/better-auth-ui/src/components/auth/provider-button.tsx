import { useContext } from "react";
import { useFormStatus } from "react-dom";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import type { socialProviders } from "@foundations/better-auth-ui/lib/social-providers";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";

export function ProviderButton({
  className,
  isLoading,
  localization,
  socialLayout,
  socialProvider,
}: {
  className?: string;
  isLoading?: boolean;
  localization: Partial<AuthLocalization>;
  socialLayout: "auto" | "horizontal" | "grid" | "vertical";
  socialProvider: (typeof socialProviders)[number];
}) {
  const { pending } = useFormStatus();
  const { colorIcons, noColorIcons } = useContext(AuthUIContext);

  return (
    <Button
      className={cn(socialLayout === "vertical" ? "w-full" : "grow", className)}
      disabled={pending || isLoading}
      formNoValidate
      name="provider"
      value={socialProvider.provider}
      variant="outline"
    >
      {colorIcons ? (
        <socialProvider.icon color />
      ) : noColorIcons ? (
        <socialProvider.icon />
      ) : (
        <>
          <socialProvider.icon className="dark:hidden" color />
          <socialProvider.icon className="hidden dark:block" />
        </>
      )}

      {socialLayout === "grid" && <>{socialProvider.name}</>}

      {socialLayout === "vertical" && (
        <>
          {localization.signInWith} {socialProvider.name}
        </>
      )}
    </Button>
  );
}
