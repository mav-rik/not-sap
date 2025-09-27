import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EntityExpand } from './entity-expand'
import { Metadata } from './metadata'
import { TOdataDummyInterface } from '../odata'

describe('EntityExpand', () => {
  let mockMetadata: any
  let mockEntityType: any

  beforeEach(() => {
    // Mock entity type with fields and navigation properties
    mockEntityType = {
      keys: ['ProductId'],
      fieldsMap: new Map([
        ['ProductId', {
          $Name: 'ProductId',
          $Type: 'Edm.Int32',
          fromJson: {
            toFilter: (v: any) => String(v)
          }
        }],
        ['OrderId', {
          $Name: 'OrderId',
          $Type: 'Edm.Int32',
          fromJson: {
            toFilter: (v: any) => String(v)
          }
        }]
      ]),
      getNavsMap: vi.fn(() => new Map([
        ['Orders', {
          $Name: 'Orders',
          $Type: 'OrderType',
          toMany: true
        }],
        ['Supplier', {
          $Name: 'Supplier',
          $Type: 'SupplierType',
          toMany: false
        }],
        ['OrderDetails', {
          $Name: 'OrderDetails',
          $Type: 'OrderDetailsType',
          toMany: true
        }]
      ]))
    }

    // Mock metadata
    mockMetadata = {
      getEntityType: vi.fn(() => mockEntityType)
    }
  })

  describe('basic expand', () => {
    it('should create expand for a single navigation property', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', { property: 'Orders'})
      expect(expand.toString()).toBe('Orders')
    })

    it('should handle multiple navigation properties', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', { property: 'Orders'})
        .expand('OrderDetails')

      // Since expand returns a new instance with updated segments
      expect(expand.toString()).toBe('Orders/OrderDetails')
    })
  })

  describe('error handling', () => {
    it('should throw error for non-existent navigation property', () => {
      mockEntityType.getNavsMap = vi.fn(() => new Map())

      expect(() => {
        new EntityExpand(mockMetadata, 'ProductType', { property: 'Orders'})
          .expand('NonExistentNav')
      }).toThrow('ProductType does not have nav property "NonExistentNav"')
    })
  })

  describe('toString', () => {
    it('should correctly format single segment', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', { property: 'Orders'})
      expect(expand.toString()).toBe('Orders')
    })

    it('should correctly format multiple segments', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', { property: 'Orders'})
        .expand('Supplier')
      expect(expand.toString()).toBe('Orders/Supplier')
    })
  })

  describe('V2 rendering with select', () => {
    beforeEach(() => {
      mockMetadata.isV4 = false
      mockEntityType.renderFilter = vi.fn((filter, operator, prefix) => {
        const filterStr = 'ProductId eq 1'
        return prefix ? `${prefix}/${filterStr}` : filterStr
      })
    })

    it('should render selectV2 with prefixed fields', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', {
        property: 'Orders',
        params: { select: ['OrderId', 'OrderDate'] }
      })

      const rendered = expand.render()
      expect(rendered.expandString).toBe('Orders')
      expect(rendered.selectV2).toEqual(['Orders/OrderId', 'Orders/OrderDate'])
    })

    it('should handle nested expands with select', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', {
        property: 'Orders',
        params: { select: ['OrderId'] }
      }).expand('Supplier', { select: ['Name', 'Country'] })

      const rendered = expand.render()
      expect(rendered.expandString).toBe('Orders/Supplier')
      expect(rendered.selectV2).toEqual(['Orders/OrderId', 'Orders/Supplier/Name', 'Orders/Supplier/Country'])
    })

    it('should handle expand without select params', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', {
        property: 'Orders'
      })

      const rendered = expand.render()
      expect(rendered.expandString).toBe('Orders')
      expect(rendered.selectV2).toBeUndefined()
    })
  })
})