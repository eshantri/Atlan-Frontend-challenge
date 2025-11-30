import { type FC } from 'react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { MenuIcon, SplitViewIcon, KeyboardIcon, XIcon } from './icons'
import AppSidebar from './AppSidebar'
import type { SavedQuery, Database, QueryHistoryItem } from '@/types'

interface HeaderBarProps {
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (open: boolean) => void
  queries: SavedQuery[]
  databases: Database[]
  queryHistory: QueryHistoryItem[]
  onSelectQuery: (query: string) => void
  onSelectTable: (tableName: string) => void
  splitView: boolean
  tabsLength: number
  onToggleSplitView: () => void
  onShowKeyboardHelp: () => void
}

export const HeaderBar: FC<HeaderBarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  queries,
  databases,
  queryHistory,
  onSelectQuery,
  onSelectTable,
  splitView,
  tabsLength,
  onToggleSplitView,
  onShowKeyboardHelp,
}) => {
  return (
    <header className="flex-shrink-0 border-b border-border bg-card">
      <div className="flex items-center px-4 py-4 gap-3">
        {/* Mobile menu button */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <AppSidebar
              queries={queries}
              databases={databases}
              history={queryHistory}
              onSelectQuery={onSelectQuery}
              onSelectTable={onSelectTable}
            />
          </SheetContent>
        </Sheet>

        <h1 className="text-2xl font-bold">SQL Query Runner</h1>

        <div className="ml-auto hidden lg:flex items-center gap-2">
          {/* Split View Toggle */}
          {tabsLength >= 2 && (
            <Button
              variant={splitView ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleSplitView}
              className="flex items-center gap-2"
            >
              {splitView ? <XIcon /> : <SplitViewIcon />}
              <span className="text-xs">{splitView ? 'Close Split' : 'Split View'}</span>
            </Button>
          )}

          {/* Keyboard Shortcuts Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowKeyboardHelp}
            className="flex items-center gap-2"
          >
            <KeyboardIcon />
            <span className="text-xs">Shortcuts</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

