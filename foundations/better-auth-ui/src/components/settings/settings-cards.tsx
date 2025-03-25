"use client";

import { useContext } from "react";

import { useAuthenticate } from "../../hooks/use-authenticate";
import type { AuthLocalization } from "@foundations/better-auth-ui/lib/auth-localization";
import { AuthUIContext } from "@foundations/better-auth-ui/lib/auth-ui-provider";
import { cn } from "@foundations/shadcn/lib/utils";

import type { Session, User } from "better-auth";
import type { Passkey } from "better-auth/plugins/passkey";
import { KeyIcon, UserIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@foundations/shadcn/components/tabs";
import { AccountsCard } from "./accounts-card";
import { ChangeEmailCard } from "./change-email-card";
import { ChangePasswordCard } from "./change-password-card";
import { DeleteAccountCard } from "./delete-account-card";
import { PasskeysCard } from "./passkeys-card";
import { ProvidersCard } from "./providers-card";
import { SessionsCard } from "./sessions-card";
import type { SettingsCardClassNames } from "./settings-card";
import { UpdateAvatarCard } from "./update-avatar-card";
import { UpdateFieldCard } from "./update-field-card";
import { UpdateNameCard } from "./update-name-card";
import { UpdateUsernameCard } from "./update-username-card";

export type SettingsCardsClassNames = {
  base?: string;
  card?: SettingsCardClassNames;
  tabs?: {
    base?: string;
    list?: string;
    trigger?: string;
    content?: string;
  };
};

export interface SettingsCardsProps {
  className?: string;
  classNames?: SettingsCardsClassNames;
  /**
   * @default authLocalization
   * @remarks `AuthLocalization`
   */
  localization?: AuthLocalization;
}

export function SettingsCards({
  className,
  classNames,
  localization,
}: SettingsCardsProps) {
  const {
    additionalFields,
    avatar,
    credentials,
    deleteUser,
    hooks,
    localization: authLocalization,
    multiSession,
    nameRequired,
    passkey,
    providers,
    settingsFields,
    username,
  } = useContext(AuthUIContext);
  localization = { ...authLocalization, ...localization };
  const {
    useListAccounts,
    useListDeviceSessions,
    useListPasskeys,
    useListSessions,
    useSession,
  } = hooks;
  useAuthenticate();
  const { data: sessionData, isPending: sessionPending } = useSession();
  const {
    data: accounts,
    isPending: accountsPending,
    refetch: refetchAccounts,
  } = useListAccounts();
  const {
    data: sessions,
    isPending: sessionsPending,
    refetch: refetchSessions,
  } = useListSessions();

  let passkeys: Passkey[] | undefined = undefined;
  let passkeysPending: boolean | undefined = undefined;
  let refetchPasskeys: (() => void) | undefined = undefined;

  if (passkey) {
    const result = useListPasskeys();
    passkeys = result.data as Passkey[];
    passkeysPending = result.isPending;
    refetchPasskeys = result.refetch;
  }

  let deviceSessions: { user: User; session: Session }[] | undefined =
    undefined;
  let deviceSessionsPending: boolean | undefined = undefined;
  let refetchDeviceSessions: (() => void) | undefined = undefined;

  if (multiSession) {
    const result = useListDeviceSessions();
    deviceSessions = result.data as { user: User; session: Session }[];
    deviceSessionsPending = result.isPending;
    refetchDeviceSessions = result.refetch;
  }

  const isPending =
    sessionPending ||
    accountsPending ||
    sessionsPending ||
    passkeysPending ||
    deviceSessionsPending;

  return (
    <div
      className={cn(
        "flex w-full max-w-xl grow flex-col items-center gap-4",
        className,
        classNames?.base
      )}
    >
      <Tabs
        defaultValue="account"
        className={cn("flex w-full flex-col gap-4", classNames?.tabs?.base)}
      >
        <TabsList
          className={cn("grid w-full grid-cols-2", classNames?.tabs?.list)}
        >
          <TabsTrigger value="account" className={classNames?.tabs?.trigger}>
            <UserIcon />
            {localization.account}
          </TabsTrigger>

          <TabsTrigger value="security" className={classNames?.tabs?.trigger}>
            <KeyIcon />
            {localization.security}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="account"
          className={cn("flex flex-col gap-4", classNames?.tabs?.content)}
        >
          {avatar && (
            <UpdateAvatarCard
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
            />
          )}

          {username && (
            <UpdateUsernameCard
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
            />
          )}

          {(settingsFields?.includes("name") || nameRequired) && (
            <UpdateNameCard
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
            />
          )}

          <ChangeEmailCard
            classNames={classNames?.card}
            isPending={isPending}
            localization={localization}
          />

          {settingsFields?.map((field) => {
            const additionalField = additionalFields?.[field];
            if (!additionalField) return null;

            const {
              label,
              description,
              instructions,
              placeholder,
              required,
              type,
              validate,
            } = additionalField;

            // @ts-expect-error Custom fields are not typed
            const defaultValue = sessionData?.user[field] as unknown;

            return (
              <UpdateFieldCard
                key={field}
                classNames={classNames?.card}
                defaultValue={defaultValue}
                description={description}
                field={field}
                instructions={instructions}
                isPending={isPending}
                label={label}
                localization={localization}
                placeholder={placeholder}
                required={required}
                type={type}
                validate={validate}
              />
            );
          })}

          {multiSession && (
            <AccountsCard
              classNames={classNames?.card}
              deviceSessions={deviceSessions}
              isPending={isPending}
              localization={localization}
              refetch={refetchDeviceSessions}
              skipHook
            />
          )}
        </TabsContent>

        <TabsContent
          value="security"
          className={cn("flex flex-col gap-4", classNames?.tabs?.content)}
        >
          {credentials && (
            <ChangePasswordCard
              accounts={accounts}
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
              skipHook
            />
          )}

          {providers?.length && (
            <ProvidersCard
              accounts={accounts}
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
              refetch={refetchAccounts}
              skipHook
            />
          )}

          {passkey && (
            <PasskeysCard
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
              passkeys={passkeys}
              refetch={refetchPasskeys}
              skipHook
            />
          )}

          <SessionsCard
            classNames={classNames?.card}
            isPending={isPending}
            localization={localization}
            sessions={sessions}
            refetch={refetchSessions}
            skipHook
          />

          {deleteUser && (
            <DeleteAccountCard
              accounts={accounts}
              classNames={classNames?.card}
              isPending={isPending}
              localization={localization}
              skipHook
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
