import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from 'vitest'
import { NorthwindV2 } from './generated/northwind-v2'
import { NorthwindV4 } from './generated/northwind-v4'
import {
  metadataV2Xml,
  metadataXml,
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

  describe('V2 expands', () => {
    it('should create simple nested expand chain', async () => {
      const service = NorthwindV2.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

      const entitySet = await NorthwindV2.entitySet('Products')
      const expand = entitySet
        .expand('Order_Details')
        .expand('Order')
        .expand('Employee')

      const expandString = expand.toString()
      expect(expandString).toBe('Order_Details/Order/Employee')
    })

    it('should render filters with navigation path prefixes', async () => {
      const service = NorthwindV2.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

      const entitySet = await NorthwindV2.entitySet('Orders')
      const expand = entitySet
        .expand('Order_Details', { filter: { Quantity: { gt: 10 } } })
        .expand('Product', { filter: { ProductName: { eq: 'Chai' } } })

      const {expandString, filterV2} = expand.render()
      expect(expandString).toBe('Order_Details/Product')
      expect(filterV2).toBe("Order_Details/Quantity gt 10 and Order_Details/Product/ProductName eq 'Chai'")

      // For V2, filters are rendered separately and would be applied at the root level
      // The filterV2 property is available on the rendered object but not exposed via toString
    })
  })

  describe('V4 expands', () => {
    it('should create nested expand with inline query options', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')
      const expand = entitySet
        .expand('Order_Details', {
          filter: { Quantity: { gt: 10 } },
          select: ['OrderID', 'Quantity']
        })
        .expand('Order')
        .expand('Employee', { top: 5 })

      const expandString = expand.toString()
      expect(expandString).toBe(
        'Order_Details($filter=Quantity gt 10;$select=OrderID,Quantity;$expand=Order($expand=Employee($top=5)))'
      )
    })

    it('should handle apply operations in V4', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Orders')
      const expand = entitySet
        .expand('Order_Details', {
          apply: {
            filters: { Quantity: { gt: 5 } }
          }
        })

      const expandString = expand.toString()
      expect(expandString).toBe(
        'Order_Details($apply=filter(Quantity gt 5))'
      )
    })

    it('should handle deeply nested expands with params', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Customers')
      const expand = entitySet
        .expand('Orders', { top: 10 })
        .expand('Order_Details', { skip: 5 })
        .expand('Product')
        .expand('Category', { select: ['CategoryName'] })

      const expandString = expand.toString()
      expect(expandString).toBe(
        'Orders($top=10;$expand=Order_Details($skip=5;$expand=Product($expand=Category($select=CategoryName))))'
      )
    })
  })
})
