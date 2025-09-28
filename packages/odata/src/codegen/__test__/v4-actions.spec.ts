import { describe, it, expect } from 'vitest'
import { Metadata } from '../../metadata'
import { generateModelTypes } from '../types-generators'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('V4 Actions Generation', () => {
  const metadataXml = readFileSync(
    join(__dirname, 'metadata', 'TripPinRESTierService.xml'),
    'utf8'
  )

  const metadata = new Metadata<any>(metadataXml, {} as any, 'TripPin')

  it('should parse V4 ActionImport correctly', () => {
    const action = metadata.getFunction('ResetDataSource')

    expect(action).toBeDefined()
    expect(action?.kind).toBe('Action')
    expect(action?.params).toEqual([])
    expect(action?.returnType.type).toBe('')
  })

  it('should parse V4 bound Action correctly', () => {
    // Note: Bound actions are not imported, they are called directly on entities
    // But we should verify the Action definition exists in metadata
    const functions = metadata.getFunctionsList()

    // ResetDataSource should be listed as it has an ActionImport
    expect(functions).toContain('ResetDataSource')
  })

  it('should generate V4 action in model interface', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'TripPin',
    })

    // Check action exists in the actions section
    expect(generatedCode).toContain("actions: {")
    expect(generatedCode).toContain("'ResetDataSource': {")

    // Check it has no parameters and void return type
    expect(generatedCode).toContain("params: never")
    expect(generatedCode).toContain("returnType: void")
  })

  it('should differentiate between functions and actions in generated code', () => {
    const generatedCode = generateModelTypes(metadata, {
      alias: 'TripPin',
    })

    // Both functions and actions sections should exist
    expect(generatedCode).toContain("functions: {")
    expect(generatedCode).toContain("actions: {")

    // Check that GetNearestAirport is a function (GET method)
    // Extract the functions section (handling nested braces)
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
    expect(functionsSection).toContain("'GetNearestAirport'")

    // Check that ResetDataSource is an action (POST method)
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
    expect(actionsSection).toContain("'ResetDataSource'")
  })
})