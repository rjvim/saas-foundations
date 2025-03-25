import type { Session, User } from "better-auth"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function useListDeviceSessions() {
    const { authClient } = useContext(AuthUIContext)
    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    const [data, setData] = useState<{ session: Session; user: User }[] | null>(null)
    const [isPending, setIsPending] = useState(true)
    const initialized = useRef(false)

    const refetch = useCallback(async () => {
        const { data, error } =
            // @ts-expect-error Optional plugin
            await authClient.multiSession.listDeviceSessions()

        if (error) toast.error(error.message || error.statusText)

        setData(data)
        setIsPending(false)
    }, [authClient])

    useEffect(() => {
        if (!sessionData) {
            if (!sessionPending) setIsPending(false)

            return
        }

        if (initialized.current) return

        initialized.current = true
        refetch()
    }, [refetch, sessionData, sessionPending])

    return {
        data,
        isPending,
        refetch
    }
}
