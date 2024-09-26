import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import { NotFound } from '@/components/NotFound'
import { trpcQueryUtils } from '@/router'
// @ts-expect-error
import appCss from '@/styles/app.css?url'
import { seo } from '@/utils/seo'
import { useSession, useSignOut } from '@/context/auth/session-provider'
import { QueryClient } from '@tanstack/react-query'

export interface RouterAppContext {
  queryClient: QueryClient
  trpcQueryUtils: typeof trpcQueryUtils
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    ...seo({
      title:
        'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
      description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
    }),
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
    { rel: 'icon', href: '/favicon.ico' },
  ],
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  /* loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.user.whoAmI.ensureData().catch((e) => console.log(e))
    return
  }, */
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { data, isAuthenticated } = useSession()
  const { mutate } = useSignOut()
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <div className="p-2 flex justify-between text-lg">
          <div className="flex gap-2">
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{' '}
            <Link
              // @ts-expect-error
              to="/this-route-does-not-exist"
              activeProps={{
                className: 'font-bold',
              }}
            >
              This Route Does Not Exist
            </Link>
          </div>
          {isAuthenticated ? (
            <div className="flex gap-2">
              <button onClick={() => mutate()}>Signout</button>
              <p>
                {data.user.firstName} {data.user.lastName}
              </p>
            </div>
          ) : (
            <Link to="/login">Signin</Link>
          )}
        </div>
        <hr />
        {children}
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <Scripts />
      </Body>
    </Html>
  )
}
