import api from '@/trpc/server'
import { trpc } from '@/trpc/react'
import {
  createFileRoute,
  Link,
  Navigate,
  redirect,
} from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { z } from 'zod'
import { useEffect } from 'react'

const providerSchema = z.object({
  code: z.string(),
})

export const Route = createFileRoute('/auth/callback/$provider')({
  validateSearch: zodSearchValidator(providerSchema),
  component: Provider,
})

function Provider() {
  const { code } = Route.useSearch()
  const { trpcQueryUtils } = Route.useRouteContext()

  const { mutate, error, isPending, isSuccess, isError } =
    trpc.auth.verifyAuth.useMutation({
      onSuccess: () => {
        trpcQueryUtils.user.whoAmI.reset()
      },
    })

  useEffect(() => {
    mutate({ code })
  }, [])

  if (isPending) {
    return <div>loading...</div>
  }
  if (isSuccess) return <Navigate to="/" />
  console.log({ error })
  if (isError)
    return (
      <div>
        Could not sign you in, please <Link to="/login">retry</Link>
      </div>
    )
}
