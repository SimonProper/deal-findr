import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import { getQueryClient, trpc, trpcClient } from './trpc/react'
import { createTRPCQueryUtils } from '@trpc/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { SessionProvider } from './context/auth/session-provider'

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient: getQueryClient(),
  client: trpcClient,
})

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient: getQueryClient(),
      trpcQueryUtils,
    },
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    defaultPendingComponent: () => <div className={`p-2 text-2xl`}>laddar</div>,
    Wrap: function WrapComponent({ children }: { children: ReactNode }) {
      const queryClient = getQueryClient()
      return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>
        </trpc.Provider>
      )
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
