import { type FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DownloadIcon, ColumnsIcon } from './icons'

export const TableSkeleton: FC = () => {
  const skeletonColumns = 5
  const skeletonRows = 10

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            
            {/* Disabled Export Button */}
            <Button variant="outline" size="sm" className="h-8 gap-2" disabled>
              <DownloadIcon />
              Export
            </Button>

            {/* Disabled Columns Button */}
            <Button variant="outline" size="sm" className="h-8 gap-2" disabled>
              <ColumnsIcon />
              Columns
            </Button>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-1">
                {[10, 25, 50, 100, 500].map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    disabled
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto" style={{ maxHeight: '800px' }}>
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              {Array.from({ length: skeletonColumns }).map((_, idx) => (
                <TableHead key={idx} className="bg-card">
                  <Skeleton className="h-5 w-20" />
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="bg-card">
              {Array.from({ length: skeletonColumns }).map((_, idx) => (
                <TableHead key={idx} className="py-2 bg-card">
                  <Skeleton className="h-8 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: skeletonColumns }).map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Skeleton */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
    </div>
  )
}

