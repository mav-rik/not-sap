import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { generateModelTypes } from '../types-generators'
import { Metadata } from '../../metadata/metadata'
import { OData } from '../../odata'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('TripPin Collection Types Generation', () => {
  let generatedCode: string
  let metadata: Metadata<any>

  beforeAll(async () => {
    // Read the TripPin metadata
    const xmlPath = join(__dirname, 'metadata', 'TripPinRESTierService.xml')
    const xmlContent = readFileSync(xmlPath, 'utf-8')

    // Create a mock OData instance for metadata
    const mockModel = {
      url: 'https://services.odata.org/TripPinRESTierService',
      host: 'https://services.odata.org'
    } as OData<any>

    // Parse metadata
    metadata = new Metadata(xmlContent, mockModel, 'TripPinRESTierService')

    // Generate TypeScript code
    try {
      generatedCode = generateModelTypes(metadata, {
        path: '/TripPinRESTierService',
        alias: 'TripPin'
      })
    } catch (error) {
      console.error('Generation error:', error)
      // Even if generation fails partially, we might get some output
      generatedCode = ''
    }
  })

  it('should generate Array types for collection fields', () => {
    // Check for collection fields in Person entity
    expect(generatedCode).toContain('Emails?: Array<string>')
    expect(generatedCode).toContain('Features: Array<any>') // Enum types fallback to any
    expect(generatedCode).toContain('Tags?: Array<string>')
  })

  it('should generate ComplexType references for ComplexType fields', () => {
    // ComplexTypes should now be properly referenced through the complexTypes interface
    expect(generatedCode).toContain("HomeAddress?: TTripPinOData['complexTypes']['Trippin.Location']")
    expect(generatedCode).toContain("AddressInfo?: Array<TTripPinOData['complexTypes']['Trippin.Location']>")
    expect(generatedCode).toContain("Location?: TTripPinOData['complexTypes']['Trippin.AirportLocation']")
    // Note: OccursAt and BossOffice are in derived types (Event, Manager)
    // which are not directly exposed as EntitySets, so they won't be in the generated code
  })

  it('should generate ComplexTypes interface section', () => {
    // Check that ComplexTypes are generated in the interface
    expect(generatedCode).toContain("complexTypes: {")
    expect(generatedCode).toContain("'Trippin.Location': {")
    expect(generatedCode).toContain("Address?: string")
    expect(generatedCode).toContain("City?: TTripPinOData['complexTypes']['Trippin.City']")

    expect(generatedCode).toContain("'Trippin.City': {")
    expect(generatedCode).toContain("Name?: string")
    expect(generatedCode).toContain("CountryRegion?: string")
    expect(generatedCode).toContain("Region?: string")

    expect(generatedCode).toContain("'Trippin.AirportLocation': {")
    expect(generatedCode).toContain("Loc?: any") // Edm.GeographyPoint becomes any
  })

  it('should handle non-collection primitive types correctly', () => {
    // Regular fields should not be wrapped in Array
    expect(generatedCode).toContain('UserName: string')
    expect(generatedCode).toContain('FirstName: string')
    expect(generatedCode).toContain('LastName?: string')
    expect(generatedCode).toContain('Age?: number')
    expect(generatedCode).toContain('TripId: number')
    expect(generatedCode).toContain('Budget: number')
  })

  it('should generate navigation properties correctly', () => {
    // Navigation properties with Collection
    expect(generatedCode).toMatch(/Friends\?.*Array.*Person.*record/)
    expect(generatedCode).toMatch(/Trips\?.*Array.*Trip.*record/)
    // Note: DirectReports is in Manager type which is not directly exposed as an EntitySet

    // Single navigation properties
    expect(generatedCode).toMatch(/BestFriend\?.*Person.*record.*null/)
    // Note: Airline navigation is in Flight type which is not directly exposed as an EntitySet
  })

  it('should handle enum types as "any"', () => {
    // Enum types should fallback to "any" since they're not standard Edm types
    expect(generatedCode).toContain('Gender: any')
    expect(generatedCode).toContain('FavoriteFeature: any')
  })

  it('should handle special Edm types correctly', () => {
    // Check for specific Edm types
    expect(generatedCode).toContain('ShareId: string') // Edm.Guid
    expect(generatedCode).toContain('StartsAt: string') // Edm.DateTimeOffset
    expect(generatedCode).toContain('Duration: string') // Edm.Duration (if present)
  })

  it('should generate function parameters and return types correctly', () => {
    // Check that functions with parameters are correctly generated (using FunctionImport names)
    expect(generatedCode).toContain("'GetNearestAirport': {")
    expect(generatedCode).toContain('lat:')
    expect(generatedCode).toContain('lon:')
    expect(generatedCode).toContain('number')
    expect(generatedCode).toContain("returnType: TTripPinOData['entityTypes']['Trippin.Airport']['record']")

    // Check that functions without parameters show never
    expect(generatedCode).toContain("'GetPersonWithMostFriends': {")
    expect(generatedCode).toContain('params: never')
    expect(generatedCode).toContain("returnType: TTripPinOData['entityTypes']['Trippin.Person']['record']")
  })

  it('should properly parse metadata without errors for ComplexTypes', () => {
    // The metadata should be parsed without throwing errors
    expect(() => metadata.getEntitySetsList()).not.toThrow()

    // Check that we can get entity types
    const personType = metadata.getEntityType('Trippin.Person')
    expect(personType).toBeDefined()

    // Check that fields are properly parsed with isCollection flag
    const emailsField = personType.fields.find(f => f.$Name === 'Emails')
    expect(emailsField).toBeDefined()
    expect(emailsField?.isCollection).toBe(true)
    expect(emailsField?.$Type).toBe('Edm.String') // Should be extracted type without Collection wrapper

    const userNameField = personType.fields.find(f => f.$Name === 'UserName')
    expect(userNameField).toBeDefined()
    expect(userNameField?.isCollection).toBe(false)
    expect(userNameField?.$Type).toBe('Edm.String')

    // Check ComplexType fields
    const homeAddressField = personType.fields.find(f => f.$Name === 'HomeAddress')
    expect(homeAddressField).toBeDefined()
    expect(homeAddressField?.isCollection).toBe(false)
    expect(homeAddressField?.$Type).toBe('Trippin.Location') // ComplexType

    const addressInfoField = personType.fields.find(f => f.$Name === 'AddressInfo')
    expect(addressInfoField).toBeDefined()
    expect(addressInfoField?.isCollection).toBe(true)
    expect(addressInfoField?.$Type).toBe('Trippin.Location') // Extracted from Collection(Trippin.Location)
  })
})