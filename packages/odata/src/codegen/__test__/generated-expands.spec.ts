import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from 'vitest'
import { NorthwindV2, TNorthwindV2 } from './generated/northwind-v2'
import {
  metadataV2Xml,
  setupGlobalMocks,
  teardownGlobalMocks,
  resetServiceInstances,
} from './test-utils'

describe('Generated expands', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  it('should create nested expand chain with composite keys', async () => {
    const service = NorthwindV2.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

    const entitySet = await NorthwindV2.entitySet('Products')

    const orderDetailKey: Record<TNorthwindV2['NorthwindModel']['Order_Detail']['keys'], number> = {
      OrderID: 1,
      ProductID: 2,
    }

    const expandPath = entitySet
      .expand('Order_Details')
      .withKey(orderDetailKey)
      .expand('Order')
      .expand('Employee')
      .toString()

    expect(expandPath).toBe('Order_Details(OrderID=1,ProductID=2)/Order/Employee')
  })

  it('should support chaining expands across to-many and to-one relationships', async () => {
    const service = NorthwindV2.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

    const entitySet = await NorthwindV2.entitySet('Orders')

    const detailKey: Record<TNorthwindV2['NorthwindModel']['Order_Detail']['keys'], number> = {
      OrderID: 42,
      ProductID: 7,
    }

    const expandPath = entitySet
      .expand('Order_Details')
      .withKey(detailKey)
      .expand('Product')
      .expand('Category')
      .toString()

    expect(expandPath).toBe('Order_Details(OrderID=42,ProductID=7)/Product/Category')
  })

  it('should format string keys when expanding collections', async () => {
    const service = NorthwindV2.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

    const entitySet = await NorthwindV2.entitySet('Customers')

    const demographicKey: Record<TNorthwindV2['NorthwindModel']['CustomerDemographic']['keys'], string> = {
      CustomerTypeID: 'Retail',
    }

    const customerKey: Record<TNorthwindV2['NorthwindModel']['Customer']['keys'], string> = {
      CustomerID: 'ALFKI',
    }

    const expandPath = entitySet
      .expand('CustomerDemographics')
      .withKey(demographicKey)
      .expand('Customers')
      .withKey(customerKey)
      .toString()

    expect(expandPath).toBe("CustomerDemographics('Retail')/Customers('ALFKI')")
  })
})
