import { useAuthenticate } from "../hooks/use-authenticate"

export function RedirectToSignIn() {
    useAuthenticate("signIn")
    return null
}
