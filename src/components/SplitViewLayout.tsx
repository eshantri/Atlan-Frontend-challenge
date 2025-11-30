import { type FC } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { SplitViewTabSelector } from './SplitViewTabSelector'
import { QueryPanelContent } from './QueryPanelContent'
import type { QueryTab } from './QueryTabList'

interface SplitViewLayoutProps {
  splitTabs: [string, string]
  tabs: QueryTab[]
  onSplitTabChange: (index: 0 | 1, tabId: string) => void
  onActivePanelChange: (index: 0 | 1) => void
  onQueryChange: (tabId: string, query: string, markAsUnsaved?: boolean) => void
  onRunQuery: () => void
  onSaveQuery: (name: string, description?: string) => void
}

export const SplitViewLayout: FC<SplitViewLayoutProps> = ({
  splitTabs,
  tabs,
  onSplitTabChange,
  onActivePanelChange,
  onQueryChange,
  onRunQuery,
  onSaveQuery,
}) => {
  return (
    <PanelGroup direction="horizontal" className="flex-1">
      {/* Left Panel */}
      <Panel defaultSize={50} minSize={40}>
        <div className="h-full flex flex-col border-r border-border" onClick={() => onActivePanelChange(0)}>
          <SplitViewTabSelector
            value={splitTabs[0]}
            onChange={(value) => onSplitTabChange(0, value)}
            tabs={tabs}
          />
          {(() => {
            const tab = tabs.find((t) => t.id === splitTabs[0])
            if (!tab) return null
            return (
              <QueryPanelContent
                query={tab.query}
                isLoading={tab.isLoading}
                error={tab.error}
                results={tab.results}
                onQueryChange={(query, markAsUnsaved) => onQueryChange(tab.id, query, markAsUnsaved)}
                onRunQuery={onRunQuery}
                onSaveQuery={onSaveQuery}
              />
            )
          })()}
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

      {/* Right Panel */}
      <Panel defaultSize={50} minSize={40}>
        <div className="h-full flex flex-col" onClick={() => onActivePanelChange(1)}>
          <SplitViewTabSelector
            value={splitTabs[1]}
            onChange={(value) => onSplitTabChange(1, value)}
            tabs={tabs}
          />
          {(() => {
            const tab = tabs.find((t) => t.id === splitTabs[1])
            if (!tab) return null
            return (
              <QueryPanelContent
                query={tab.query}
                isLoading={tab.isLoading}
                error={tab.error}
                results={tab.results}
                onQueryChange={(query, markAsUnsaved) => onQueryChange(tab.id, query, markAsUnsaved)}
                onRunQuery={onRunQuery}
                onSaveQuery={onSaveQuery}
              />
            )
          })()}
        </div>
      </Panel>
    </PanelGroup>
  )
}

