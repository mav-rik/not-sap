import { describe, it, expect, beforeAll } from 'vitest'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Generated Artifacts Tests', () => {
  const generatedDir = join(__dirname, 'generated')

  beforeAll(() => {
    // Verify the generated directory exists
    expect(existsSync(generatedDir)).toBe(true)
  })

  describe('Export Statements Validation', () => {
    const testCases = [
      {
        className: 'HanaV4Param',
        constName: 'hanaV4ParamConsts',
        interfaceName: 'THanaV4Param',
        fileName: 'hana-v4-param.ts'
      },
      {
        className: 'NorthwindV2',
        constName: 'northwindV2Consts',
        interfaceName: 'TNorthwindV2',
        fileName: 'northwind-v2.ts'
      },
      {
        className: 'NorthwindV2Selected',
        constName: 'northwindV2SelectedConsts',
        interfaceName: 'TNorthwindV2Selected',
        fileName: 'northwind-v2-selected.ts'
      },
      {
        className: 'NorthwindV4',
        constName: 'northwindV4Consts',
        interfaceName: 'TNorthwindV4',
        fileName: 'northwind-v4.ts'
      },
      {
        className: 'NorthwindV4Selected',
        constName: 'northwindV4SelectedConsts',
        interfaceName: 'TNorthwindV4Selected',
        fileName: 'northwind-v4-selected.ts'
      },
      {
        className: 'SapV4',
        constName: 'sapV4Consts',
        interfaceName: 'TSapV4',
        fileName: 'sap-v4.ts'
      },
      {
        className: 'SapService',
        constName: 'sapServiceConsts',
        interfaceName: 'TSapService',
        fileName: 'combined-services.ts',
        isPartOfCombined: true
      },
      {
        className: 'HanaService',
        constName: 'hanaServiceConsts',
        interfaceName: 'THanaService',
        fileName: 'combined-services.ts',
        isPartOfCombined: true
      }
    ]

    testCases.forEach(({ className, constName, interfaceName, fileName, isPartOfCombined }) => {
      const testName = isPartOfCombined
        ? `should have all exports for ${className} in ${fileName}`
        : `should have all exports in ${fileName}`

      it(testName, () => {
        const filePath = join(generatedDir, fileName)

        // Check if file exists
        expect(existsSync(filePath)).toBe(true)

        // Read file content
        const fileContent = readFileSync(filePath, 'utf-8')

        // 1. Check for export class statement
        const exportClassPattern = new RegExp(`export\\s+class\\s+${className}\\s+extends`, 'm')
        expect(fileContent).toMatch(exportClassPattern)

        // 2. Check for export const statement
        const exportConstPattern = new RegExp(`export\\s+const\\s+${constName}\\s*=`, 'm')
        expect(fileContent).toMatch(exportConstPattern)

        // 3. Check for export interface statement
        const exportInterfacePattern = new RegExp(`export\\s+interface\\s+${interfaceName}\\s*\\{`, 'm')
        expect(fileContent).toMatch(exportInterfacePattern)

        // Verify proper capitalization patterns
        // Class name should start with uppercase
        expect(className[0]).toBe(className[0].toUpperCase())

        // Interface name should follow T{Capitalized} pattern
        expect(interfaceName[0]).toBe('T')
        expect(interfaceName[1]).toBe(interfaceName[1].toUpperCase())

        // Const name should start with lowercase
        expect(constName[0]).toBe(constName[0].toLowerCase())

        // Verify getInstance method pattern
        const getInstancePattern = new RegExp(`${className}\\.getInstance\\(\\)`, 'm')
        expect(fileContent).toMatch(getInstancePattern)

        // Verify serviceName static property
        const serviceNamePattern = new RegExp(`public\\s+static\\s+readonly\\s+serviceName\\s*=`, 'm')
        expect(fileContent).toMatch(serviceNamePattern)
      })
    })

  })

  describe('Generated Files Structure', () => {
    it('should have all expected generated files', () => {
      const expectedFiles = [
        'hana-v4-param.ts',
        'northwind-v2.ts',
        'northwind-v2-selected.ts',
        'northwind-v4.ts',
        'northwind-v4-selected.ts',
        'sap-v4.ts',
        'combined-services.ts'
      ]

      const actualFiles = readdirSync(generatedDir).filter(f => f.endsWith('.ts'))

      expectedFiles.forEach(file => {
        expect(actualFiles).toContain(file)
      })
    })
  })
})