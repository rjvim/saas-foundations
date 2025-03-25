import { LockIcon, MailIcon } from "lucide-react";
import { useContext } from "react";
import { useFormStatus } from "react-dom";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import type { AuthView } from "@foundations/better-auth-ui/lib/auth-view-paths";
import { cn } from "@foundations/shadcn/lib/utils";
import { Button } from "@foundations/shadcn/components/button";

export function MagicLinkButton({
  className,
  isLoading,
  localization,
  view,
}: {
  className?: string;
  isLoading?: boolean;
  localization: Partial<AuthLocalization>;
  view: AuthView;
}) {
  const { pending } = useFormStatus();
  const { viewPaths, navigate } = useContext(AuthUIContext);

  return (
    <Button
      className={cn("w-full", className)}
      disabled={pending || isLoading}
      type="button"
      variant="secondary"
      onClick={() => {
        navigate(view === "magicLink" ? viewPaths.signIn : viewPaths.magicLink);
      }}
    >
      {view === "magicLink" ? <LockIcon /> : <MailIcon />}
      {localization.signInWith}{" "}
      {view === "magicLink" ? localization.password : localization.magicLink}
    </Button>
  );
}
