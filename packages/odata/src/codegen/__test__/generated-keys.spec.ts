import { describe, it, beforeEach, beforeAll, afterAll, expect, vi } from 'vitest'
import { NorthwindV4, TNorthwindV4 } from './generated/northwind-v4'
import {
  metadataXml,
  setupGlobalMocks,
  teardownGlobalMocks,
  resetServiceInstances,
} from './test-utils'

describe('Entity key generation', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  it('should build OData key for Products entity with single key', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const entitySet = await NorthwindV4.entitySet('Products')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Product']['keys'], string> = {
      ProductID: '42',
    }

    const key = entitySet.prepareRecordKey(keyInput)

    expect(key).toBe('Products(ProductID=42)')
  })

  it('should build correct URL for composite key in Order_Detail', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const entitySet = await NorthwindV4.entitySet('Order_Details')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Order_Detail']['keys'], string> = {
      OrderID: '10248',
      ProductID: '11',
    }

    const key = entitySet.prepareRecordKey(keyInput)

    expect(key).toBe('Order_Details(OrderID=10248,ProductID=11)')
  })

  it('should handle string keys with special characters correctly', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const entitySet = await NorthwindV4.entitySet('Categories')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Category']['keys'], string> = {
      CategoryID: "1",
    }

    const key = entitySet.prepareRecordKey(keyInput)

    expect(key).toBe("Categories(CategoryID=1)")
  })
})