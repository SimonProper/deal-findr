import { useSession } from '@/context/auth/session-provider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  component: Wrapper,
})

function Wrapper() {
  const { isAuthenticated, status } = useSession()
  if (status === 'loading') return <div>loading session</div>
  if (!isAuthenticated) return <div>not authed</div>

  return <Outlet />
}
