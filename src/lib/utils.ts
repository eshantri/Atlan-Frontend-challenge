import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number to a compact string representation
 * @param num - The number to format
 * @returns Formatted string (e.g., 1k, 1.1k, 1M, 1.1M+)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  }
  
  if (num < 1000000) {
    // Thousands: 1k, 1.1k, etc.
    const thousands = num / 1000
    return thousands % 1 === 0 
      ? `${Math.floor(thousands)}k` 
      : `${thousands.toFixed(1)}k`
  }
  
  // Millions: 1M+, 1.1M+, etc.
  const millions = num / 1000000
  return millions % 1 === 0 
    ? `${Math.floor(millions)}M+` 
    : `${millions.toFixed(1)}M+`
}

