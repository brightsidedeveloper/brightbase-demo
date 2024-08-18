import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import Tables, { TodosInfiniteReadOptions } from '../../api/Tables'
import { Loader2 } from 'lucide-react'
import useCreateInfiniteQuery from '../../hooks/BrightBaseQuery/useCreateInfiniteQuery'
import useSuspenseVirtualizerInfiniteQuery from '../../hooks/BrightBaseQuery/useSuspenseVirtualizerInfiniteQuery'
import VirtualizedInfiniteMap from '../../components/BrightBaseQuery/VirtualizedInfiniteMap'

export const Route = createLazyFileRoute('/(demos)/crud')({
  component: () => (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="size-14 animate-spin" />
        </div>
      }
    >
      <CRUD />
    </Suspense>
  ),
})

const ReadOptions: TodosInfiniteReadOptions = [
  {},
  {
    order: { by: 'created_at', ascending: false },
  },
]

function CRUD() {
  const query = useCreateInfiniteQuery(Tables.todos, 10, ReadOptions)

  const infiniteVirtualProps = useSuspenseVirtualizerInfiniteQuery(query)

  return (
    <div className="h-screen flex items-center justify-center ">
      <Link to="/" className="block p-2 bg-blue-500 text-white rounded fixed z-10 top-4 right-4 text-3xl">
        Back
      </Link>
      <div className="w-full max-w-lg">
        <VirtualizedInfiniteMap {...infiniteVirtualProps} className="gap-2 h-24">
          {({ id }) => <div>{id}</div>}
        </VirtualizedInfiniteMap>
      </div>
    </div>
  )
}
