import { type FC } from 'react'
import type { QueryHistoryItem } from '../types'
import { Badge } from '@/components/ui/badge'

interface QueryHistoryProps {
  history: QueryHistoryItem[]
  onSelectQuery: (query: string) => void
}

const QueryHistory: FC<QueryHistoryProps> = ({ history, onSelectQuery }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()
    
    if (isYesterday) {
      return 'Yesterday'
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Group history by date
  const groupedHistory = history.reduce((acc, item) => {
    const dateKey = item.timestamp.toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(item)
    return acc
  }, {} as Record<string, QueryHistoryItem[]>)

  return (
    <div className="space-y-4">
      {Object.keys(groupedHistory).length > 0 ? (
        Object.entries(groupedHistory).map(([dateKey, items]) => (
          <div key={dateKey}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {formatDate(new Date(dateKey))}
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectQuery(item.query)}
                  className="w-full text-left p-2.5 rounded-md border border-border hover:border-primary hover:bg-accent transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono text-foreground line-clamp-2 break-all">
                        {item.query}
                      </code>
                    </div>
                    <Badge 
                      variant={item.status === 'success' ? 'default' : 'destructive'}
                      className="flex-shrink-0"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatTime(item.timestamp)}</span>
                    {item.status === 'success' && (
                      <>
                        <span>•</span>
                        <span>{item.rowCount.toLocaleString()} rows</span>
                        <span>•</span>
                        <span>{item.executionTime}ms</span>
                      </>
                    )}
                    {item.status === 'error' && item.errorMessage && (
                      <>
                        <span>•</span>
                        <span className="text-destructive line-clamp-1">{item.errorMessage}</span>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No query history yet. Run a query to get started.
        </div>
      )}
    </div>
  )
}

export default QueryHistory

