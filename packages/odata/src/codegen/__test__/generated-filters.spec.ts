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

describe('Filter generation', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  describe('Basic filter operations', () => {
    it('should generate correct $filter for single condition', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: { ProductID: { eq: '42' } }
      })

      expect(query.entitySet).toBe('Products')
      expect(query.params.$filter).toBe('ProductID eq 42')
    })

    it('should generate correct $filter for multiple conditions (implicit AND)', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: [
          { ProductID: { gt: '10' } },
          { UnitPrice: { lt: '50' } }
        ]
      })

      expect(query.entitySet).toBe('Products')
      expect(query.params.$filter).toBe('(ProductID gt 10 and UnitPrice lt 50)')
    })

    it('should handle object filter with multiple fields (implicit AND)', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: {
          ProductID: { gt: '10' },
          ProductName: 'Abc'
        }
      })

      expect(query.entitySet).toBe('Products')
      expect(query.params.$filter).toBe("(ProductID gt 10 and ProductName eq 'Abc')")
    })
  })

  describe('String filter functions', () => {
    it('should handle contains filter', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: { ProductName: { contains: 'Chai' } }
      })

      expect(query.params.$filter).toBe("contains(ProductName,'Chai')")
    })

    it('should handle startsWith filter', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: { ProductName: { starts: 'Ch' } }
      })

      expect(query.params.$filter).toBe("startswith(ProductName,'Ch')")
    })

    it('should handle endsWith filter', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: { ProductName: { ends: 'ea' } }
      })

      expect(query.params.$filter).toBe("endswith(ProductName,'ea')")
    })
  })

  describe('Comparison operators', () => {
    it('should handle all comparison operators', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      // Less than
      let query = entitySet.prepareQuery({
        filter: { UnitPrice: { lt: '10' } }
      })
      expect(query.params.$filter).toBe("UnitPrice lt 10")

      // Less than or equal
      query = entitySet.prepareQuery({
        filter: { UnitPrice: { le: '10' } }
      })
      expect(query.params.$filter).toBe("UnitPrice le 10")

      // Greater than
      query = entitySet.prepareQuery({
        filter: { UnitPrice: { gt: '50' } }
      })
      expect(query.params.$filter).toBe("UnitPrice gt 50")

      // Greater than or equal
      query = entitySet.prepareQuery({
        filter: { UnitPrice: { ge: '50' } }
      })
      expect(query.params.$filter).toBe("UnitPrice ge 50")

      // Equal
      query = entitySet.prepareQuery({
        filter: { ProductID: { eq: '42' } }
      })
      expect(query.params.$filter).toBe("ProductID eq 42")

      // Not equal
      query = entitySet.prepareQuery({
        filter: { ProductID: { notEq: '13' } }
      })
      expect(query.params.$filter).toBe("ProductID ne 13")
    })

    it('should handle between operator', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: { UnitPrice: { bw: ['10', '50'] } }
      })

      expect(query.params.$filter).toBe("(UnitPrice ge 10 and UnitPrice le 50)")
    })
  })

  describe('Logical operators', () => {
    it('should handle OR conditions using $or operator', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: {
          $or: [
            { ProductID: { eq: '1' } },
            { ProductID: { eq: '2' } },
            { ProductID: { eq: '3' } }
          ]
        }
      })

      expect(query.params.$filter).toBe('(ProductID eq 1 or ProductID eq 2 or ProductID eq 3)')
    })

    it('should handle AND conditions using $and operator', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: {
          $and: [
            { ProductID: { gt: '10' } },
            { UnitPrice: { lt: '50' } },
            { Discontinued: { eq: false } }
          ]
        }
      })

      expect(query.params.$filter).toBe('(ProductID gt 10 and UnitPrice lt 50 and Discontinued eq false)')
    })

    it('should handle complex nested AND/OR conditions', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: [
          {
            $or: [
              { CategoryID: { eq: '1' } },
              { CategoryID: { eq: '2' } }
            ]
          },
          {
            $and: [
              { UnitPrice: { gt: '10' } },
              { Discontinued: { eq: false } }
            ]
          }
        ]
      })

      expect(query.params.$filter).toBe('((CategoryID eq 1 or CategoryID eq 2) and (UnitPrice gt 10 and Discontinued eq false))')
    })

    it('should handle deeply nested logical operators', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      const query = entitySet.prepareQuery({
        filter: {
          $or: [
            {
              $and: [
                {
                  $or: [
                    { CategoryID: { eq: '1' } },
                    { CategoryID: { eq: '2' } }
                  ]
                },
                { UnitPrice: { gt: '10' } }
              ]
            },
            {
              $and: [
                { CategoryID: { eq: '3' } },
                { UnitPrice: { lt: '5' } }
              ]
            }
          ]
        }
      })

      expect(query.params.$filter).toBe('(((CategoryID eq 1 or CategoryID eq 2) and UnitPrice gt 10) or (CategoryID eq 3 and UnitPrice lt 5))')
    })
  })

  describe('Special operators', () => {
    it('should handle empty and notEmpty operators', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      // Test empty
      let query = entitySet.prepareQuery({
        filter: { ProductName: { empty: true } }
      })
      expect(query.params.$filter).toBe("(ProductName eq '' or ProductName eq null)")

      // Test notEmpty
      query = entitySet.prepareQuery({
        filter: { ProductName: { notEmpty: true } }
      })
      expect(query.params.$filter).toBe("(ProductName ne '' and ProductName ne null)")
    })

    it('should handle negated string operators', async () => {
      const service = NorthwindV4.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const entitySet = await NorthwindV4.entitySet('Products')

      // Test notContains
      let query = entitySet.prepareQuery({
        filter: { ProductName: { notContains: 'Coffee' } }
      })
      expect(query.params.$filter).toBe("not contains(ProductName,'Coffee')")

      // Test notStarts
      query = entitySet.prepareQuery({
        filter: { ProductName: { notStarts: 'Ch' } }
      })
      expect(query.params.$filter).toBe("not startswith(ProductName,'Ch')")

      // Test notEnds
      query = entitySet.prepareQuery({
        filter: { ProductName: { notEnds: 'ea' } }
      })
      expect(query.params.$filter).toBe("not endswith(ProductName,'ea')")
    })
  })

  describe('Date filters', () => {
    it('should handle date filters correctly for V2', async () => {
      const service = NorthwindV2.getInstance()
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

      const entitySet = await NorthwindV2.entitySet('Orders')

      const query = entitySet.prepareQuery({
        filter: {
          OrderDate: { gt: '2024-01-01' }
        }
      })

      expect(query.entitySet).toBe('Orders')
      // For V2, dates should be formatted as datetime
      expect(query.params.$filter).toMatch(/OrderDate gt datetime'2024-01-01/)
    })
  })
})