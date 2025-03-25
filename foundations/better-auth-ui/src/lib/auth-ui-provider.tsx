"use client"
import type React from "react"
import { type ReactNode, createContext } from "react"

import { useListAccounts } from "../hooks/use-list-accounts"
import { useListDeviceSessions } from "../hooks/use-list-device-sessions"
import { useListSessions } from "../hooks/use-list-sessions"
import { useSession } from "../hooks/use-session"

import { useListPasskeys } from "../hooks/use-list-passkeys"
import type { AuthClient, MultiSessionAuthClient, PasskeyAuthClient } from "../types/auth-client"
import { type AuthLocalization, authLocalization } from "./auth-localization"
import { type AuthViewPaths, authViewPaths } from "./auth-view-paths"
import type { SocialProvider } from "./social-providers"

const DefaultLink = ({
    href,
    className,
    children
}: {
    href: string
    className?: string
    children: ReactNode
}) => (
    <a className={className} href={href}>
        {children}
    </a>
)

const defaultNavigate = (href: string) => {
    window.location.href = href
}

const defaultReplace = (href: string) => {
    window.location.replace(href)
}

export type Link = React.ComponentType<{
    href: string
    to: unknown
    className?: string
    children: ReactNode
}>

export type FieldType = "string" | "number" | "boolean"

export interface AdditionalField {
    description?: ReactNode
    instructions?: ReactNode
    label: ReactNode
    placeholder?: string
    required?: boolean
    type: FieldType
    validate?: (value: string) => Promise<boolean>
}

export interface AdditionalFields {
    [key: string]: AdditionalField
}

const defaultHooks = {
    useSession,
    useListAccounts,
    useListDeviceSessions,
    useListSessions,
    useListPasskeys,
    useIsRestoring: () => false
}

type DefaultMutates = {
    updateUser: AuthClient["updateUser"]
    unlinkAccount: AuthClient["unlinkAccount"]
    deletePasskey: PasskeyAuthClient["passkey"]["deletePasskey"]
    revokeSession: AuthClient["revokeSession"]
    setActiveSession: MultiSessionAuthClient["multiSession"]["setActive"]
    revokeDeviceSession: MultiSessionAuthClient["multiSession"]["revoke"]
}

export type AuthUIContextType = {
    authClient: AuthClient
    /**
     * Additional fields for users
     */
    additionalFields?: AdditionalFields
    /**
     * Enable or disable avatar support
     * @default false
     */
    avatar?: boolean
    /**
     * File extension for avatar uploads
     * @default "png"
     */
    avatarExtension: string
    /**
     * Avatars are resized to 128px unless uploadAvatar is provided, then 256px
     * @default 128 | 256
     */
    avatarSize: number
    /**
     * Base path for the auth views
     * @default "/auth"
     */
    basePath: string
    /**
     * Force color icons for both light and dark themes
     * @default false
     */
    colorIcons?: boolean
    /**
     * Enable or disable credentials support
     * @default true
     */
    credentials?: boolean
    /**
     * Default redirect path after sign in
     * @default "/"
     */
    defaultRedirectTo: string
    /**
     * Enable or disable email verification for account deletion
     * @default false
     */
    deleteAccountVerification?: boolean
    /**
     * Enable or disable user account deletion
     * @default false
     */
    deleteUser?: boolean
    /**
     * Show verify email card for unverified emails
     */
    emailVerification?: boolean
    /**
     * Enable or disable forgot password support
     * @default false
     */
    forgotPassword?: boolean
    /**
     * Freshness age for session data
     * @default 60 * 60 * 24
     */
    freshAge: number
    /**
     * @internal
     */
    hooks: typeof defaultHooks
    localization: AuthLocalization
    /**
     * Enable or disable magic link support
     * @default false
     */
    magicLink?: boolean
    /**
     * Enable or disable multi-session support
     * @default false
     */
    multiSession?: boolean
    /** @internal */
    mutates: DefaultMutates
    /**
     * Enable or disable name requirement for sign up
     * @default true
     */
    nameRequired?: boolean
    /**
     * Force black & white icons for both light and dark themes
     * @default false
     */
    noColorIcons?: boolean
    /**
     * Perform some user updates optimistically
     * @default false
     */
    optimistic?: boolean
    /**
     * Enable or disable passkey support
     * @default false
     */
    passkey?: boolean
    /**
     * Enable or disable persisting the client with better-auth-tanstack
     * @default false
     */
    persistClient?: boolean
    /**
     * Array of social providers to enable
     * @remarks `SocialProvider[]`
     */
    providers?: SocialProvider[]
    /**
     * Enable or disable remember me support
     * @default false
     */
    rememberMe?: boolean
    /**
     * Array of fields to show in `<SettingsCards />`
     * @default ["name"]
     */
    settingsFields?: string[]
    /**
     * Custom settings URL
     */
    settingsUrl?: string
    /**
     * Enable or disable sign up support
     * @default true
     */
    signUp?: boolean
    /**
     * Array of fields to show in Sign Up form
     * @default ["name"]
     */
    signUpFields?: string[]
    /**
     * Enable or disable username support
     * @default false
     */
    username?: boolean
    viewPaths: AuthViewPaths
    /**
     * Navigate to a new URL
     * @default window.location.href
     */
    navigate: typeof defaultNavigate
    /**
     * Called whenever the session changes
     */
    onSessionChange?: () => void | Promise<void>
    /**
     * Replace the current URL
     * @default navigate
     */
    replace: typeof defaultReplace
    /**
     * Upload an avatar image and return the URL string
     * @remarks `(file: File) => Promise<string>`
     */
    uploadAvatar?: (file: File) => Promise<string | undefined | null>
    /**
     * Custom link component for navigation
     * @default <a>
     */
    LinkComponent: Link
}

export type AuthUIProviderProps = {
    /**
     * Your better-auth createAuthClient
     * @default Required
     * @remarks `AuthClient`
     */
    authClient: AuthClient
    /**
     * Customize the paths for the auth views
     * @default authViewPaths
     * @remarks `AuthViewPaths`
     */
    viewPaths?: Partial<AuthViewPaths>
    /**
     * Customize the localization strings
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /** @internal */
    mutates?: DefaultMutates
} & Partial<Omit<AuthUIContextType, "viewPaths" | "localization" | "mutates">>

export const AuthUIContext = createContext<AuthUIContextType>({} as unknown as AuthUIContextType)

export const AuthUIProvider = ({
    children,
    authClient,
    avatarExtension = "png",
    avatarSize,
    basePath = "/auth",
    defaultRedirectTo = "/",
    credentials = true,
    forgotPassword = true,
    freshAge = 60 * 60 * 24,
    hooks = defaultHooks,
    mutates,
    localization,
    nameRequired = true,
    settingsFields = ["name"],
    signUp = true,
    signUpFields = ["name"],
    viewPaths,
    navigate,
    replace,
    uploadAvatar,
    LinkComponent = DefaultLink,
    ...props
}: {
    children: ReactNode
} & AuthUIProviderProps) => {
    replace = replace || navigate || defaultReplace
    navigate = navigate || defaultNavigate

    mutates = mutates || {
        updateUser: authClient.updateUser,
        deletePasskey: (authClient as PasskeyAuthClient).passkey.deletePasskey,
        unlinkAccount: authClient.unlinkAccount,
        revokeSession: authClient.revokeSession,
        setActiveSession: (authClient as MultiSessionAuthClient).multiSession.setActive,
        revokeDeviceSession: (authClient as MultiSessionAuthClient).multiSession.revoke
    }

    avatarSize = uploadAvatar ? 256 : 128

    return (
        <AuthUIContext.Provider
            value={{
                authClient,
                avatarExtension,
                avatarSize,
                basePath: basePath === "/" ? "" : basePath,
                defaultRedirectTo,
                credentials,
                forgotPassword,
                freshAge,
                hooks,
                mutates,
                localization: { ...authLocalization, ...localization },
                nameRequired,
                settingsFields,
                signUp,
                signUpFields,
                navigate,
                replace,
                viewPaths: { ...authViewPaths, ...viewPaths },
                uploadAvatar,
                LinkComponent,
                ...props
            }}
        >
            {children}
        </AuthUIContext.Provider>
    )
}
