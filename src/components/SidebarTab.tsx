import { type FC, type ReactNode } from 'react'
import { TabsTrigger } from './ui/tabs'
import { formatCompactNumber } from '@/lib/utils'

interface SidebarTabProps {
  value: string
  label?: string
  icon?: ReactNode
  count?: number
}

export const SidebarTab: FC<SidebarTabProps> = ({ value, label, icon, count }) => {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-accent data-[state=active]:shadow-sm"
    >
      <span className="flex items-center justify-center gap-2 text-xs font-medium">
        {icon && <span className="flex items-center">{icon}</span>}
        {label && <span>{label}</span>}
        {count !== undefined && count > 0 && (
          <span className="flex items-center justify-center h-5 min-w-[22px] px-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            {formatCompactNumber(count)}
          </span>
        )}
      </span>
    </TabsTrigger>
  )
}

