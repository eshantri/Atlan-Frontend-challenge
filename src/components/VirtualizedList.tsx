import { type FC, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  estimateSize?: number
  overscan?: number
}

function VirtualizedList<T>({ 
  items, 
  renderItem, 
  estimateSize = 80,
  overscan = 5
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan
  })

  return (
    <div
      ref={parentRef}
      style={{
        height: '100%',
        overflow: 'auto'
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualizedList as FC<VirtualizedListProps<any>>

