import { CalendarDate } from '@internationalized/date'

export interface DateRangeShortcut {
  label: string
  dates: [string, string]
}

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = ('0' + (date.getMonth() + 1)).slice(-2)
  const dd = ('0' + date.getDate()).slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

const today = new Date()
const todayStr = formatDate(today)

export function createCaledarDate(dateStr: string): CalendarDate {
  const [yearStr, monthStr, dayStr] = dateStr.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)
  return new CalendarDate(year, month, day)
}

export const dateRangeShortcuts: DateRangeShortcut[] = [
  {
    label: 'Last 7 Days',
    dates: [formatDate(new Date(Date.now() - 6 * 86400000)), todayStr],
  },
  {
    label: 'Last 30 Days',
    dates: [formatDate(new Date(Date.now() - 29 * 86400000)), todayStr],
  },
  {
    label: `Month to Date (${formatDate(new Date(today.getFullYear(), today.getMonth(), 1)).slice(
      0,
      7
    )})`,
    dates: [formatDate(new Date(today.getFullYear(), today.getMonth(), 1)), todayStr],
  },
  {
    label: 'Last 90 Days',
    dates: [formatDate(new Date(Date.now() - 89 * 86400000)), todayStr],
  },
  {
    label: 'Last 6 Months',
    dates: [
      formatDate(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())),
      todayStr,
    ],
  },
  {
    label: 'Last 12 Months',
    dates: [
      formatDate(new Date(today.getFullYear(), today.getMonth() - 12, today.getDate())),
      todayStr,
    ],
  },
  {
    label: `Year to Date (${formatDate(new Date(today.getFullYear(), 0, 1)).slice(0, 4)})`,
    dates: [formatDate(new Date(today.getFullYear(), 0, 1)), todayStr],
  },
]
