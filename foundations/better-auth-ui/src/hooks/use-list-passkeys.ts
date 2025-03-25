import { useContext } from "react"

import { AuthUIContext } from "../lib/auth-ui-provider"
import type { PasskeyAuthClient } from "../types/auth-client"

export function useListPasskeys() {
    const { authClient } = useContext(AuthUIContext)
    return (authClient as PasskeyAuthClient).useListPasskeys()
}
