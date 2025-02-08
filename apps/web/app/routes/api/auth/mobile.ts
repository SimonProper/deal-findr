import { redirect } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getCookie, getRequestURL } from 'vinxi/http'
import { z } from 'zod'

const paramsSchema = z.object({
  'expo-redirect': z.string(),
})

export const Route = createAPIFileRoute('/api/auth/mobile')({
  GET: ({ request }) => {
    const url = new URL(request.url)
    const expoRedirect = url.searchParams.get('expo-redirect')
    if (!expoRedirect) throw new Error('aj')
    const session = getCookie('auth_session')
    if (session)
      throw redirect({
        to: expoRedirect,
        params: {
          // @ts-expect-error
          auth_session: session,
        },
      })

    throw redirect({
      to: '/login',
      headers: {
        'Set-Cookie': `expo-redirect=${expoRedirect}; Path=/;`,
      },
    })
  },
})
