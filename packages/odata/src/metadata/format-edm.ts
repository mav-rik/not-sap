import type { TODataValueType } from './format-filters'

// Duck-type check for CalendarDate-like objects
// CalendarDate objects from @internationalized/date have these characteristic properties
function isCalendarDateLike(value: any): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.toString === 'function' &&
    typeof value.year === 'number' &&
    typeof value.month === 'number' &&
    typeof value.day === 'number' &&
    !('getTime' in value) // Distinguish from Date objects
  )
}

export type ODataEdmType =
  | 'Edm.String'
  | 'Edm.Int32'
  | 'Edm.Int64'
  | 'Edm.Decimal'
  | 'Edm.Boolean'
  | 'Edm.DateTime'
  | 'Edm.Date'
  | 'Edm.Guid'
  | 'Edm.Double'
  | 'Edm.Single'
  | 'Edm.Time'

/**
 * An object containing transformation functions for OData EDM types.
 *
 * The `odataValueFormat` object provides three sets of transformation functions:
 * - `toJson`: Converts OData EDM type values from their string representation to their respective JavaScript types.
 * - `toFilter`: Converts JavaScript values to their OData filter string representation.
 * - `toDisplay`: Converts JavaScript values to their display string representation.
 *
 * Each set of functions is a record where the keys are OData EDM types and the values are functions that perform the transformation.
 */
export const odataValueFormat = {
  toJson: {
    'Edm.String': (value): string => {
      return value
    },
    'Edm.Int32': (value): number => {
      return parseInt(value, 10)
    },
    'Edm.Int64': (value): number => {
      return parseInt(value, 10)
    },
    'Edm.Decimal': (value): number => {
      return parseFloat(value)
    },
    'Edm.Boolean': (value): boolean => {
      return value.toLowerCase() === 'true'
    },
    'Edm.Date': (value): Date | undefined => {
      if (!value) {
        return undefined
      }
      const match = /\/Date\((\d+)\)\//.exec(value)
      return match ? new Date(parseInt(match[1], 10)) : new Date(value)
    },
    'Edm.DateTime': (value): Date | undefined => {
      if (!value) {
        return undefined
      }
      const match = /\/Date\((\d+)\)\//.exec(value)
      return match ? new Date(parseInt(match[1], 10)) : new Date(value)
    },
    'Edm.Guid': (value): string => {
      return value
    },
    'Edm.Double': (value): number => {
      return parseFloat(value)
    },
    'Edm.Single': (value): number => {
      return parseFloat(value)
    },
    'Edm.Time': (value): string => {
      return value
    },
  } as Record<ODataEdmType, (v: string) => string | boolean | number | Date>,
  toFilter: {
    'Edm.String': (value): string => {
      // Escape single quotes by replacing ' with ''
      if (typeof value !== 'string') {
        return String(value)
      }
      const escapedValue = (value as string).replace(/'/g, "''")
      return `'${escapedValue}'`
    },
    'Edm.Int32': (value): string => {
      return `${value}`
    },
    'Edm.Int64': (value): string => {
      return `${value}`
    },
    'Edm.Decimal': (value): string => {
      return `${value}`
    },
    'Edm.Boolean': (value): string => {
      return value ? 'true' : 'false'
    },
    'Edm.DateTime': (value): string => {
      if (value instanceof Date) {
        return `datetime'${value.toISOString()}'`
      }
      if (isCalendarDateLike(value)) {
        return `datetime'${value.toString()}T00:00:00'`
      }
      if (typeof value === 'string') {
        return value.startsWith('datetime') ? value : `datetime'${new Date(value).toISOString()}'`
      }
      return `datetime''`
    },
    'Edm.Date': (value): string => {
      if (value instanceof Date) {
        return `${value.toISOString().slice(10)}`
      }
      if (isCalendarDateLike(value)) {
        return `${value.toString()}`
      }
      return ``
    },
    'Edm.Guid': (value): string => {
      return `guid'${value}'`
    },
    'Edm.Double': (value): string => {
      return `${value}`
    },
    'Edm.Single': (value): string => {
      return `${value}`
    },
    'Edm.Time': (value): string => {
      return `time'${value}'`
    },
  } as Record<ODataEdmType, (v: TODataValueType) => string>,
  toDisplay: {
    'Edm.String': (value): string => {
      return value as string
    },
    'Edm.Int32': (value): string => {
      return value.toLocaleString()
    },
    'Edm.Int64': (value): string => {
      return value.toLocaleString()
    },
    'Edm.Decimal': (value): string => {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    'Edm.Boolean': (value): string => {
      return value ? 'Yes' : 'No'
    },
    'Edm.DateTime': (value): string => {
      if (value instanceof Date) {
        return value.getFullYear() === 9999
          ? '∞'
          : value
              .toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/-/g, '.')
      }
      return value as string
    },
    'Edm.Date': (value): string => {
      if (value instanceof Date) {
        return value.getFullYear() === 9999
          ? '∞'
          : value
              .toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/-/g, '.')
      }
      return value as string
    },
    'Edm.Guid': (value): string => {
      return (value as string).toUpperCase()
    },
    'Edm.Double': (value): string => {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    'Edm.Single': (value): string => {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    'Edm.Time': (value): string => {
      return value as string
    },
  } as Record<ODataEdmType, (v: string | number | Date | boolean) => string>,
}
