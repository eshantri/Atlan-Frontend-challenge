import { type FC, useState, useMemo, useRef } from 'react'
import type { SavedQuery, Database, QueryHistoryItem } from '../types'
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import QueryHistory from './QueryHistory'
import { DatabaseTree } from './DatabaseTree'
import { SidebarTab } from './SidebarTab'
import { HistoryIcon } from './icons'
import { useVirtualizer } from '@tanstack/react-virtual'

interface AppSidebarProps {
  queries: SavedQuery[]
  databases: Database[]
  history: QueryHistoryItem[]
  onSelectQuery: (query: string) => void
  onSelectTable: (tableName: string) => void
}

const AppSidebar: FC<AppSidebarProps> = ({ 
  queries, 
  databases,
  history,
  onSelectQuery, 
  onSelectTable 
}) => {
  const [activeTab, setActiveTab] = useState<string>('databases')
  const [querySearch, setQuerySearch] = useState('')
  const [databaseSearch, setDatabaseSearch] = useState('')
  
  const queryListRef = useRef<HTMLDivElement>(null)

  // Filter queries based on search
  const filteredQueries = useMemo(() => {
    if (!querySearch.trim()) return queries
    const searchLower = querySearch.toLowerCase()
    return queries.filter(query => 
      query.name.toLowerCase().includes(searchLower) ||
      query.description?.toLowerCase().includes(searchLower) ||
      query.query.toLowerCase().includes(searchLower)
    )
  }, [queries, querySearch])

  // Filter databases and tables based on search
  const filteredDatabases = useMemo(() => {
    if (!databaseSearch.trim()) return databases
    const searchLower = databaseSearch.toLowerCase()
    return databases.map(db => ({
      ...db,
      tables: db.tables.filter(table => 
        table.name.toLowerCase().includes(searchLower) ||
        db.name.toLowerCase().includes(searchLower)
      )
    })).filter(db => db.tables.length > 0)
  }, [databases, databaseSearch])

  // Virtualizer for queries list
  const queryVirtualizer = useVirtualizer({
    count: filteredQueries.length,
    getScrollElement: () => queryListRef.current,
    estimateSize: () => 90,
    overscan: 5
  })

  const useVirtualization = filteredQueries.length > 50

  return (
    <Sidebar>
      <SidebarHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="inline-flex w-auto gap-2 bg-transparent p-1">
            <SidebarTab value="databases" label="Databases" count={databases.length* 233} />
            <SidebarTab value="queries" label="Queries" count={queries.length * 1897683} />
            <SidebarTab value="history" icon={<HistoryIcon />} count={history.length} />
          </TabsList>
        </Tabs>
      </SidebarHeader>

      <SidebarContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="databases" className="mt-0 flex flex-col h-full">
            {/* Search Input */}
            <div className="flex-shrink-0 pb-2">
              <Input
                type="text"
                placeholder="Search databases & tables..."
                value={databaseSearch}
                onChange={(e) => setDatabaseSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Database Tree */}
            <div className="flex-1 overflow-auto">
              {filteredDatabases.length > 0 ? (
                <DatabaseTree databases={filteredDatabases} onSelectTable={onSelectTable} />
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {databaseSearch ? 'No databases or tables found' : 'No databases available'}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="queries" className="mt-0 flex flex-col h-full">
            {/* Search Input */}
            <div className="flex-shrink-0 pb-2">
              <Input
                type="text"
                placeholder="Search queries..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Query List */}
            {filteredQueries.length > 0 ? (
              useVirtualization && filteredQueries.length > 50 ? (
                <div ref={queryListRef} className="flex-1 overflow-auto">
                  <div
                    style={{
                      height: `${queryVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    {queryVirtualizer.getVirtualItems().map((virtualItem) => {
                      const savedQuery = filteredQueries[virtualItem.index]
                      return (
                        <div
                          key={virtualItem.key}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualItem.start}px)`,
                            padding: '0 0 8px 0'
                          }}
                        >
                          <button
                            onClick={() => onSelectQuery(savedQuery.query)}
                            className="w-full text-left p-2.5 rounded-md border border-border hover:border-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <div className="font-medium text-sm">{savedQuery.name}</div>
                            {savedQuery.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {savedQuery.description}
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-auto space-y-2">
                  {filteredQueries.map((savedQuery) => (
                    <button
                      key={savedQuery.id}
                      onClick={() => onSelectQuery(savedQuery.query)}
                      className="w-full text-left p-2.5 rounded-md border border-border hover:border-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="font-medium text-sm">{savedQuery.name}</div>
                      {savedQuery.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {savedQuery.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {querySearch ? 'No queries found' : 'No saved queries'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <QueryHistory history={history} onSelectQuery={onSelectQuery} />
          </TabsContent>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar





