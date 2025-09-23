import { type EntitySetField, type TEntityCurrencyEntry } from './entity-set'
import { type TOdataDummyInterface } from '../odata'
import { type TODataValueType } from './format-filters'

export type TExcelSubtotalConfig<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entitySets'] = string,
> = {
  grpBy: M['entitySets'][T]['fields'][]
  aggregate: M['entitySets'][T]['fields'][]
  aggregatedValues?: Record<M['entitySets'][T]['fields'], TODataValueType>[]
  bg?: string
}

type Tracker<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entitySets'] = string,
> = {
  subtotalConfig: TExcelSubtotalConfig<M, T>
  lastGroupKey?: string
  lastGroupValues?: Record<M['entitySets'][T]['fields'], any>
  groupStartRowIndex: number
  aggregatedMap: Map<string, Record<M['entitySets'][T]['fields'], any>>
}

export class ExcelGenerator<
  M extends TOdataDummyInterface = TOdataDummyInterface,
  T extends keyof M['entitySets'] = string,
> {
  constructor(
    private getField: (fieldName: M['entitySets'][T]['fields']) => EntitySetField | undefined,
    private readCurrencies: () => Promise<Map<string, TEntityCurrencyEntry> | undefined>
  ) {}

  protected currentRecord: Record<M['entitySets'][T]['fields'], TODataValueType> = {} as Record<
    M['entitySets'][T]['fields'],
    TODataValueType
  >

  protected subtotalIndexes = [] as number[]
  protected currentRowIndex = 0

  async generateExcel(
    columnsNames: M['entitySets'][T]['fields'][],
    dataRows: Record<M['entitySets'][T]['fields'], TODataValueType>[],
    opts?: {
      subtotals?: TExcelSubtotalConfig<M, T>[]
    }
  ) {
    const { Workbook } = await import('exceljs')
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    let hasMonetary = false
    this.subtotalIndexes = []

    const columns = columnsNames
      .filter(c => !!this.getField(c))
      .map(c => {
        const col = this.getField(c)!
        const u = col.$unit ? this.getField(col.$unit) : undefined
        if (u?.$semantics === 'currency-code') {
          hasMonetary = true
        }
        return col
      })

    const currencies = hasMonetary ? await this.readCurrencies() : undefined

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
        activeCell: 'A1',
        showGridLines: true,
      },
    ]

    // Initialize worksheet columns
    worksheet.columns = columns.map(c => ({
      header: c.$label,
      key: c.$Name,
      width: ExcelGenerator.calculateColumnWidth(c),
      style: {
        font: {
          name: 'Arial',
        },
      },
    }))

    const headerRow = worksheet.getRow(1)
    headerRow.font = {
      bold: true,
      name: 'Arial',
    }

    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF7F7F7' },
    }

    headerRow.commit()

    const subtotalConfigs = opts?.subtotals || []
    // Initialize subtotal trackers
    const subtotalTrackers: Tracker[] = subtotalConfigs.map(subtotalConfig => {
      const aggregatedMap = new Map<string, Record<M['entitySets'][T]['fields'], any>>()
      if (subtotalConfig.aggregatedValues) {
        subtotalConfig.aggregatedValues.forEach(r =>
          aggregatedMap.set(groupKey(subtotalConfig.grpBy, r), r)
        )
      }
      return {
        subtotalConfig,
        groupStartRowIndex: 2, // data starts at row 2 since row 1 is the header
        aggregatedMap,
      } as Tracker
    })

    this.currentRowIndex = 2 // Start from the row after the header

    function groupKey(
      grpBy: M['entitySets'][T]['fields'][],
      record: Record<M['entitySets'][T]['fields'], TODataValueType>
    ): string {
      return grpBy.map((field: M['entitySets'][T]['fields']) => record[field]).join('||')
    }

    dataRows.forEach(record => {
      this.currentRecord = record

      const groupKeyChangedAtLevels: number[] = []

      // Determine at which levels the group key has changed
      for (let i = 0; i < subtotalTrackers.length; i++) {
        const tracker = subtotalTrackers[i]
        const { grpBy } = tracker.subtotalConfig

        const currentGroupKey = groupKey(grpBy, record)
        if (tracker.lastGroupKey === undefined) {
          // First time encountering this group
          tracker.lastGroupKey = currentGroupKey
          tracker.lastGroupValues = grpBy.reduce(
            (acc, field: M['entitySets'][T]['fields']) => {
              acc[field] = record[field]
              return acc
            },
            {} as Record<string, any>
          )
          tracker.groupStartRowIndex = this.currentRowIndex
        } else if (tracker.lastGroupKey !== currentGroupKey) {
          // Group key has changed
          groupKeyChangedAtLevels.push(i)
        }
      }

      // Insert subtotal rows for changed group keys, starting from innermost level
      if (groupKeyChangedAtLevels.length > 0) {
        for (let i = subtotalTrackers.length - 1; i >= 0; i--) {
          if (groupKeyChangedAtLevels.includes(i)) {
            const tracker = subtotalTrackers[i]
            this.insertSubtotalRow(worksheet, tracker, columns, currencies)
            // Reset tracker for new group
            tracker.groupStartRowIndex = this.currentRowIndex
            const { grpBy } = tracker.subtotalConfig
            tracker.lastGroupKey = groupKey(grpBy, record)
            tracker.lastGroupValues = grpBy.reduce(
              (acc, field: M['entitySets'][T]['fields']) => {
                acc[field] = record[field]
                return acc
              },
              {} as Record<string, any>
            )
          }
        }
      }

      // Add the data row
      const rowValues = columns.map(c =>
        this.getValue(c, record[c.$Name as M['entitySets'][T]['fields']], record, currencies)
      )
      const row = worksheet.addRow(rowValues.map(r => r.value))

      row.eachCell((cell, colNumber) => {
        const format = rowValues[colNumber - 1].format
        if (format) {
          cell.numFmt = format
        }
      })

      this.currentRowIndex++
    })

    // After processing all data rows, insert any remaining subtotals
    for (let i = subtotalTrackers.length - 1; i >= 0; i--) {
      const tracker = subtotalTrackers[i]
      this.insertSubtotalRow(worksheet, tracker, columns, currencies, true)
    }

    // === Adding Autofilter to the Header Row ===
    const lastColumnLetter = ExcelGenerator.getColumnLetter(columns.length)
    worksheet.autoFilter = {
      from: `A1`,
      to: `${lastColumnLetter}1`,
    }

    return workbook.xlsx.writeBuffer()
  }

  // Static method to calculate column width
  static calculateColumnWidth(column: EntitySetField): number {
    const maxDataLength = (column.$MaxLength || 10) * 1.5
    const labelLength = (column.$label?.length || 10) * 1.5
    return Math.min(Math.max(12, maxDataLength, labelLength), 40)
  }

  // Static method to get column letter
  static getColumnLetter(colNumber: number): string {
    let temp
    let letter = ''
    while (colNumber > 0) {
      temp = (colNumber - 1) % 26
      letter = String.fromCharCode(temp + 65) + letter
      colNumber = Math.floor((colNumber - temp - 1) / 26)
    }
    return letter
  }

  // Method to generate SUM formula excluding subtotal rows
  public static generateSumFormula(
    colLetter: string,
    startRow: number,
    endRow: number,
    excludedRows: number[]
  ): string {
    const ranges: string[] = []
    let rangeStart = startRow

    // Sort the excluded rows within the range
    const excluded = excludedRows
      .filter(row => row >= startRow && row <= endRow)
      .sort((a, b) => a - b)

    for (let i = 0; i <= excluded.length; i++) {
      const rangeEnd = i < excluded.length ? excluded[i] - 1 : endRow
      if (rangeStart <= rangeEnd) {
        ranges.push(`${colLetter}${rangeStart}:${colLetter}${rangeEnd}`)
      }
      rangeStart = i < excluded.length ? excluded[i] + 1 : endRow + 1
    }

    return `SUM(${ranges.join(',')})`
  }

  // Method to insert subtotal row
  private insertSubtotalRow(
    worksheet: any,
    tracker: Tracker,
    columns: EntitySetField[],
    currencies: Map<string, { DecimalPlaces: number }> | undefined,
    isFinalSubtotal: boolean = false
  ) {
    const { grpBy, aggregate } = tracker.subtotalConfig
    const values = tracker.aggregatedMap.get(tracker.lastGroupKey!)

    const subtotalRowValues: any[] = []
    const colFormats: (string | undefined)[] = []
    for (let colIndex = 1; colIndex <= columns.length; colIndex++) {
      const column = columns[colIndex - 1]
      const fieldName = column.$Name as M['entitySets'][T]['fields']
      const field = this.getField(fieldName)!

      colFormats.push(
        this.getValue(
          field,
          tracker.lastGroupValues![fieldName] || '',
          tracker.lastGroupValues!,
          currencies
        ).format
      )

      if (grpBy.includes(fieldName)) {
        subtotalRowValues[colIndex] = this.getValue(
          field,
          tracker.lastGroupValues![fieldName],
          tracker.lastGroupValues!,
          currencies
        ).value
      } else if (aggregate.includes(fieldName)) {
        if (values) {
          subtotalRowValues[colIndex] = this.getValue(
            this.getField(fieldName)!,
            values[fieldName] as string,
            values,
            currencies
          ).value
        } else {
          const colLetter = ExcelGenerator.getColumnLetter(colIndex)
          const sumFormula = ExcelGenerator.generateSumFormula(
            colLetter,
            tracker.groupStartRowIndex,
            this.currentRowIndex - 1,
            this.subtotalIndexes
          )
          subtotalRowValues[colIndex] = {
            formula: sumFormula,
          }
        }
      } else {
        subtotalRowValues[colIndex] = ''
      }
    }

    const subtotalRow = worksheet.addRow(subtotalRowValues)
    subtotalRow.font = { bold: true, name: 'Arial', size: 11 }

    subtotalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: tracker.subtotalConfig.bg || 'FFF7F7F7' },
    }
    subtotalRow.eachCell((cell: any, i: number) => {
      if (colFormats[i - 1]) {
        cell.numFmt = colFormats[i - 1]!
      }
      cell.border = {
        ...cell.border,
        bottom: {
          style: 'thin',
          color: { argb: 'FFCCCCCC' },
        },
        right: {
          style: 'thin',
          color: { argb: 'FFCCCCCC' },
        },
      }
    })
    this.currentRowIndex++

    // Record the subtotal row index in higher-level trackers
    // const trackerIndex = subtotalTrackers.indexOf(tracker)
    // for (let i = 0; i < trackerIndex; i++) {
    //   subtotalTrackers[i].subtotalRowIndexes.push(currentRowIndex - 1)
    // }
    this.subtotalIndexes.push(this.currentRowIndex - 1)

    // Reset for next group if not final
    if (!isFinalSubtotal) {
      tracker.groupStartRowIndex = this.currentRowIndex
      tracker.lastGroupKey = tracker.subtotalConfig.grpBy
        .map((field: M['entitySets'][T]['fields']) => this.currentRecord[field])
        .join('||')
      tracker.lastGroupValues = tracker.subtotalConfig.grpBy.reduce(
        (acc: any, field: M['entitySets'][T]['fields']) => {
          acc[field] = this.currentRecord[field]
          return acc
        },
        {} as Record<string, any>
      )
    }
  }

  // Method to get value and format for a cell
  private getValue(
    field: EntitySetField,
    val: TODataValueType,
    row: Record<M['entitySets'][T]['fields'], TODataValueType>,
    currencies: Map<string, { DecimalPlaces: number }> | undefined
  ) {
    const units = field.$unit && (row[field.$unit as keyof typeof row] as string)
    const u = ''
    const decimalPlaces = ((units && currencies?.get(units as string)?.DecimalPlaces) ??
      2) as number
    switch (field.$Type) {
      case 'Edm.String':
      case 'Edm.Guid':
        return { value: field.fromRaw.toDisplay(val as string) }
      case 'Edm.Int32':
      case 'Edm.Int64':
      case 'Edm.Decimal':
      case 'Edm.Double':
      case 'Edm.Single':
        return { value: Number(val), format: `${u}#,##0.${'0'.repeat(decimalPlaces)}` }
      case 'Edm.Boolean':
        return { value: val }
      case 'Edm.Date':
      case 'Edm.DateTime':
        return { value: field.fromRaw.toJson(val as string), format: 'dd.mm.yyyy' }
      case 'Edm.Time':
        return { value: val, format: 'hh:mm:ss' }
      default:
        return { value: field.fromRaw.toDisplay(val as string) }
    }
  }
}
