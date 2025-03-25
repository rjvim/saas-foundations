import { multiSessionClient, passkeyClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type AuthClient = Omit<ReturnType<typeof createAuthClient>, "signUp">

const passkeyAuthClient = createAuthClient({ plugins: [passkeyClient()] })
export type PasskeyAuthClient = typeof passkeyAuthClient

const multiSessionAuthClient = createAuthClient({
    plugins: [multiSessionClient()]
})
export type MultiSessionAuthClient = typeof multiSessionAuthClient
