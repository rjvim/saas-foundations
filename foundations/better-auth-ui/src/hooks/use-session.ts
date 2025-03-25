import { useContext } from "react"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function useSession() {
    const { authClient } = useContext(AuthUIContext)
    return authClient.useSession()
}
