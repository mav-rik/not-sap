import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { vi } from 'vitest'

import { NorthwindV4 } from './generated/northwind-v4'
import { NorthwindV2 } from './generated/northwind-v2'
import { HanaV4Param } from './generated/hana-v4-param'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load metadata files
export const metadataXml = readFileSync(join(__dirname, 'metadata', 'northwind-v4.xml'), 'utf-8')
export const metadataV2Xml = readFileSync(join(__dirname, 'metadata', 'northwind-v2.xml'), 'utf-8')
export const metadataHanaXml = readFileSync(join(__dirname, 'metadata', 'hana-v4-param.xml'), 'utf-8')

// Access the static singleton holder for resetting between tests
export const NorthwindV4Internal = NorthwindV4 as unknown as { instance?: NorthwindV4 }
export const NorthwindV2Internal = NorthwindV2 as unknown as { instance?: NorthwindV2 }
export const HanaV4ParamInternal = HanaV4Param as unknown as { instance?: HanaV4Param }

// Common test setup functions
export function setupGlobalMocks() {
  vi.stubGlobal('fetch', vi.fn())
}

export function teardownGlobalMocks() {
  vi.unstubAllGlobals()
}

export function resetServiceInstances() {
  vi.restoreAllMocks()
  NorthwindV4Internal.instance = undefined
  NorthwindV2Internal.instance = undefined
  HanaV4ParamInternal.instance = undefined
}