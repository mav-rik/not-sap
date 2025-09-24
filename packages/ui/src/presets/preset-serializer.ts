import { CalendarDate } from '@internationalized/date'

export function stringifyPresetField(field: any) {
  return JSON.stringify(field, (_key: string, value: any) => {
    if (value instanceof CalendarDate) {
      return {
        __p_type: 'CalendarDate',
        year: value.year,
        month: value.month,
        day: value.day,
      }
    }
    return value
  })
}

export function parsePresetField(field: string) {
  return JSON.parse(field, (_key: string, value: any) => {
    if (value?.__p_type === 'CalendarDate') {
      return new CalendarDate(value.year, value.month, value.day)
    }
    return value
  })
}
