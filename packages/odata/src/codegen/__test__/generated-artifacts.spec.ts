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
      },
      {
        className: 'TripPinRESTierService',
        constName: 'tripPinRESTierServiceConsts',
        interfaceName: 'TTripPinRESTierService',
        fileName: 'TripPinRESTierService.ts'
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
        'combined-services.ts',
        'TripPinRESTierService.ts'
      ]

      const actualFiles = readdirSync(generatedDir).filter(f => f.endsWith('.ts'))

      expectedFiles.forEach(file => {
        expect(actualFiles).toContain(file)
      })
    })
  })

  describe('Enum Types Generation', () => {
    it('should generate enum types in TripPin service', () => {
      const filePath = join(generatedDir, 'TripPinRESTierService.ts')
      const fileContent = readFileSync(filePath, 'utf-8')

      // Check that enumTypes section exists in the interface
      expect(fileContent).toContain('enumTypes: {')

      // Check specific enum type definitions
      expect(fileContent).toMatch(/'Trippin\.PersonGender':\s*'Male'\s*\|\s*'Female'\s*\|\s*'Unknown'/)
      expect(fileContent).toMatch(/'Trippin\.Feature':\s*'Feature1'\s*\|\s*'Feature2'\s*\|\s*'Feature3'\s*\|\s*'Feature4'/)
    })

    it('should use enum type references in entity fields', () => {
      const filePath = join(generatedDir, 'TripPinRESTierService.ts')
      const fileContent = readFileSync(filePath, 'utf-8')

      // Check that Gender field references the enum type
      expect(fileContent).toContain("Gender: TTripPinRESTierServiceOData['enumTypes']['Trippin.PersonGender']")

      // Check that FavoriteFeature field references the enum type
      expect(fileContent).toContain("FavoriteFeature: TTripPinRESTierServiceOData['enumTypes']['Trippin.Feature']")

      // Check that Features array field references the enum type
      expect(fileContent).toContain("Features: Array<TTripPinRESTierServiceOData['enumTypes']['Trippin.Feature']>")
    })

    it('should not use "any" type for enum fields', () => {
      const filePath = join(generatedDir, 'TripPinRESTierService.ts')
      const fileContent = readFileSync(filePath, 'utf-8')

      // Extract the Person entity record definition
      const personRecordMatch = fileContent.match(/'Trippin\.Person':\s*\{[\s\S]*?record:\s*\{([\s\S]*?)\};/m)

      if (personRecordMatch) {
        const recordContent = personRecordMatch[1]

        // Check that enum fields don't use "any" type
        const genderLine = recordContent.match(/Gender:\s*([^;]+);/)
        expect(genderLine?.[1]).not.toContain('any')

        const featureLine = recordContent.match(/FavoriteFeature:\s*([^;]+);/)
        expect(featureLine?.[1]).not.toContain('any')

        const featuresLine = recordContent.match(/Features:\s*([^;]+);/)
        expect(featuresLine?.[1]).not.toContain('any')
      } else {
        // If we can't find the record, fail the test
        expect(personRecordMatch).not.toBeNull()
      }
    })

    it('should handle both single and collection enum types', () => {
      const filePath = join(generatedDir, 'TripPinRESTierService.ts')
      const fileContent = readFileSync(filePath, 'utf-8')

      // Single enum type (not an array)
      const genderPattern = /Gender:\s*TTripPinRESTierServiceOData\['enumTypes'\]\['Trippin\.PersonGender'\]/
      expect(fileContent).toMatch(genderPattern)

      // Collection enum type (array)
      const featuresPattern = /Features:\s*Array<TTripPinRESTierServiceOData\['enumTypes'\]\['Trippin\.Feature'\]>/
      expect(fileContent).toMatch(featuresPattern)
    })
  })
})