import type { TODataParams } from './odata'

/**
 * Converts OData parameters to a query string.
 *
 * @param {TODataParams} [params] - The OData parameters to be converted.
 * @returns {string} The query string representation of the OData parameters.
 */
export function buildODataParams(params?: TODataParams): string {
  return buildParams(params as unknown as Record<string, string | number | undefined>)
}

/**
 * Converts a record of key-value pairs into a query string.
 *
 * @param {Record<string, string | number | undefined>} [params] - The parameters to be converted.
 * @returns {string} The query string representation of the parameters.
 */
export function buildParams(params?: Record<string, string | number | undefined>): string {
  if (!params) {
    return ''
  }
  const parts: string[] = []
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      parts.push(
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        val !== '' ? `${key}=${encodeURIComponent(val)}` : encodeURIComponent(key)
      )
    }
  }
  return `?${parts.join('&')}`
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined

  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, wait) as unknown as number
  }
}

/**
 * Splits an array into smaller chunks of a specified size.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to be chunked.
 * @param {number} size - The maximum size of each chunk.
 * @returns {T[][]} - An array of chunked arrays.
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Joins multiple path segments into a single path.
 * @param  {...string} segments - The path segments to join.
 * @returns {string} The joined path.
 */
export function joinPath(...segments: string[]): string {
  return segments
    .map((segment, index) => {
      if (index === 0) {
        return segment.trim().replace(/[/\\]+$/, '')
      } else {
        return segment.trim().replace(/^[/\\]+|[/\\]+$/g, '')
      }
    })
    .filter(segment => segment.length > 0)
    .join('/')
}
