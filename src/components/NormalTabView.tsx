import { type FC } from 'react'
import { Tabs, TabsContent } from './ui/tabs'
import { QueryTabList, type QueryTab } from './QueryTabList'
import { QueryPanelContent } from './QueryPanelContent'

interface NormalTabViewProps {
  activeTabId: string
  tabs: QueryTab[]
  onTabChange: (tabId: string) => void
  onAddTab: () => void
  onCloseTab: (tabId: string) => void
  onQueryChange: (query: string, markAsUnsaved?: boolean) => void
  onRunQuery: () => void
  onSaveQuery: (name: string, description?: string) => void
}

export const NormalTabView: FC<NormalTabViewProps> = ({
  activeTabId,
  tabs,
  onTabChange,
  onAddTab,
  onCloseTab,
  onQueryChange,
  onRunQuery,
  onSaveQuery,
}) => {
  return (
    <Tabs value={activeTabId} onValueChange={onTabChange} className="flex-1 flex flex-col">
      <QueryTabList tabs={tabs} onAddTab={onAddTab} onCloseTab={onCloseTab} />

      <div className="flex-1 overflow-hidden">
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 h-full data-[state=active]:flex">
            <QueryPanelContent
              query={tab.query}
              isLoading={tab.isLoading}
              error={tab.error}
              results={tab.results}
              onQueryChange={onQueryChange}
              onRunQuery={onRunQuery}
              onSaveQuery={onSaveQuery}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

