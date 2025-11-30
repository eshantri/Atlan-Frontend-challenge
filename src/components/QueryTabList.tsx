import { type FC } from 'react'
import { Button } from './ui/button'
import { TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { PlusIcon, CloseIcon } from './icons'

export interface QueryTab {
  id: string
  title: string
  query: string
  results: any | null
  hasUnsavedChanges: boolean
  isLoading: boolean
  error: string | null
}

interface QueryTabListProps {
  tabs: QueryTab[]
  onAddTab: () => void
  onCloseTab: (tabId: string) => void
}

export const QueryTabList: FC<QueryTabListProps> = ({ tabs, onAddTab, onCloseTab }) => {
  return (
    <div className="border-b border-border bg-card px-4 pt-4">
      <div className="flex items-center gap-2">
        <TabsList className="h-auto p-0 bg-transparent gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative rounded-t-md rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent/50 data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/20 px-4 py-2.5 group transition-all"
            >
              <span className="flex items-center gap-2">
                {tab.title}
                {tab.hasUnsavedChanges && (
                  <Badge variant="secondary" className="h-1.5 w-1.5 p-0 rounded-full" />
                )}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseTab(tab.id)
                    }}
                    className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-accent rounded p-0.5 transition-opacity"
                  >
                    <CloseIcon />
                  </button>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Add Tab Button */}
        <Button variant="ghost" size="sm" onClick={onAddTab} className="h-8 w-8 p-0">
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}

