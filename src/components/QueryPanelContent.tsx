import { type FC, lazy, Suspense } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import QueryEditor from './QueryEditor'
import { ErrorAlert } from './ErrorAlert'
import { TableSkeleton } from './TableSkeleton'
import type { QueryResult } from '@/types'

// Lazy load ResultsTable (heavy component with papaparse and virtualizer)
const ResultsTable = lazy(() => import('./ResultsTable'))

interface QueryPanelContentProps {
  query: string
  isLoading: boolean
  error: string | null
  results: QueryResult | null
  onQueryChange: (query: string, markAsUnsaved?: boolean) => void
  onRunQuery: () => void
  onSaveQuery: (name: string, description?: string) => void
}

export const QueryPanelContent: FC<QueryPanelContentProps> = ({
  query,
  isLoading,
  error,
  results,
  onQueryChange,
  onRunQuery,
  onSaveQuery,
}) => {
  return (
    <PanelGroup direction="vertical" className="flex-1">
      {/* Query Editor Panel */}
      <Panel defaultSize={30} minSize={20} maxSize={60}>
        <div className="h-full px-4 pt-4 overflow-auto min-w-0">
          <QueryEditor
            query={query}
            onQueryChange={onQueryChange}
            onRunQuery={onRunQuery}
            onSaveQuery={onSaveQuery}
            isLoading={isLoading}
          />
        </div>
      </Panel>

      {/* Results Panel */}
      {(results || isLoading || error) && (
        <>
          <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors my-2" />
          <Panel defaultSize={70} minSize={40}>
            <div className="h-full px-4 pb-4 overflow-auto">
              {error && !isLoading && <ErrorAlert error={error} />}
              {isLoading && <TableSkeleton />}
              {results && !isLoading && !error && (
                <Suspense fallback={<TableSkeleton />}>
                  <ResultsTable results={results} />
                </Suspense>
              )}
            </div>
          </Panel>
        </>
      )}
    </PanelGroup>
  )
}

