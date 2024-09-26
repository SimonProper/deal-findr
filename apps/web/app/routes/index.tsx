import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { trpc } from '@/trpc/react'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.products.getProduct.ensureData()
    return
  },
})

function Home() {
  const { data, isSuccess, isLoading } = trpc.products.getProduct.useQuery()

  console.log({ data, isSuccess, isLoading })
  return (
    <div className="flex flex-col">
      {isLoading && <p>laddar...</p>}
      {isSuccess && <p>{data.msg}</p>}
      <Link to="/posts">To posts</Link>
    </div>
  )
}
