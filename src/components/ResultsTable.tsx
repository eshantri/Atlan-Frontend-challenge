import { type FC, useState, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import type { QueryResult } from '../types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  DownloadIcon,
  ColumnsIcon,
  FileIcon,
  FileJsonIcon,
  CopyIcon,
  CheckIcon,
  WarningTriangleIcon,
  InfoCircleIcon,
  ChevronUpIcon,
} from './icons'
import Papa from 'papaparse'
import { useVirtualizer } from '@tanstack/react-virtual'

interface ResultsTableProps {
  results: QueryResult
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 500]

const ResultsTable: FC<ResultsTableProps> = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const tableBodyRef = useRef<HTMLTableSectionElement>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    const newHidden = new Set(hiddenColumns)
    if (newHidden.has(column)) {
      newHidden.delete(column)
    } else {
      newHidden.add(column)
    }
    setHiddenColumns(newHidden)
  }

  // Visible columns
  const visibleColumns = results.columns.filter(col => !hiddenColumns.has(col))

  // Export functions
  const exportToCSV = () => {
    const csv = Papa.unparse({
      fields: results.columns,
      data: results.rows.map(row => results.columns.map(col => row[col]))
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `query_results_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(results.rows, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `query_results_${Date.now()}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = () => {
    const csv = Papa.unparse({
      fields: results.columns,
      data: results.rows.map(row => results.columns.map(col => row[col]))
    })

    navigator.clipboard.writeText(csv).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard!')
    })
  }

  // Get filtered and sorted rows
  const processedRows = useMemo(() => {
    let filtered = [...results.rows]

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(row =>
          String(row[column] || '').toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        // Handle numbers
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }

        // Handle strings
        const aStr = String(aVal || '')
        const bStr = String(bVal || '')
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      })
    }

    return filtered
  }, [results.rows, columnFilters, sortColumn, sortDirection])

  // Get paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return processedRows.slice(startIndex, endIndex)
  }, [processedRows, currentPage, pageSize])

  // Update total pages based on filtered results
  const filteredTotalPages = Math.ceil(processedRows.length / pageSize)

  // Use virtualization for large page sizes
  const useVirtualization = paginatedRows.length > 100

  // Virtualizer for table rows
  const rowVirtualizer = useVirtualizer({
    count: paginatedRows.length,
    getScrollElement: () => tableBodyRef.current?.parentElement as HTMLElement,
    estimateSize: () => 45,
    overscan: 10,
    enabled: useVirtualization
  })

  // Reset to page 1 when page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5
    const totalPagesToUse = filteredTotalPages

    if (totalPagesToUse <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPagesToUse; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPagesToUse - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPagesToUse - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      pages.push(totalPagesToUse)
    }

    return pages
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Query Results</h2>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <DownloadIcon />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                  <FileIcon />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON} className="gap-2">
                  <FileJsonIcon />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard} className="gap-2">
                  <CopyIcon />
                  Copy to Clipboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <ColumnsIcon />
                  Columns
                  {hiddenColumns.size > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {visibleColumns.length}/{results.columns.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {results.columns.map((column) => (
                  <DropdownMenuItem
                    key={column}
                    onClick={() => toggleColumnVisibility(column)}
                    className="justify-between"
                  >
                    <span className="truncate">{column}</span>
                    {!hiddenColumns.has(column) && (
                      <CheckIcon />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-muted-foreground">
              {results.rowCount.toLocaleString()} rows • {results.executionTime}ms
            </div>
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <div className="flex gap-1">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    variant={pageSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageSizeChange(size)}
                    className="h-8 px-3"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner for Limited Results */}
      {results.isLimited && results.totalRows && (
        <div className="p-4 border-b border-border">
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <WarningTriangleIcon width={20} height={20} />
            <AlertDescription className="text-amber-200">
              <strong>Results limited:</strong> Showing {results.limitApplied?.toLocaleString()} of {results.totalRows.toLocaleString()} total rows.
              {' '}Add a LIMIT clause to your query to fetch more specific results or increase the default limit.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Warning for Large Datasets */}
      {!results.isLimited && results.rowCount > 500 && (
        <div className="p-4 border-b border-border">
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <InfoCircleIcon width={20} height={20} />
            <AlertDescription className="text-blue-200">
              <strong>Large dataset:</strong> This query returned {results.rowCount.toLocaleString()} rows.
              {' '}Consider adding filters or a LIMIT clause for better performance.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto" style={{ maxHeight: useVirtualization ? '600px' : '800px' }}>
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            {/* Column Headers with Sorting */}
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column} className="bg-card">
                  <button
                    onClick={() => handleSort(column)}
                    className="flex items-center gap-2 uppercase font-semibold hover:text-primary transition-colors w-full"
                  >
                    {column}
                    {sortColumn === column && (
                      <span className={clsx('inline-block', sortDirection === 'desc' && 'rotate-180')}>
                        <ChevronUpIcon width={14} height={14} />
                      </span>
                    )}
                  </button>
                </TableHead>
              ))}
            </TableRow>
            {/* Column Filters */}
            <TableRow className="bg-card">
              {visibleColumns.map((column) => (
                <TableHead key={`filter-${column}`} className="py-2 bg-card">
                  <input
                    type="text"
                    placeholder={`Filter ${column}...`}
                    value={columnFilters[column] || ''}
                    onChange={(e) => {
                      setColumnFilters(prev => ({
                        ...prev,
                        [column]: e.target.value
                      }))
                      setCurrentPage(1) // Reset to first page on filter
                    }}
                    className="w-full px-2 py-1 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {paginatedRows.length > 0 ? (
              useVirtualization ? (
                <>
                  {/* Virtual spacer for scroll position */}
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <TableRow style={{ height: `${rowVirtualizer.getVirtualItems()[0]?.start || 0}px` }}>
                      <TableCell colSpan={visibleColumns.length} style={{ padding: 0, border: 0 }} />
                    </TableRow>
                  )}

                  {/* Virtual rows */}
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = paginatedRows[virtualRow.index]
                    return (
                      <TableRow key={virtualRow.index} data-index={virtualRow.index}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column}>{row[column]}</TableCell>
                        ))}
                      </TableRow>
                    )
                  })}

                  {/* Bottom spacer */}
                  {rowVirtualizer.getVirtualItems().length > 0 && (
                    <TableRow style={{
                      height: `${rowVirtualizer.getTotalSize() - (rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.end || 0)}px`
                    }}>
                      <TableCell colSpan={visibleColumns.length} style={{ padding: 0, border: 0 }} />
                    </TableRow>
                  )}
                </>
              ) : (
                paginatedRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-muted-foreground">
                  {Object.values(columnFilters).some(v => v) ? 'No matching results found' : 'No results found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {filteredTotalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedRows.length)} of {processedRows.length.toLocaleString()} rows
            {processedRows.length < results.rowCount && (
              <span className="text-muted-foreground/70"> (filtered from {results.rowCount.toLocaleString()})</span>
            )}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={clsx(currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
                />
              </PaginationItem>

              {getPageNumbers().map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(filteredTotalPages, p + 1))}
                  className={clsx(currentPage === filteredTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default ResultsTable

