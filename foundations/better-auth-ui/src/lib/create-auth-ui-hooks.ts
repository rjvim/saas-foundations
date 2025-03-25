import { useAuthenticate } from "../hooks/use-authenticate"
import type { AuthClient } from "../types/auth-client"
import type { AuthView } from "./auth-view-paths"

export function createAuthUIHooks<TAuthClient extends AuthClient>(_: TAuthClient) {
    return {
        useAuthenticate: (authView: AuthView = "signIn", enabled = true) => {
            return useAuthenticate<TAuthClient>(authView, enabled)
        }
    }
}
