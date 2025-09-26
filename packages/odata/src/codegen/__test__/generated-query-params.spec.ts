import { describe, it, beforeEach, beforeAll, afterAll, expect, vi } from 'vitest'
import { NorthwindV4 } from './generated/northwind-v4'
import { NorthwindV2 } from './generated/northwind-v2'
import {
  metadataXml,
  metadataV2Xml,
  setupGlobalMocks,
  teardownGlobalMocks,
  resetServiceInstances,
} from './test-utils'

describe('Query parameters generation', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  describe('Sorting', () => {
    it('should generate correct $orderby for single field', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        sorters: ['ProductName']
      })

      expect(query.params.$orderby).toBe('ProductName')
    })

    it('should generate correct $orderby for multiple fields with directions', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        sorters: [
          { name: 'CategoryID', desc: false },
          { name: 'ProductName', desc: true }
        ]
      })

      expect(query.params.$orderby).toBe('CategoryID asc,ProductName desc')
    })
  })

  describe('Field selection', () => {
    it('should generate correct $select parameter', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        select: ['ProductID', 'ProductName', 'UnitPrice']
      })

      expect(query.params.$select).toBe('ProductID,ProductName,UnitPrice')
    })
  })

  describe('Pagination', () => {
    it('should generate correct $top and $skip parameters', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        top: 20,
        skip: 40
      })

      expect(query.params.$top).toBe(20)
      expect(query.params.$skip).toBe(40)
    })

    it('should default $top to 1000 when not specified', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({})

      expect(query.params.$top).toBe(1000)
    })
  })

  describe('Count parameter', () => {
    it('should handle $count parameter for V4', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        inlinecount: 'allpages' as const
      })

      expect(query.entitySet).toBe('Products')
      // V4 uses $count when inlinecount is set
      expect(query.params.$count).toBe('true')
      expect(query.params.$inlinecount).toBeUndefined()
    })

    it('should handle $inlinecount parameter for V2', async () => {
      const service = NorthwindV2.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

      const entitySet = await NorthwindV2.entitySet('Products')

      const query = entitySet.prepareQuery({
        inlinecount: 'allpages' as const
      })

      expect(query.entitySet).toBe('Products')
      // V2 uses $inlinecount instead of $count
      expect(query.params.$inlinecount).toBe('allpages')
      expect(query.params.$count).toBeUndefined()
    })
  })

  describe('Combined parameters', () => {
    it('should combine multiple query parameters correctly', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        top: 10,
        skip: 20,
        filter: [
          { CategoryID: { eq: '1' } },
          { Discontinued: { eq: false } }
        ],
        select: ['ProductID', 'ProductName', 'UnitPrice'],
        sorters: [
          { name: 'ProductName', desc: false }
        ]
      })

      expect(query.entitySet).toBe('Products')
      expect(query.params.$top).toBe(10)
      expect(query.params.$skip).toBe(20)
      expect(query.params.$filter).toBe('(CategoryID eq 1 and Discontinued eq false)')
      expect(query.params.$select).toBe('ProductID,ProductName,UnitPrice')
      expect(query.params.$orderby).toBe('ProductName asc')
    })

    it('should handle combining multiple filter functions', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: [
          { ProductName: { contains: 'Coffee' } },
          { UnitPrice: { gt: '10' } },
          { UnitsInStock: { le: '50' } },
          { Discontinued: { eq: false } }
        ]
      })

      expect(query.params.$filter).toBe("(contains(ProductName,'Coffee') and UnitPrice gt 10 and UnitsInStock le 50 and Discontinued eq false)")
    })

    it('should handle multiple conditions on same field with OR', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: {
          $or: [
            { ProductName: { contains: 'Chai' } },
            { ProductName: { contains: 'Coffee' } },
            { ProductName: { contains: 'Tea' } }
          ]
        }
      })

      expect(query.params.$filter).toBe("(contains(ProductName,'Chai') or contains(ProductName,'Coffee') or contains(ProductName,'Tea'))")
    })
  })
})