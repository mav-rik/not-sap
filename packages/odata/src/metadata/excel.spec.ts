import { describe, it, expect } from 'vitest'
import { ExcelGenerator } from './excel'

describe('Excel', () => {
  describe('getColumnLetter', () => {
    it('should return "A" for column number 1', () => {
      expect(ExcelGenerator.getColumnLetter(1)).toBe('A')
    })

    it('should return "Z" for column number 26', () => {
      expect(ExcelGenerator.getColumnLetter(26)).toBe('Z')
    })

    it('should return "AA" for column number 27', () => {
      expect(ExcelGenerator.getColumnLetter(27)).toBe('AA')
    })

    it('should return "AZ" for column number 52', () => {
      expect(ExcelGenerator.getColumnLetter(52)).toBe('AZ')
    })

    it('should return "BA" for column number 53', () => {
      expect(ExcelGenerator.getColumnLetter(53)).toBe('BA')
    })

    it('should return "ZZ" for column number 702', () => {
      expect(ExcelGenerator.getColumnLetter(702)).toBe('ZZ')
    })

    it('should return "AAA" for column number 703', () => {
      expect(ExcelGenerator.getColumnLetter(703)).toBe('AAA')
    })

    it('should handle large column numbers correctly', () => {
      expect(ExcelGenerator.getColumnLetter(18278)).toBe('ZZZ')
    })

    it('should return an empty string for column number 0', () => {
      expect(ExcelGenerator.getColumnLetter(0)).toBe('')
    })
  })
})
describe('Excel', () => {
  describe('generateSumFormula', () => {
    it('should generate a simple sum formula without excluded rows', () => {
      expect(ExcelGenerator.generateSumFormula('A', 1, 5, [])).toBe('SUM(A1:A5)')
    })

    it('should generate a sum formula with one excluded row', () => {
      expect(ExcelGenerator.generateSumFormula('B', 1, 5, [3])).toBe('SUM(B1:B2,B4:B5)')
    })

    it('should generate a sum formula with multiple excluded rows', () => {
      expect(ExcelGenerator.generateSumFormula('C', 1, 10, [3, 5, 7])).toBe(
        'SUM(C1:C2,C4:C4,C6:C6,C8:C10)'
      )
    })

    it('should handle excluded rows at the start and end of the range', () => {
      expect(ExcelGenerator.generateSumFormula('D', 1, 5, [1, 5])).toBe('SUM(D2:D4)')
    })

    it('should handle all rows excluded', () => {
      expect(ExcelGenerator.generateSumFormula('E', 1, 3, [1, 2, 3])).toBe('SUM()')
    })

    it('should ignore excluded rows outside the specified range', () => {
      expect(ExcelGenerator.generateSumFormula('F', 3, 7, [1, 2, 8, 9])).toBe('SUM(F3:F7)')
    })

    it('should handle a single row range', () => {
      expect(ExcelGenerator.generateSumFormula('G', 5, 5, [])).toBe('SUM(G5:G5)')
    })

    it('should handle a single row range with that row excluded', () => {
      expect(ExcelGenerator.generateSumFormula('H', 5, 5, [5])).toBe('SUM()')
    })

    it('should handle unsorted excluded rows', () => {
      expect(ExcelGenerator.generateSumFormula('I', 1, 10, [7, 3, 5])).toBe(
        'SUM(I1:I2,I4:I4,I6:I6,I8:I10)'
      )
    })

    it('should handle large column letters', () => {
      expect(ExcelGenerator.generateSumFormula('AA', 1, 5, [3])).toBe('SUM(AA1:AA2,AA4:AA5)')
    })
  })
})
