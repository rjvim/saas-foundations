import type { Session } from "better-auth/types"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AuthUIContext } from "../lib/auth-ui-provider"

export function useListSessions() {
    const { authClient } = useContext(AuthUIContext)
    const { data: sessionData } = authClient.useSession()

    const [data, setData] = useState<Session[] | null>(null)
    const [isPending, setIsPending] = useState(true)
    const initialized = useRef(false)

    const refetch = useCallback(async () => {
        const { data, error } = await authClient.listSessions()

        if (error) toast.error(error.message || error.statusText)

        setData(data)
        setIsPending(false)
    }, [authClient])

    useEffect(() => {
        if (!sessionData) return

        if (initialized.current) return

        initialized.current = true
        refetch()
    }, [refetch, sessionData])

    return {
        data,
        isPending,
        refetch
    }
}
