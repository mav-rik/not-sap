import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { vi } from 'vitest'

import { NorthwindV4 } from './generated/northwind-v4'
import { NorthwindV2 } from './generated/northwind-v2'
import { HanaV4Param } from './generated/hana-v4-param'
import { TaskServiceV4 } from './generated/task-service-v4'
import { PostFunctionsV2 } from './generated/post-functions-v2'
import { TripPinRESTierService } from './generated/TripPinRESTierService'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load metadata files
export const metadataXml = readFileSync(join(__dirname, 'metadata', 'northwind-v4.xml'), 'utf-8')
export const metadataV2Xml = readFileSync(join(__dirname, 'metadata', 'northwind-v2.xml'), 'utf-8')
export const metadataHanaXml = readFileSync(join(__dirname, 'metadata', 'hana-v4-param.xml'), 'utf-8')
export const metadataTaskServiceV4Xml = readFileSync(
  join(__dirname, 'metadata', 'task-service-v4.xml'),
  'utf-8'
)
export const metadataPostFunctionsV2Xml = readFileSync(
  join(__dirname, 'metadata', 'post-functions-v2.xml'),
  'utf-8'
)
export const metadataTripPinXml = readFileSync(join(__dirname, 'metadata', 'TripPinRESTierService.xml'), 'utf-8')

// Access the static singleton holder for resetting between tests
export const NorthwindV4Internal = NorthwindV4 as unknown as { instance?: NorthwindV4 }
export const NorthwindV2Internal = NorthwindV2 as unknown as { instance?: NorthwindV2 }
export const HanaV4ParamInternal = HanaV4Param as unknown as { instance?: HanaV4Param }
export const TaskServiceV4Internal = TaskServiceV4 as unknown as { instance?: TaskServiceV4 }
export const PostFunctionsV2Internal = PostFunctionsV2 as unknown as { instance?: PostFunctionsV2 }
export const TripPinRESTierServiceInternal = TripPinRESTierService as unknown as { instance?: TripPinRESTierService }

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
  TaskServiceV4Internal.instance = undefined
  PostFunctionsV2Internal.instance = undefined
  TripPinRESTierServiceInternal.instance = undefined
}
