"use client"

import {
    ChevronsUpDown,
    LogInIcon,
    LogOutIcon,
    PlusCircleIcon,
    SettingsIcon,
    UserRoundPlus
} from "lucide-react"
import { Fragment, type ReactNode, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

import type { AuthLocalization } from "../lib/auth-localization"
import { AuthUIContext } from "../lib/auth-ui-provider"
import { cn } from "../lib/utils"
import type { User } from "../types/user"

import type { Session } from "better-auth"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"
import { UserAvatar, type UserAvatarClassNames } from "./user-avatar"

export interface UserButtonClassNames {
    base?: string
    skeleton?: string
    trigger?: {
        base?: string
        avatar?: UserAvatarClassNames
        skeleton?: string
    }
    content?: {
        base?: string
        avatar?: UserAvatarClassNames
        menuItem?: string
        separator?: string
    }
}

export interface UserButtonProps {
    className?: string
    classNames?: UserButtonClassNames
    additionalLinks?: {
        href: string
        icon?: ReactNode
        label: ReactNode
        signedIn?: boolean
    }[]
    disableDefaultLinks?: boolean
    /**
     * @default authLocalization
     * @remarks `AuthLocalization`
     */
    localization?: AuthLocalization
    /**
     * @default "icon"
     */
    size?: "icon" | "full"
}

type DeviceSession = {
    session: Session
    user: User
}

export function UserButton({
    className,
    classNames,
    additionalLinks,
    disableDefaultLinks,
    localization,
    size = "icon"
}: UserButtonProps) {
    const {
        basePath,
        hooks,
        mutates: { setActiveSession },
        localization: authLocalization,
        multiSession,
        settingsUrl,
        viewPaths,
        onSessionChange,
        LinkComponent
    } = useContext(AuthUIContext)
    const { useSession, useListDeviceSessions } = hooks

    localization = { ...authLocalization, ...localization }

    let deviceSessions: DeviceSession[] | null = null
    let deviceSessionsPending = false

    if (multiSession) {
        const { data, isPending } = useListDeviceSessions()
        deviceSessions = data
        deviceSessionsPending = isPending
    }

    const { data: sessionData, isPending: sessionPending } = useSession()
    const user = sessionData?.user as User
    const [activeSessionPending, setActiveSessionPending] = useState(false)

    const isPending =
        (sessionData && deviceSessionsPending) || sessionPending || activeSessionPending

    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => {
        if (!multiSession) return

        setActiveSessionPending(false)
    }, [sessionData])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild={size === "full"}
                className={cn(size === "icon" && "rounded-full", classNames?.trigger?.base)}
                disabled={isPending}
            >
                {size === "icon" ? (
                    isPending ? (
                        <Skeleton
                            className={cn(
                                "size-8 rounded-full",
                                className,
                                classNames?.base,
                                classNames?.skeleton,
                                classNames?.trigger?.skeleton
                            )}
                        />
                    ) : (
                        <UserAvatar
                            className={cn("size-8", className, classNames?.base)}
                            classNames={classNames?.trigger?.avatar}
                            user={user}
                        />
                    )
                ) : (
                    <Button className={cn("!px-3 h-12", className)} variant="outline">
                        <>
                            {isPending ? (
                                <Skeleton
                                    className={cn(
                                        "size-8 rounded-full",
                                        classNames?.skeleton,
                                        classNames?.trigger?.skeleton
                                    )}
                                />
                            ) : (
                                <UserAvatar classNames={classNames?.content?.avatar} user={user} />
                            )}

                            <div className="flex grow flex-col truncate text-left">
                                <div className="truncate font-medium text-sm">
                                    {isPending ? (
                                        <Skeleton
                                            className={cn("h-3 w-20", classNames?.skeleton)}
                                        />
                                    ) : (
                                        user?.name || user?.email || localization.account
                                    )}
                                </div>

                                {isPending ? (
                                    <Skeleton
                                        className={cn("mt-1 h-3 w-32", classNames?.skeleton)}
                                    />
                                ) : (
                                    user?.name && (
                                        <div className="!font-light truncate text-muted-foreground text-xs">
                                            {user?.email}
                                        </div>
                                    )
                                )}
                            </div>

                            <ChevronsUpDown className="ml-auto size-4" />
                        </>
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={cn(
                    "me-3 max-w-64",
                    size === "full" && "min-w-48",
                    classNames?.content?.base
                )}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {user && !user.isAnonymous ? (
                    <div className="flex items-center gap-2 p-2">
                        <UserAvatar classNames={classNames?.content?.avatar} user={user} />

                        <div className="flex flex-col truncate">
                            <div className="truncate font-medium text-sm">
                                {user.name || user.email}
                            </div>

                            {user.name && (
                                <div className="!font-light truncate text-muted-foreground text-xs">
                                    {user.email}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="!font-light px-2 py-1 text-muted-foreground text-xs">
                        {localization.account}
                    </div>
                )}

                <DropdownMenuSeparator className={classNames?.content?.separator} />

                {additionalLinks?.map(
                    ({ href, icon, label, signedIn }) =>
                        (!signedIn || !!sessionData) && (
                            <LinkComponent href={href} to={href} key={href}>
                                <DropdownMenuItem className={classNames?.content?.menuItem}>
                                    {icon}

                                    {label}
                                </DropdownMenuItem>
                            </LinkComponent>
                        )
                )}

                {!user || user.isAnonymous ? (
                    <>
                        <LinkComponent
                            href={`${basePath}/${viewPaths.signIn}`}
                            to={`${basePath}/${viewPaths.signIn}`}
                        >
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <LogInIcon />

                                {localization.signIn}
                            </DropdownMenuItem>
                        </LinkComponent>

                        <LinkComponent
                            href={`${basePath}/${viewPaths.signUp}`}
                            to={`${basePath}/${viewPaths.signUp}`}
                        >
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <UserRoundPlus />

                                {localization.signUp}
                            </DropdownMenuItem>
                        </LinkComponent>
                    </>
                ) : (
                    <>
                        {!disableDefaultLinks && (
                            <LinkComponent
                                href={settingsUrl || `${basePath}/${viewPaths.settings}`}
                                to={settingsUrl || `${basePath}/${viewPaths.settings}`}
                            >
                                <DropdownMenuItem className={classNames?.content?.menuItem}>
                                    <SettingsIcon />

                                    {localization.settings}
                                </DropdownMenuItem>
                            </LinkComponent>
                        )}

                        <LinkComponent
                            href={`${basePath}/${viewPaths.signOut}`}
                            to={`${basePath}/${viewPaths.signOut}`}
                        >
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <LogOutIcon />

                                {localization.signOut}
                            </DropdownMenuItem>
                        </LinkComponent>
                    </>
                )}

                {user && multiSession && (
                    <>
                        <DropdownMenuSeparator className={classNames?.content?.separator} />

                        {deviceSessions
                            ?.filter((sessionData) => sessionData.user.id !== user?.id)
                            .map(({ session, user }) => (
                                <Fragment key={session.id}>
                                    <DropdownMenuItem
                                        className={classNames?.content?.menuItem}
                                        onClick={async () => {
                                            setActiveSessionPending(true)
                                            const { error } = await setActiveSession({
                                                sessionToken: session.token
                                            })
                                            if (error) {
                                                toast.error(error.message || error.statusText)
                                            } else {
                                                onSessionChange?.()
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <UserAvatar
                                                classNames={classNames?.content?.avatar}
                                                user={user}
                                            />

                                            <div className="flex flex-col truncate">
                                                <div className="truncate font-medium text-sm">
                                                    {user.name || user.email}
                                                </div>

                                                {user.name && (
                                                    <div className="!font-light truncate text-muted-foreground text-xs">
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator
                                        className={classNames?.content?.separator}
                                    />
                                </Fragment>
                            ))}

                        <LinkComponent
                            href={`${basePath}/${viewPaths.signIn}`}
                            to={`${basePath}/${viewPaths.signIn}`}
                        >
                            <DropdownMenuItem className={classNames?.content?.menuItem}>
                                <PlusCircleIcon />

                                {localization.addAccount}
                            </DropdownMenuItem>
                        </LinkComponent>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
