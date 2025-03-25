"use client";

import { useContext } from "react";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";

import type { SettingsCardClassNames } from "./settings-card";
import { UpdateFieldCard } from "./update-field-card";

export interface UpdateUsernameCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  isPending?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
}

export function UpdateUsernameCard({
  className,
  classNames,
  isPending,
  localization,
}: UpdateUsernameCardProps) {
  const { hooks, localization: authLocalization } = useContext(AuthUIContext);
  const { useSession } = hooks;
  localization = { ...authLocalization, ...localization };

  const { data: sessionData } = useSession();

  const defaultValue =
    // @ts-expect-error Optional plugin
    sessionData?.user.displayUsername || sessionData?.user.username;

  return (
    <UpdateFieldCard
      key={defaultValue}
      className={className}
      classNames={classNames}
      defaultValue={defaultValue}
      description={localization.usernameDescription}
      field="username"
      instructions={localization.usernameInstructions}
      isPending={isPending}
      label={localization.username}
      localization={localization}
      placeholder={localization.usernamePlaceholder}
      required={true}
    />
  );
}
