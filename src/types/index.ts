export interface QueryResult {
  columns: string[]
  rows: Record<string, string | number>[]
  rowCount: number
  executionTime: number
  totalRows?: number // Total rows in database (if limited)
  isLimited?: boolean // Whether results were limited
  limitApplied?: number // The limit that was applied
}

export interface SavedQuery {
  id: string
  name: string
  query: string
  description?: string
}

export interface DatabaseTable {
  id: string
  name: string
  rowCount: number
  columns: number
  database?: string // Database this table belongs to
}

export interface Database {
  id: string
  name: string
  tables: DatabaseTable[]
}

export interface QueryHistoryItem {
  id: string
  query: string
  timestamp: Date
  executionTime: number
  rowCount: number
  status: 'success' | 'error'
  errorMessage?: string
}

