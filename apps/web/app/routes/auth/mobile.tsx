import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { createServerFn } from '@tanstack/start'
import { getCookie, setCookie } from 'vinxi/http'
import { z } from 'zod'

const searchSchema = z.object({
  'expo-redirect': z.string(),
})

export const Route = createFileRoute('/auth/mobile')({
  validateSearch: zodSearchValidator(searchSchema),
  async beforeLoad({ search }) {
    const expoRedirect = search['expo-redirect']
    const { authSession } = await getAuthState()
    if (expoRedirect) {
      throw redirect({
        href: `${expoRedirect}?auth_session=${authSession}`,
        // params: {
        //   // @ts-expect-error
        //   auth_session: authSession,
        // },
      })
    }

    throw redirect({
      to: '/login',
      headers: {
        'Set-Cookie': `expo-redirect=${expoRedirect}; Path=/;`,
      },
    })
  },
})

export const getAuthState = createServerFn('GET', (_, { request }) => {
  const session = getCookie('auth_session')
  if (session)
    return {
      authSession: session,
    }

  return {
    authSession: null,
  }

  // throw redirect({
  //   to: '/login',
  //   headers: {
  //     'Set-Cookie': `expo-redirect=${expoRedirect}; Path=/;`,
  //   },
  //   code: 301,
  // })
})
