"use client"

import { type ReactNode, useContext } from "react"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function SignedIn({ children }: { children: ReactNode }) {
    const { hooks } = useContext(AuthUIContext)
    const { useSession } = hooks
    const { data } = useSession()

    if (!data) return null

    return <>{children}</>
}
