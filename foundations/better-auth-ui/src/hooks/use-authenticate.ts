import { useContext, useEffect } from "react"
import { AuthUIContext } from "../lib/auth-ui-provider"
import type { AuthView } from "../server"
import type { AuthClient } from "../types/auth-client"

export function useAuthenticate<TAuthClient extends AuthClient = AuthClient>(
    authView: AuthView = "signIn",
    enabled = true
) {
    const { hooks, basePath, viewPaths, replace } = useContext(AuthUIContext)
    const { useSession } = hooks
    const { data, isPending, ...rest } = useSession()

    useEffect(() => {
        if (enabled && !isPending && !data) {
            replace(
                `${basePath}/${viewPaths[authView]}?redirectTo=${window.location.href.replace(window.location.origin, "")}`
            )
        }
    }, [enabled, isPending, data, basePath, viewPaths, replace, authView])

    type SessionData = TAuthClient["$Infer"]["Session"]
    type User = TAuthClient["$Infer"]["Session"]["user"]
    type Session = TAuthClient["$Infer"]["Session"]["session"]

    const sessionData = data as SessionData | undefined
    const user = sessionData?.user as User | undefined
    const session = sessionData?.session as Session | undefined

    return {
        data: sessionData,
        isPending,
        ...rest,
        user,
        session
    }
}
