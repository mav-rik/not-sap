// CalendarDate-like type for duck typing
// Represents objects that have year, month, day properties like @internationalized/date's CalendarDate
type CalendarDateLike = {
  year: number
  month: number
  day: number
  toString(): string
}

export const ODataFilterConditionTypes = [
  'value',
  'substringof',
  'contains',
  'eq',
  'bw',
  'starts',
  'ends',
  'lt',
  'le',
  'gt',
  'ge',
  'empty',
  'notSubstringof',
  'notContains',
  'notEq',
  'notBw',
  'notStarts',
  'notEnds',
  'notLt',
  'notLe',
  'notGt',
  'notGe',
  'notEmpty',
] as const

export type TODataFilterConditionType = (typeof ODataFilterConditionTypes)[number]

export type TODataFilterAnd<T extends string = string> = {
  $and: TODataFilters<T>
}

export type TODataFilterOr<T extends string = string> = {
  $or: TODataFilters<T>
}

export type TODataFilterPattern = string

export type TODataValueType = string | number | boolean | Date | CalendarDateLike

export type TODataFilterValWithType =
  | { value: string | number | boolean | [string | number | boolean] }
  | { contains: string | [string] }
  | { eq: TODataValueType | [TODataValueType] }
  | { bw: [string, string] | [number, number] | [CalendarDateLike, CalendarDateLike] | [Date, Date] }
  | { starts: string | [string] }
  | { ends: string | [string] }
  | { lt: TODataValueType | [TODataValueType] }
  | { le: TODataValueType | [TODataValueType] }
  | { gt: TODataValueType | [TODataValueType] }
  | { ge: TODataValueType | [TODataValueType] }
  | { empty: boolean | [boolean] }
  | { notContains: string | [string] }
  | { notEq: TODataValueType | [TODataValueType] }
  | { notBw: [string, string] | [number, number] | [CalendarDateLike, CalendarDateLike] | [Date, Date] }
  | { notStarts: string | [string] }
  | { notEnds: string | [string] }
  | { notLt: TODataValueType | [TODataValueType] }
  | { notLe: TODataValueType | [TODataValueType] }
  | { notGt: TODataValueType | [TODataValueType] }
  | { notGe: TODataValueType | [TODataValueType] }
  | { notEmpty: boolean | [boolean] }

/**
 * Check if the filter is empty, conditional, or an exact match.
 * @param f The filter to check.
 * @returns An object with the results of the checks.
 */
export function checkODataFilter(
  f?: (TODataFilterValWithType | string) | (TODataFilterValWithType | string)[]
) {
  if (!f) {
    return {
      isEmpty: (): boolean => true,
      isConditional: (): boolean => false,
      isExactMatch: (): boolean => false,
      hasEmpty: (): boolean => true,
      hasConditional: (): boolean => false,
      hasExactMatch: (): boolean => false,
    }
  }
  if (Array.isArray(f)) {
    return {
      isEmpty: (): boolean => f.length === 0 || f.every(_ => checkODataFilter(_).isEmpty()),
      isConditional: (): boolean => f.every(_ => checkODataFilter(_).isConditional()),
      isExactMatch: (): boolean => f.every(_ => checkODataFilter(_).isExactMatch()),
      hasEmpty: (): boolean => f.length === 0 || f.some(_ => checkODataFilter(_).isEmpty()),
      hasConditional: (): boolean => f.some(_ => checkODataFilter(_).isConditional()),
      hasExactMatch: (): boolean => f.some(_ => checkODataFilter(_).isExactMatch()),
    }
  }
  if (typeof f === 'string') {
    return {
      isEmpty: (): boolean => !!f,
      isConditional: (): boolean => false,
      isExactMatch: (): boolean => false,
      hasEmpty: (): boolean => !!f,
      hasConditional: (): boolean => false,
      hasExactMatch: (): boolean => false,
    }
  }
  return {
    isEmpty: (): boolean =>
      // @ts-expect-error
      (Array.isArray(f.value) && (f.value.length === 0 || f.value.every(_ => _ === ''))) ||
      // @ts-expect-error
      (Array.isArray(f.eq) && (f.eq.length === 0 || f.eq.every(_ => _ === ''))) ||
      // @ts-expect-error
      f.value === '' ||
      // @ts-expect-error
      f.eq === '' ||
      // @ts-expect-error
      f.empty,
    isConditional: (): boolean => !('value' in f || 'eq' in f),
    isExactMatch: (): boolean => 'value' in f || 'eq' in f,
    hasEmpty: (): boolean =>
      // @ts-expect-error
      (Array.isArray(f.value) && (f.value.length === 0 || f.value.some(_ => _ === ''))) ||
      // @ts-expect-error
      (Array.isArray(f.eq) && (f.eq.length === 0 || f.eq.some(_ => _ === ''))) ||
      // @ts-expect-error
      f.value === '' ||
      // @ts-expect-error
      f.eq === '' ||
      // @ts-expect-error
      f.empty,
    hasConditional: (): boolean => !('value' in f || 'eq' in f),
    hasExactMatch: (): boolean => 'value' in f || 'eq' in f,
  }
}

export type TODataFilter<T extends string = string> = {
  [field in T]?: TODataFilterPattern | TODataFilterValWithType
}

export type TODataFilters<T extends string = string> = (
  | TODataFilter<T>
  | TODataFilterOr<T>
  | TODataFilterAnd<T>
)[]

export type TODataFieldsFilters<T extends string = string> = {
  [field in T]?: (TODataFilterPattern | TODataFilterValWithType)[]
}

export type TODataTypedFilterValue = {
  type: TODataFilterConditionType
  value: [TODataValueType] | [TODataValueType, TODataValueType]
}

export function odataFilters<T extends string = string>(
  filters: TODataFilters<T>
): TODataFilters<T> {
  return filters
}

const EMPTY = '<empty>'

/**
 * Utility object for formatting OData filters.
 *
 * Provides methods to convert filter conditions to OData query strings,
 * to convert filter values to string representations, and to parse
 * string representations back into filter values.
 */
export const odataFilterFormat = {
  toFilter: {
    value: (f, v) => `${f} eq ${v}`,
    substringof: (f, v) => `substringof(${v},${f})`, // v2
    contains: (f, v) => `contains(${f},${v})`, // v4
    eq: (f, v) => `${f} eq ${v}`,
    bw: (f, v, v2) => `(${f} ge ${v} and ${f} le ${v2})`,
    starts: (f, v) => `startswith(${f},${v})`,
    ends: (f, v) => `endswith(${f},${v})`,
    lt: (f, v) => `${f} lt ${v}`,
    le: (f, v) => `${f} le ${v}`,
    gt: (f, v) => `${f} gt ${v}`,
    ge: (f, v) => `${f} ge ${v}`,
    empty: f => `${f} eq null`,
    // not
    notSubstringof: (f, v) => `not substringof(${v},${f})`, // v2
    notContains: (f, v) => `not contains(${f},${v})`, // v4
    notEq: (f, v) => `${f} ne ${v}`,
    notBw: (f, v, v2) => `not (${f} ge ${v} and ${f} le ${v2})`,
    notStarts: (f, v) => `not startswith(${f},${v})`,
    notEnds: (f, v) => `not endswith(${f},${v})`,
    notLt: (f, v) => `${f} ge ${v}`,
    notLe: (f, v) => `${f} gt ${v}`,
    notGt: (f, v) => `${f} le ${v}`,
    notGe: (f, v) => `${f} lt ${v}`,
    notEmpty: f => `${f} ne null`,
  } as Record<TODataFilterConditionType, (f: string, v?: string, v2?: string) => string>,
  toString: {
    value(v) {
      return `${v}`
    },
    contains(v) {
      return `*${v}*`
    },
    substringof(v) {
      return `*${v}*`
    },
    eq(v) {
      return `=${v}`
    },
    bw(v, v2) {
      return `${v}...${v2}`
    },
    starts(v) {
      return `${v}*`
    },
    ends(v) {
      return `*${v}`
    },
    lt(v) {
      return `<${v}`
    },
    le(v) {
      return `<=${v}`
    },
    gt(v) {
      return `>${v}`
    },
    ge(v) {
      return `>=${v}`
    },
    empty() {
      return EMPTY
    },
    notContains(v) {
      return `!(${this.contains(v)})`
    },
    notEq(v) {
      return `!(${this.eq(v)})`
    },
    notBw(v) {
      return `!(${this.bw(v)})`
    },
    notStarts(v) {
      return `!(${this.starts(v)})`
    },
    notEnds(v) {
      return `!(${this.ends(v)})`
    },
    notLt(v) {
      return `!(${this.lt(v)})`
    },
    notLe(v) {
      return `!(${this.le(v)})`
    },
    notGt(v) {
      return `!(${this.gt(v)})`
    },
    notGe(v) {
      return `!(${this.ge(v)})`
    },
    notEmpty() {
      return `!(${this.empty()})`
    },
  } as Record<TODataFilterConditionType, (v?: string, v2?: string) => string>,
  fromString: (value: string, def: 'eq' | 'value' = 'eq'): TODataFilterValWithType | undefined => {
    if (!value) return undefined
    const isNegative = /^!\((.+)\)$/.exec(value)
    const v = isNegative?.[1] || value
    if (v === EMPTY) {
      return isNegative ? { notEmpty: true } : { empty: true }
    }
    if (v.startsWith('*') && v.endsWith('*')) {
      return isNegative ? { notContains: v } : { contains: v.slice(1, -1) }
    }
    if (v.endsWith('*')) {
      return isNegative ? { notStarts: v } : { starts: v.slice(0, -1) }
    }
    if (v.startsWith('*')) {
      return isNegative ? { notEnds: v } : { ends: v.slice(1) }
    }
    if (v.startsWith('=')) {
      return isNegative ? { notEq: v } : { eq: v.slice(1) }
    }
    if (v.startsWith('>=')) {
      return isNegative ? { notGe: v } : { ge: v.slice(2) }
    }
    if (v.startsWith('>')) {
      return isNegative ? { notGt: v } : { gt: v.slice(1) }
    }
    if (v.startsWith('<=')) {
      return isNegative ? { notLe: v } : { le: v.slice(2) }
    }
    if (v.startsWith('<')) {
      return isNegative ? { notLt: v } : { lt: v.slice(1) }
    }
    const isBw = /^(.+)\.\.\.(.+)$/.exec(v)
    if (isBw?.[1] && isBw?.[2]) {
      return isNegative ? { notBw: [isBw[1], isBw[2]] } : { bw: [isBw[1], isBw[2]] }
    }
    return def === 'value' ? { value } : { eq: value }
  },
  fromTypedValue(f: TODataTypedFilterValue): TODataFilterValWithType {
    return {
      [f.type]: f.value,
    } as TODataFilterValWithType
  },
  toTypedValue(f: TODataFilterValWithType | string | number): TODataTypedFilterValue {
    if (typeof f === 'string') {
      return {
        type: 'eq',
        value: [f],
      } as TODataTypedFilterValue
    }
    const entry = Object.entries(f)[0]
    if (!entry) {
      return { type: 'eq', value: [''] } as TODataTypedFilterValue
    }
    const [type, value] = entry
    return { type, value } as TODataTypedFilterValue
  },
}
