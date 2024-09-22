'use client'

import { useState } from 'react'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@deal-findr/backend/src/trpc'

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry(failureCount, error) {
          if (isTRPCClientError(error))
            if (error.data?.code === 'UNAUTHORIZED') return false
          if (failureCount < 2) return true
          return false
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (isTRPCClientError(error)) {
          if (error.data?.code === 'UNAUTHORIZED') {
            console.log('should redirect to signin?')
          }
        }
      },
    }),
  })

let clientQueryClientSingleton: QueryClient | undefined = undefined
export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }

  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const trpc = createTRPCReact<AppRouter>()
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: 'http://localhost:4000/trpc',
      // You can pass any HTTP headers you wish here
      async headers() {
        const headers = new Headers()
        headers.set('x-trpc-source', 'nextjs-react')
        return headers
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    /* unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          async headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }), */
  ],
})

/* export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
} */

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
