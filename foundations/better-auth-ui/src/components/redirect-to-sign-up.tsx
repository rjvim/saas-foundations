import { useAuthenticate } from "../hooks/use-authenticate"

export function RedirectToSignUp() {
    useAuthenticate("signUp")
    return null
}
