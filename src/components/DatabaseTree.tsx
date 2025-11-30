import { type FC, useState } from 'react'
import { clsx } from 'clsx'
import { DatabaseIcon, TableIcon, ChevronDownIcon } from './icons'
import type { Database } from '@/types'

interface DatabaseTreeProps {
  databases: Database[]
  onSelectTable: (tableName: string) => void
}

export const DatabaseTree: FC<DatabaseTreeProps> = ({ databases, onSelectTable }) => {
  const [expandedDbs, setExpandedDbs] = useState<Set<string>>(new Set(['db1'])) // Expand first DB by default

  const toggleDatabase = (dbId: string) => {
    setExpandedDbs((prev) => {
      const next = new Set(prev)
      if (next.has(dbId)) {
        next.delete(dbId)
      } else {
        next.add(dbId)
      }
      return next
    })
  }

  return (
    <div className="space-y-1">
      {databases.map((db) => {
        const isExpanded = expandedDbs.has(db.id)
        return (
          <div key={db.id} className="select-none">
            {/* Database Header */}
            <button
              onClick={() => toggleDatabase(db.id)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left group min-w-0"
            >
              <ChevronDownIcon
                className={clsx(
                  'flex-shrink-0 w-4 h-4 text-muted-foreground transition-transform',
                  isExpanded ? 'rotate-0' : '-rotate-90'
                )}
              />
              <DatabaseIcon className="flex-shrink-0 w-4 h-4 text-primary" />
              <span className="font-medium text-sm truncate">{db.name}</span>
              <span className="flex-shrink-0 ml-auto text-xs text-muted-foreground whitespace-nowrap">
                {db.tables.length} {db.tables.length === 1 ? 'table' : 'tables'}
              </span>
            </button>

            {/* Tables List */}
            {isExpanded && (
              <div className="ml-6 mt-1 space-y-0.5">
                {db.tables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => onSelectTable(table.name)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left group min-w-0"
                  >
                    <TableIcon className="flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="text-sm font-mono truncate min-w-0 flex-1">{table.name}</span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {table.rowCount.toLocaleString()} rows
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

