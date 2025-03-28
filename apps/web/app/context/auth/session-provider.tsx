'use client'
import { trpc } from '@/trpc/react'
import type { RouterOutput } from '@/trpc/utils'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo } from 'react'

export type User = RouterOutput['user']['whoAmI']

type Session = {
  user: User
}

export function getSession() {
  return trpc.user.whoAmI.useQuery()
}

export function useSignOut() {
  const client = useQueryClient()
  const mutation = trpc.auth.signOut.useMutation({
    onSuccess() {
      // First want to reset the queries before clearing the cache. When
      // clearing, all subscribers are removed as well which causes the session
      // value to not update correctly
      client.resetQueries()
      client.clear()
    },
  })

  return mutation
}

export type SessionContextValue<R extends boolean = false> = R extends true
  ?
      | { data: Session; status: 'authenticated'; isAuthenticated: true }
      | { data: null; status: 'loading'; isAuthenticated: false }
      | { data: null; status: 'unauthenticated'; isAuthenticated: false }
  :
      | { data: Session; status: 'authenticated'; isAuthenticated: true }
      | {
          data: null
          status: 'unauthenticated' | 'loading'
          isAuthenticated: false
        }

export const SessionContext = createContext?.<SessionContextValue | undefined>(
  undefined,
)

export interface UseSessionOptions<R extends boolean> {
  required: R
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void
}

export function useSession<R extends boolean>(
  options?: UseSessionOptions<R>,
): SessionContextValue<R> {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }

  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('`useSession` must be wrapped in a <SessionProvider />')
  }

  const { required, onUnauthenticated } = options ?? {}

  const requiredAndNotLoading = required && value.status === 'unauthenticated'

  useEffect(() => {
    if (requiredAndNotLoading) {
      const url = `/signin?${new URLSearchParams({
        error: 'SessionRequired',
        callbackUrl: window.location.href,
      })}`
      if (onUnauthenticated) onUnauthenticated()
      else window.location.href = url
    }
  }, [requiredAndNotLoading, onUnauthenticated])

  if (requiredAndNotLoading) {
    return {
      data: value.data,
      status: 'loading',
      isAuthenticated: false,
    }
  }

  return value
}

export interface SessionProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function SessionProvider(props: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }

  const { children } = props

  const hasInitialSession = props.session !== undefined

  const { data: session, isPending } = getSession()

  const value = useMemo((): SessionContextValue => {
    /** If session was passed, initialize as not loading */
    const loading = hasInitialSession ? false : isPending

    const data = (session ? { user: session } : props.session) ?? null

    if (data)
      return {
        data,
        status: 'authenticated',
        isAuthenticated: true,
      }

    if (loading)
      return {
        data: null,
        status: 'loading',
        isAuthenticated: false,
      }

    return {
      data: null,
      status: 'unauthenticated',
      isAuthenticated: false,
    }
  }, [session, isPending])

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
