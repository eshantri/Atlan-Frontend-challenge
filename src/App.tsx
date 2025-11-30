import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useHotkeys } from 'react-hotkeys-hook'
import { mockQueries, mockDatabases, executeQuery } from './data/mockData'
import type { QueryHistoryItem, SavedQuery } from './types'
import { getSavedQueries, saveQuery as saveQueryToStorage } from './utils/localStorage'
import { getQueryExecutionDelay } from './config/constants'
import AppSidebar from './components/AppSidebar'
import { HeaderBar } from './components/HeaderBar'
import { type QueryTab } from './components/QueryTabList'
import { SplitViewLayout } from './components/SplitViewLayout'
import { NormalTabView } from './components/NormalTabView'

// Lazy load dialog components (only loaded when opened)
const KeyboardShortcutsHelp = lazy(() => import('./components/KeyboardShortcutsHelp'))

function App() {
  const [tabs, setTabs] = useState<QueryTab[]>([
    {
      id: '1',
      title: 'Query 1',
      query: mockQueries[0].query,
      results: null,
      hasUnsavedChanges: false,
      isLoading: false,
      error: null,
    },
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([])
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [splitTabs, setSplitTabs] = useState<[string, string] | null>(null)
  const [activeSplitPanel, setActiveSplitPanel] = useState<0 | 1>(0) // Track which split panel is active
  const [userSavedQueries, setUserSavedQueries] = useState<SavedQuery[]>([])

  // Load saved queries from localStorage on mount
  useEffect(() => {
    const saved = getSavedQueries()
    setUserSavedQueries(
      saved.map((q) => ({
        id: q.id,
        name: q.name,
        query: q.query,
        description: q.description,
      }))
    )
  }, [])

  // Toggle split view
  const toggleSplitView = () => {
    if (!splitView && tabs.length >= 2) {
      setSplitTabs([tabs[0].id, tabs[1].id])
      setSplitView(true)
    } else {
      setSplitView(false)
      setSplitTabs(null)
    }
  }

  // Keyboard Shortcuts
  useHotkeys('mod+enter', (e) => {
    e.preventDefault()
    handleRunQuery()
  }, { enableOnFormTags: ['textarea'] })

  useHotkeys('alt+n', (e) => {
    e.preventDefault()
    handleAddTab()
  })

  useHotkeys('alt+w', (e) => {
    e.preventDefault()
    if (tabs.length > 1) {
      handleCloseTab(activeTabId)
    }
  })

  useHotkeys('mod+shift+]', (e) => {
    e.preventDefault()
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId)
    const nextIndex = (currentIndex + 1) % tabs.length
    setActiveTabId(tabs[nextIndex].id)
  })

  useHotkeys('mod+shift+[', (e) => {
    e.preventDefault()
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId)
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
    setActiveTabId(tabs[prevIndex].id)
  })

  useHotkeys('mod+/', (e) => {
    e.preventDefault()
    setShowKeyboardHelp(true)
  })

  const handleAddTab = useCallback(() => {
    const newId = Date.now().toString()
    const newTab: QueryTab = {
      id: newId,
      title: `Query ${tabs.length + 1}`,
      query: '',
      results: null,
      hasUnsavedChanges: false,
      isLoading: false,
      error: null,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newId)
  }, [tabs.length])

  const handleCloseTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== tabId)
        if (tabId === activeTabId && newTabs.length > 0) {
          setActiveTabId(newTabs[newTabs.length - 1].id)
        }
        return newTabs
      })
    },
    [activeTabId]
  )

  const handleRunQuery = useCallback(async () => {
    // Determine which tab to run the query on
    let targetTabId = activeTabId
    if (splitView && splitTabs) {
      targetTabId = splitTabs[activeSplitPanel]
    }

    const targetTab = tabs.find((tab) => tab.id === targetTabId)
    if (!targetTab) return

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === targetTabId ? { ...tab, isLoading: true, error: null } : tab
      )
    )

    try {
      await new Promise((resolve) => setTimeout(resolve, getQueryExecutionDelay()))
      const result = executeQuery(targetTab.query)

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === targetTabId
            ? { ...tab, results: result, hasUnsavedChanges: false, isLoading: false, error: null }
            : tab
        )
      )

      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: targetTab.query,
        timestamp: new Date(),
        executionTime: result.executionTime,
        rowCount: result.rowCount,
        status: 'success',
      }

      setQueryHistory((prev) => [historyItem, ...prev].slice(0, 100))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === targetTabId ? { ...tab, isLoading: false, error: errorMessage } : tab
        )
      )

      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: targetTab.query,
        timestamp: new Date(),
        executionTime: 0,
        rowCount: 0,
        status: 'error',
        errorMessage,
      }

      setQueryHistory((prev) => [historyItem, ...prev].slice(0, 100))
    }
  }, [activeTabId, tabs, splitView, splitTabs, activeSplitPanel])

  const handleQueryChange = useCallback(
    (query: string, markAsUnsaved: boolean = true) => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTabId ? { ...tab, query, hasUnsavedChanges: markAsUnsaved } : tab))
      )
    },
    [activeTabId]
  )

  const handleSelectQuery = useCallback(
    (query: string) => {
      if (splitView && splitTabs) {
        // In split view, update the active split panel's tab
        const targetTabId = splitTabs[activeSplitPanel]
        setTabs((prev) =>
          prev.map((tab) => (tab.id === targetTabId ? { ...tab, query, hasUnsavedChanges: false } : tab))
        )
      } else {
        // In normal view, update the active tab
        setTabs((prev) =>
          prev.map((tab) => (tab.id === activeTabId ? { ...tab, query, hasUnsavedChanges: false } : tab))
        )
      }
      setIsMobileSidebarOpen(false)
    },
    [activeTabId, splitView, splitTabs, activeSplitPanel]
  )

  const handleSelectTable = useCallback(
    (tableName: string) => {
      const query = `SELECT * FROM ${tableName};`
      if (splitView && splitTabs) {
        // In split view, update the active split panel's tab
        const targetTabId = splitTabs[activeSplitPanel]
        setTabs((prev) =>
          prev.map((tab) => (tab.id === targetTabId ? { ...tab, query, hasUnsavedChanges: false } : tab))
        )
      } else {
        // In normal view, update the active tab
        setTabs((prev) =>
          prev.map((tab) => (tab.id === activeTabId ? { ...tab, query, hasUnsavedChanges: false } : tab))
        )
      }
      setIsMobileSidebarOpen(false)
    },
    [activeTabId, splitView, splitTabs, activeSplitPanel]
  )

  const handleSaveQuery = useCallback(
    (name: string, description?: string) => {
      // Determine which tab to save the query from
      let targetTabId = activeTabId
      if (splitView && splitTabs) {
        targetTabId = splitTabs[activeSplitPanel]
      }

      const targetTab = tabs.find((tab) => tab.id === targetTabId)
      if (!targetTab?.query.trim()) return

      try {
        const savedQuery = saveQueryToStorage(targetTab.query, name, description)

        setUserSavedQueries((prev) => [
          {
            id: savedQuery.id,
            name: savedQuery.name,
            query: savedQuery.query,
            description: savedQuery.description,
          },
          ...prev,
        ])

        setTabs((prev) =>
          prev.map((tab) => (tab.id === targetTabId ? { ...tab, hasUnsavedChanges: false } : tab))
        )
      } catch (error) {
        console.error('Failed to save query:', error)
      }
    },
    [activeTabId, tabs, splitView, splitTabs, activeSplitPanel]
  )

  const allQueries = [...userSavedQueries, ...mockQueries]

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <HeaderBar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        queries={allQueries}
        databases={mockDatabases}
        queryHistory={queryHistory}
        onSelectQuery={handleSelectQuery}
        onSelectTable={handleSelectTable}
        splitView={splitView}
        tabsLength={tabs.length}
        onToggleSplitView={toggleSplitView}
        onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
      />

      <Suspense fallback={null}>
        <KeyboardShortcutsHelp open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp} />
      </Suspense>

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={20} minSize={18} maxSize={40} className="hidden lg:block">
          <AppSidebar
            queries={allQueries}
            databases={mockDatabases}
            history={queryHistory}
            onSelectQuery={handleSelectQuery}
            onSelectTable={handleSelectTable}
          />
        </Panel>

        <PanelResizeHandle className="hidden lg:block w-1 bg-border hover:bg-primary transition-colors" />

        <Panel defaultSize={80} minSize={50}>
          <main className="h-full overflow-hidden">
            <div className="h-full flex flex-col">
              {splitView && splitTabs ? (
                <SplitViewLayout
                  splitTabs={splitTabs}
                  tabs={tabs}
                  onSplitTabChange={(index, tabId) => {
                    setSplitTabs(index === 0 ? [tabId, splitTabs[1]] : [splitTabs[0], tabId])
                  }}
                  onActivePanelChange={setActiveSplitPanel}
                  onQueryChange={(tabId, query, markAsUnsaved = true) => {
                    setTabs((prev) =>
                      prev.map((t) => (t.id === tabId ? { ...t, query, hasUnsavedChanges: markAsUnsaved } : t))
                    )
                  }}
                  onRunQuery={handleRunQuery}
                  onSaveQuery={handleSaveQuery}
                />
              ) : (
                <NormalTabView
                  activeTabId={activeTabId}
                  tabs={tabs}
                  onTabChange={setActiveTabId}
                  onAddTab={handleAddTab}
                  onCloseTab={handleCloseTab}
                  onQueryChange={handleQueryChange}
                  onRunQuery={handleRunQuery}
                  onSaveQuery={handleSaveQuery}
                />
              )}
            </div>
          </main>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default App
