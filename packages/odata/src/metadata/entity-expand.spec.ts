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
      const expand = new EntityExpand(mockMetadata, 'ProductType', 'Orders')
      expect(expand.toString()).toBe('Orders')
    })

    it('should handle multiple navigation properties', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', 'Orders')
        .expand('OrderDetails')

      // Since expand returns a new instance with updated segments
      expect(expand.toString()).toBe('Orders/OrderDetails')
    })
  })

  describe('error handling', () => {
    it('should throw error for non-existent navigation property', () => {
      mockEntityType.getNavsMap = vi.fn(() => new Map())

      expect(() => {
        new EntityExpand(mockMetadata, 'ProductType', 'Orders')
          .expand('NonExistentNav')
      }).toThrow('ProductType does not have nav property "NonExistentNav"')
    })
  })

  describe('toString', () => {
    it('should return empty string for no segments', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType')
      expect(expand.toString()).toBe('')
    })

    it('should correctly format single segment', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', 'Orders')
      expect(expand.toString()).toBe('Orders')
    })

    it('should correctly format multiple segments', () => {
      const expand = new EntityExpand(mockMetadata, 'ProductType', 'Orders')
        .expand('Supplier')
      expect(expand.toString()).toBe('Orders/Supplier')
    })
  })
})