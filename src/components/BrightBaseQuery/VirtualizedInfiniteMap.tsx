import { ReactNode, useMemo } from 'react'
import { UseSuspenseVirtualizerInfiniteQueryReturn } from '../../hooks/BrightBaseQuery/useSuspenseVirtualizerInfiniteQuery'
import { cn } from 'brightside-developer'

interface VirtualizedInfiniteMapProps<T extends { [key: string]: unknown }> {
  className: string
  children: (item: T) => ReactNode
  loadingComponent?: JSX.Element
}

export default function VirtualizedInfiniteMap<T extends { [key: string]: unknown }>({
  className,
  items,
  onScroll,
  scrollRef,
  vItems,
  virtualizer,
  queryRest: { isFetching },
  loadingComponent,
  children,
}: UseSuspenseVirtualizerInfiniteQueryReturn<T> & VirtualizedInfiniteMapProps<T>) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className={useMemo(() => cn('flex flex-col w-full min-h-20 overflow-y-auto', className), [className])}
    >
      <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${vItems[0]?.start ?? 0}px)`,
          }}
        >
          {vItems.map((vRow) => {
            const item = items[vRow.index]
            return (
              <div key={vRow.key} data-index={vRow.index} ref={virtualizer.measureElement}>
                {children(item)}
              </div>
            )
          })}
        </div>
      </div>
      {isFetching && loadingComponent}
    </div>
  )
}
