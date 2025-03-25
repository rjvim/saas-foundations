"use client"

import { type ReactNode, useContext } from "react"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function AuthLoading({ children }: { children: ReactNode }) {
    const { hooks } = useContext(AuthUIContext)
    const { useSession } = hooks
    const { isPending } = useSession()

    if (!isPending) return null

    return <>{children}</>
}
