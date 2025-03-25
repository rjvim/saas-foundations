"use client";

import { useContext } from "react";

import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";

import type { SettingsCardClassNames } from "./settings-card";
import { UpdateFieldCard } from "./update-field-card";

export interface UpdateNameCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  isPending?: boolean;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
}

export function UpdateNameCard({
  className,
  classNames,
  isPending,
  localization,
}: UpdateNameCardProps) {
  const {
    hooks: { useSession },
    localization: authLocalization,
    nameRequired,
  } = useContext(AuthUIContext);
  localization = { ...authLocalization, ...localization };

  const { data: sessionData } = useSession();

  return (
    <UpdateFieldCard
      className={className}
      classNames={classNames}
      defaultValue={sessionData?.user.name}
      description={localization.nameDescription}
      field="name"
      instructions={localization.nameInstructions}
      isPending={isPending}
      label={localization.name}
      localization={localization}
      placeholder={localization.namePlaceholder}
      required={nameRequired}
    />
  );
}
