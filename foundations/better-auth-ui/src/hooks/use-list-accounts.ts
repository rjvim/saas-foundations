import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function useListAccounts() {
    const { authClient } = useContext(AuthUIContext)
    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    const [data, setData] = useState<{ accountId: string; provider: string }[] | null>(null)
    const [isPending, setIsPending] = useState(true)
    const initialized = useRef(false)

    const refetch = useCallback(async () => {
        const { data, error } = await authClient.listAccounts()

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
