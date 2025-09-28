import { describe, it, expect } from 'vitest'
import { Metadata } from '../../metadata'
import { generateModelTypes } from '../types-generators'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('V2 Actions Generation', () => {
  const metadataXml = readFileSync(
    join(__dirname, 'metadata', 'odata-v2-with-actions.xml'),
    'utf8'
  )

  const metadata = new Metadata<any>(metadataXml, {} as any, 'ODataDemo')

  it('should identify V2 GET FunctionImport as Function', () => {
    const fn = metadata.getFunction('GetProductsByRating')

    expect(fn).toBeDefined()
    expect(fn?.kind).toBe('Function')
    expect(fn?.params).toHaveLength(1)
    expect(fn?.params[0].$Name).toBe('rating')
    expect(fn?.returnType.type).toBe('Collection(ODataDemo.Product)')
  })

  it('should identify V2 POST FunctionImport as Action', () => {
    const action = metadata.getFunction('CreateProduct')

    expect(action).toBeDefined()
    expect(action?.kind).toBe('Action')
    expect(action?.params).toHaveLength(3)
    expect(action?.params[0].$Name).toBe('Name')
    expect(action?.params[1].$Name).toBe('Rating')
    expect(action?.params[2].$Name).toBe('Price')
    expect(action?.returnType.type).toBe('ODataDemo.Product')
  })

  it('should handle V2 Action with no return type', () => {
    const action = metadata.getFunction('ResetDatabase')

    expect(action).toBeDefined()
    expect(action?.kind).toBe('Action')
    expect(action?.params).toHaveLength(0)
    expect(action?.returnType?.type).toBeFalsy() // Empty string or undefined
  })

  it('should handle V2 Action with complex type parameter', () => {
    const action = metadata.getFunction('UpdateProductAddress')

    expect(action).toBeDefined()
    expect(action?.kind).toBe('Action')
    expect(action?.params).toHaveLength(2)
    expect(action?.params[0].$Name).toBe('ProductID')
    expect(action?.params[0].$Type).toBe('Edm.Int32')
    expect(action?.params[1].$Name).toBe('Address')
    expect(action?.params[1].$Type).toBe('ODataDemo.Address')
    expect(action?.returnType.type).toBe('Edm.Boolean')
  })

  it('should generate V2 functions and actions in separate sections', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'ODataDemo',
    })

    // Both functions and actions sections should exist
    expect(generatedCode).toContain("functions: {")
    expect(generatedCode).toContain("actions: {")

    // Check that GetProductsByRating is in functions section
    const functionsIndex = generatedCode.indexOf('functions: {')
    expect(functionsIndex).toBeGreaterThan(-1)
    // Look for the matching close brace
    let braceCount = 1
    let i = functionsIndex + 'functions: {'.length
    while (braceCount > 0 && i < generatedCode.length) {
      if (generatedCode[i] === '{') braceCount++
      if (generatedCode[i] === '}') braceCount--
      i++
    }
    const functionsSection = generatedCode.slice(functionsIndex, i)
    expect(functionsSection).toContain("'GetProductsByRating'")

    // Check that CreateProduct is in actions section
    const actionsIndex = generatedCode.indexOf('actions: {')
    expect(actionsIndex).toBeGreaterThan(-1)
    braceCount = 1
    i = actionsIndex + 'actions: {'.length
    while (braceCount > 0 && i < generatedCode.length) {
      if (generatedCode[i] === '{') braceCount++
      if (generatedCode[i] === '}') braceCount--
      i++
    }
    const actionsSection = generatedCode.slice(actionsIndex, i)
    expect(actionsSection).toContain("'CreateProduct'")
    expect(actionsSection).toContain("'ResetDatabase'")
    expect(actionsSection).toContain("'UpdateProductAddress'")
  })

  it('should generate correct parameter types for V2 actions', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'ODataDemo',
    })

    // Check CreateProduct parameters
    expect(generatedCode).toContain("'CreateProduct': {")
    expect(generatedCode).toMatch(/'CreateProduct':\s*{\s*params:\s*{[^}]*Name:\s*string/s)
    expect(generatedCode).toMatch(/'CreateProduct':\s*{\s*params:\s*{[^}]*Rating:\s*number/s)
    expect(generatedCode).toMatch(/'CreateProduct':\s*{\s*params:\s*{[^}]*Price:\s*number/s)

    // Check UpdateProductAddress with complex type
    expect(generatedCode).toContain("'UpdateProductAddress': {")
    expect(generatedCode).toMatch(/'UpdateProductAddress':\s*{\s*params:\s*{[^}]*ProductID:\s*number/s)
    expect(generatedCode).toMatch(/'UpdateProductAddress':\s*{\s*params:\s*{[^}]*Address:\s*TODataDemoOData\['complexTypes'\]\['ODataDemo\.Address'\]/s)
  })

  it('should generate correct return types for V2 actions', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'ODataDemo',
    })

    // CreateProduct returns an entity (possibly nullable)
    expect(generatedCode).toMatch(/'CreateProduct'.*?returnType:\s*TODataDemoOData\['entityTypes'\]\['ODataDemo\.Product'\]\['record'\]/s)

    // ResetDatabase returns void
    expect(generatedCode).toMatch(/'ResetDatabase'.*?returnType:\s*void/s)

    // UpdateProductAddress returns boolean (possibly nullable)
    expect(generatedCode).toMatch(/'UpdateProductAddress'.*?returnType:\s*boolean/s)
  })
})