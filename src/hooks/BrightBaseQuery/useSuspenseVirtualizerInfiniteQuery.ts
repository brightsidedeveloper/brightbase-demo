import { useVirtualizer } from '@tanstack/react-virtual'
import { useSuspenseInfiniteQuery } from 'brightside-developer'
import { useCallback, useMemo, useRef } from 'react'
import { UseBrightInfiniteQueryReturn } from './useCreateInfiniteQuery'

export default function useSuspenseVirtualizerInfiniteQuery<T extends { [key: string]: unknown }>(query: UseBrightInfiniteQueryReturn<T>) {
  const {
    data: { pages },
    fetchNextPage,
    ...queryRest
  } = useSuspenseInfiniteQuery(query)

  const items = useMemo(() => pages.flat(), [pages])

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    overscan: 5,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    horizontal: false,
  })

  const vItems = virtualizer.getVirtualItems()

  const onScroll = useCallback(() => {
    if (!scrollRef.current) return alert('Must put ref on scrollable element from useSuspenseVirtualizerInfiniteQuery')
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight + 100 >= scrollHeight && !queryRest.isFetching) fetchNextPage()
  }, [fetchNextPage, queryRest.isFetching])

  return useMemo(() => ({ scrollRef, virtualizer, items, vItems, onScroll, queryRest }), [virtualizer, items, vItems, onScroll, queryRest])
}

export type UseSuspenseVirtualizerInfiniteQueryReturn<T extends { [key: string]: unknown }> = ReturnType<
  typeof useSuspenseVirtualizerInfiniteQuery<T>
>
