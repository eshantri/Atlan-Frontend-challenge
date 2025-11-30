/**
 * Application configuration constants
 */

/**
 * Query execution delay configuration (in milliseconds)
 * This simulates the time taken to execute a query
 * 
 * Adjust this value to increase/decrease the loading time
 * - Min: 300ms (minimum delay)
 * - Random: 0-500ms (additional random delay)
 * - Total: 300-800ms by default
 */
export const QUERY_EXECUTION_CONFIG = {
  MIN_DELAY: 300,        // Minimum delay in ms
  MAX_RANDOM_DELAY: 500  // Maximum additional random delay in ms
}

/**
 * Get a randomized query execution delay
 * @returns Total delay in milliseconds (MIN_DELAY + random(0, MAX_RANDOM_DELAY))
 */
export function getQueryExecutionDelay(): number {
  return QUERY_EXECUTION_CONFIG.MIN_DELAY + Math.random() * QUERY_EXECUTION_CONFIG.MAX_RANDOM_DELAY
}

