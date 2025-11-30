import { type FC } from 'react'
import { ChevronDownIcon } from './icons'

interface SplitViewTabSelectorProps {
  value: string
  onChange: (value: string) => void
  tabs: Array<{ id: string; title: string }>
}

export const SplitViewTabSelector: FC<SplitViewTabSelectorProps> = ({ value, onChange, tabs }) => {
  return (
    <div className="border-b border-border bg-card px-4 py-2">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-10 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.title}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="text-muted-foreground w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

