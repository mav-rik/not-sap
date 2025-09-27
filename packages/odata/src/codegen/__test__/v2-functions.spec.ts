import { describe, it, expect } from 'vitest'
import { Metadata } from '../../metadata'
import { generateModelTypes } from '../types-generators'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('V2 Functions Generation', () => {
  const metadataXml = readFileSync(
    join(__dirname, 'metadata', 'odata-v2.xml'),
    'utf8'
  )

  const metadata = new Metadata<any>(metadataXml, {} as any, 'ODataDemo')

  it('should parse V2 FunctionImport correctly', () => {
    const rawFunction = metadata.getRawFunction('GetProductsByRating')

    expect(rawFunction).toBeDefined()
    expect(rawFunction?.Parameter).toBeDefined()
    // V2 uses $ReturnType with $ prefix
    expect(rawFunction?.$ReturnType).toBeDefined()
    expect(rawFunction?.$ReturnType).toBe('Collection(ODataDemo.Product)')
  })

  it('should generate V2 function parameters and return types', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'ODataDemo',
    })

    // Check function exists
    expect(generatedCode).toContain("'GetProductsByRating': {")

    // Check parameters are generated as an object
    expect(generatedCode).toContain('params: {')
    expect(generatedCode).toContain('rating: number')

    // Check return type is generated as array of Products
    expect(generatedCode).toContain('returnType:')
    expect(generatedCode).toContain("Array<TODataDemoOData['entityTypes']['ODataDemo.Product']['record']>")
  })
})