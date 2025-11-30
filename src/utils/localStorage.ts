/**
 * LocalStorage utility for managing saved queries
 */

export interface SavedQueryData {
  id: string
  name: string
  query: string
  description?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEYS = {
  SAVED_QUERIES: 'sql_runner_saved_queries',
  QUERY_HISTORY: 'sql_runner_query_history',
} as const

/**
 * Get all saved queries from localStorage
 */
export function getSavedQueries(): SavedQueryData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_QUERIES)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading saved queries from localStorage:', error)
    return []
  }
}

/**
 * Save a new query to localStorage
 */
export function saveQuery(query: string, name: string, description?: string): SavedQueryData {
  try {
    const queries = getSavedQueries()
    const now = new Date().toISOString()
    
    const newQuery: SavedQueryData = {
      id: `query_${Date.now()}`,
      name,
      query,
      description,
      createdAt: now,
      updatedAt: now,
    }
    
    queries.unshift(newQuery) // Add to beginning
    localStorage.setItem(STORAGE_KEYS.SAVED_QUERIES, JSON.stringify(queries))
    
    return newQuery
  } catch (error) {
    console.error('Error saving query to localStorage:', error)
    throw new Error('Failed to save query')
  }
}

/**
 * Update an existing saved query
 */
export function updateSavedQuery(
  id: string,
  updates: Partial<Pick<SavedQueryData, 'name' | 'query' | 'description'>>
): SavedQueryData | null {
  try {
    const queries = getSavedQueries()
    const index = queries.findIndex(q => q.id === id)
    
    if (index === -1) {
      throw new Error('Query not found')
    }
    
    queries[index] = {
      ...queries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    localStorage.setItem(STORAGE_KEYS.SAVED_QUERIES, JSON.stringify(queries))
    return queries[index]
  } catch (error) {
    console.error('Error updating saved query:', error)
    return null
  }
}

/**
 * Delete a saved query
 */
export function deleteSavedQuery(id: string): boolean {
  try {
    const queries = getSavedQueries()
    const filtered = queries.filter(q => q.id !== id)
    
    if (filtered.length === queries.length) {
      return false // Query not found
    }
    
    localStorage.setItem(STORAGE_KEYS.SAVED_QUERIES, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting saved query:', error)
    return false
  }
}

/**
 * Check if a query with the given name already exists
 */
export function queryNameExists(name: string, excludeId?: string): boolean {
  const queries = getSavedQueries()
  return queries.some(q => q.name === name && q.id !== excludeId)
}

/**
 * Clear all saved queries (useful for testing)
 */
export function clearSavedQueries(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_QUERIES)
  } catch (error) {
    console.error('Error clearing saved queries:', error)
  }
}

