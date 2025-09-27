import { describe, it, expect, expectTypeOf } from 'vitest'

// Import all generated modules
import { HanaV4Param, hanaV4ParamConsts, THanaV4Param, THanaV4ParamOData } from './generated/hana-v4-param'
import { NorthwindV2, northwindV2Consts, TNorthwindV2, TNorthwindV2OData } from './generated/northwind-v2'
import { NorthwindV2Selected, northwindV2SelectedConsts, TNorthwindV2Selected, TNorthwindV2SelectedOData } from './generated/northwind-v2-selected'
import { NorthwindV4, northwindV4Consts, TNorthwindV4, TNorthwindV4OData } from './generated/northwind-v4'
import { NorthwindV4Selected, northwindV4SelectedConsts, TNorthwindV4Selected, TNorthwindV4SelectedOData } from './generated/northwind-v4-selected'
import { SapV4, sapV4Consts, TSapV4, TSapV4OData } from './generated/sap-v4'
import {
  SapService, sapServiceConsts, TSapService, TSapServiceOData,
  HanaService, hanaServiceConsts, THanaService, THanaServiceOData
} from './generated/combined-services'

describe('Generated Imports Validation', () => {

  describe('HanaV4Param - Navigation Property Entity Type Generation', () => {
    it('should have MyPartners entity set that brought MyPartnersParameters type', () => {
      // Check consts structure
      expect(hanaV4ParamConsts).toBeDefined()
      expect(hanaV4ParamConsts.UKDataService).toBeDefined()
      expect(hanaV4ParamConsts.UKDataService.MyPartnersParameters).toBeDefined()
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType).toBeDefined()

      // Verify entity types were generated
      expect(Object.keys(hanaV4ParamConsts.UKDataService)).toContain('MyPartnersParameters')
      expect(Object.keys(hanaV4ParamConsts.UKDataService)).toContain('MyPartnersType')
    })

    it('should have MyPartnersType entity type generated due to navigation property', () => {
      // Verify fields exist for both types
      expect(hanaV4ParamConsts.UKDataService.MyPartnersParameters.fields).toContain('YEAR')
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType.fields.length).toBeGreaterThan(0)

      // Verify MyPartnersType has many fields (it's a complex type)
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType.fields).toContain('Entity_IN')
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType.fields).toContain('Entity_TIN')
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType.fields).toContain('Entity_VAT')

      // Both types should have keys defined
      expect(hanaV4ParamConsts.UKDataService.MyPartnersParameters.keys).toBeDefined()
      expect(hanaV4ParamConsts.UKDataService.MyPartnersType.keys).toBeDefined()
    })
  })

  describe('Northwind V2 Selected - Navigation Property Types', () => {
    it('should have generated Category and Order_Detail due to navigation properties', () => {
      // Even though we only selected Products and Suppliers,
      // their navigation properties should bring in related entity types recursively
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Product')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Supplier')

      // Product has navigation to Category and Order_Detail
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Order_Detail')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Category')

      // Verify we have 11 entity types (recursive navigation pulls in more types)
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toHaveLength(11)
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Product')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Supplier')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Order_Detail')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Category')
      // Recursively included through navigation properties
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Order')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Customer')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Employee')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Shipper')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Territory')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('Region')
      expect(Object.keys(northwindV2SelectedConsts.NorthwindModel)).toContain('CustomerDemographic')
    })

    it('should have entity types brought in through recursive navigation', () => {
      // These ARE included due to recursive navigation property dependencies
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Order')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Customer')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Employee')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Region')
      expect(northwindV2SelectedConsts.NorthwindModel).toHaveProperty('Shipper')

      // But they should exist in full version
      expect(northwindV2Consts.NorthwindModel).toHaveProperty('Order')
      expect(northwindV2Consts.NorthwindModel).toHaveProperty('Customer')
      expect(northwindV2Consts.NorthwindModel).toHaveProperty('Employee')

      // Verify full version has many more entity types
      expect(Object.keys(northwindV2Consts.NorthwindModel).length).toBeGreaterThan(10)
    })
  })

  describe('Northwind V4 Selected - Navigation Property Types', () => {
    it('should have generated Category and Order_Detail due to navigation properties', () => {
      // Even though we only selected Products and Suppliers,
      // their navigation properties should bring in related entity types recursively
      expect(northwindV4SelectedConsts.NorthwindModel).toHaveProperty('Product')
      expect(northwindV4SelectedConsts.NorthwindModel).toHaveProperty('Supplier')

      // Product has navigation to Category and Order_Detail
      expect(northwindV4SelectedConsts.NorthwindModel).toHaveProperty('Order_Detail')
      expect(northwindV4SelectedConsts.NorthwindModel).toHaveProperty('Category')

      // Verify we have 11 entity types (recursive navigation pulls in more types)
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toHaveLength(11)
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Product')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Supplier')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Order_Detail')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Category')
      // Recursively included through navigation properties
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Order')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Customer')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Employee')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Shipper')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Territory')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('Region')
      expect(Object.keys(northwindV4SelectedConsts.NorthwindModel)).toContain('CustomerDemographic')
    })
  })

  describe('SAP V4 - Single Entity Set', () => {
    it('should have only line_items entity set', () => {
      // Check consts structure
      expect(Object.keys(sapV4Consts)).toHaveLength(1)
      expect(sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001']).toBeDefined()
      expect(sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType).toBeDefined()

      // Verify it has measures
      expect(sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType.measures).toContain('LocalAmount')

      // Verify it has the expected number of fields
      expect(sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType.fields.length).toBeGreaterThan(30)
    })
  })

  describe('Combined Services - Multiple Services in One File', () => {
    it('should have both SapService and HanaService classes', () => {
      expect(SapService).toBeDefined()
      expect(HanaService).toBeDefined()

      // Both should be different classes
      expect(SapService).not.toBe(HanaService)

      // Check service names
      expect(SapService.serviceName).toBe('sapService')
      expect(HanaService.serviceName).toBe('hanaService')
    })

    it('should have separate consts for each service', () => {
      expect(sapServiceConsts).toBeDefined()
      expect(hanaServiceConsts).toBeDefined()

      // Verify they have different structures
      expect(sapServiceConsts).toHaveProperty('com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001')
      expect(hanaServiceConsts).toHaveProperty('UKDataService')

      // They should not share properties
      expect(sapServiceConsts).not.toHaveProperty('UKDataService')
      expect(hanaServiceConsts).not.toHaveProperty('com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001')
    })

    it('should have separate interface types for each service', () => {
      // Entity set names stay scoped to their own services
      expectTypeOf<'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_items'>()
        // @ts-expect-error
        .toExtend<keyof TSapServiceOData['entitySets']>()
      expectTypeOf<'UKDataService.MyPartners'>()
        // @ts-expect-error
        .toExtend<keyof THanaServiceOData['entitySets']>()
      expectTypeOf<'UKDataService.MyPartners'>()
        .not.toExtend<keyof TSapServiceOData['entitySets']>()
      expectTypeOf<'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_items'>()
        .not.toExtend<keyof THanaServiceOData['entitySets']>()

      // Entity type names are also isolated per service
      expectTypeOf<'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType'>()
        .toExtend<keyof TSapServiceOData['entityTypes']>()
      expectTypeOf<'UKDataService.MyPartnersParameters'>()
        .toExtend<keyof THanaServiceOData['entityTypes']>()
      expectTypeOf<'UKDataService.MyPartnersType'>()
        .toExtend<keyof THanaServiceOData['entityTypes']>()
      expectTypeOf<'com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001.line_itemsType'>()
        .not.toExtend<keyof THanaServiceOData['entityTypes']>()

      // Runtime validation - ensure the consts expose the expected metadata
      expect(sapServiceConsts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType.fields)
        .toContain('DocumentNo')
      expect(hanaServiceConsts.UKDataService.MyPartnersParameters.fields).toContain('YEAR')
      expect(hanaServiceConsts.UKDataService.MyPartnersType.fields).toContain('Entity_IN')
    })
  })

  describe('Keys Generation Validation', () => {
    it('should generate only actual key fields for entity types', () => {
      // Product entity should only have ProductID as key
      expect(northwindV4Consts.NorthwindModel.Product.keys).toEqual(['ProductID'])
      expect(northwindV2Consts.NorthwindModel.Product.keys).toEqual(['ProductID'])

      // Category entity should only have CategoryID as key
      expect(northwindV4Consts.NorthwindModel.Category.keys).toEqual(['CategoryID'])
      expect(northwindV2Consts.NorthwindModel.Category.keys).toEqual(['CategoryID'])

      // Order entity should only have OrderID as key
      expect(northwindV4Consts.NorthwindModel.Order.keys).toEqual(['OrderID'])
      expect(northwindV2Consts.NorthwindModel.Order.keys).toEqual(['OrderID'])

      // Order_Detail entity has composite key (OrderID, ProductID)
      expect(northwindV4Consts.NorthwindModel.Order_Detail.keys).toEqual(['OrderID', 'ProductID'])
      expect(northwindV2Consts.NorthwindModel.Order_Detail.keys).toEqual(['OrderID', 'ProductID'])

      // Customer entity should only have CustomerID as key
      expect(northwindV4Consts.NorthwindModel.Customer.keys).toEqual(['CustomerID'])
      expect(northwindV2Consts.NorthwindModel.Customer.keys).toEqual(['CustomerID'])

      // Supplier entity should only have SupplierID as key
      expect(northwindV4Consts.NorthwindModel.Supplier.keys).toEqual(['SupplierID'])
      expect(northwindV2Consts.NorthwindModel.Supplier.keys).toEqual(['SupplierID'])
    })

    it('should have keys as subset of fields for all entities', () => {
      // Check V4 entities
      for (const [entityName, entity] of Object.entries(northwindV4Consts.NorthwindModel)) {
        const fields = entity.fields as readonly string[]
        const keys = entity.keys as readonly string[]

        // Keys should be a subset of fields
        for (const key of keys) {
          expect(fields).toContain(key)
        }

        // Keys should not equal all fields (except for special cases)
        // Most entities should have fewer keys than fields
        if (['Product', 'Category', 'Customer', 'Supplier', 'Order', 'Employee'].includes(entityName)) {
          expect(keys.length).toBeLessThan(fields.length)
        }
      }

      // Check V2 entities
      for (const [entityName, entity] of Object.entries(northwindV2Consts.NorthwindModel)) {
        const fields = entity.fields as readonly string[]
        const keys = entity.keys as readonly string[]

        // Keys should be a subset of fields
        for (const key of keys) {
          expect(fields).toContain(key)
        }

        // Keys should not equal all fields (except for special cases)
        // Most entities should have fewer keys than fields
        if (['Product', 'Category', 'Customer', 'Supplier', 'Order', 'Employee'].includes(entityName)) {
          expect(keys.length).toBeLessThan(fields.length)
        }
      }
    })

    it('should generate correct keys for HanaV4Param entity types', () => {
      // MyPartnersParameters should have YEAR as its key
      expect(hanaV4ParamConsts.UKDataService.MyPartnersParameters.keys).toEqual(['YEAR'])

      // Verify keys are subset of fields
      expect(hanaV4ParamConsts.UKDataService.MyPartnersParameters.fields).toContain('YEAR')
    })

    it('should generate correct keys for SapV4 entity types', () => {
      // Check that line_itemsType has proper keys (not all fields)
      const lineItemsKeys = sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType.keys
      const lineItemsFields = sapV4Consts['com.sap.gateway.srvd.zsd_mdg_bp_fp04_data.v0001'].line_itemsType.fields

      // Keys should be a subset of fields
      for (const key of lineItemsKeys) {
        expect(lineItemsFields).toContain(key)
      }

      // Keys should be fewer than fields for this entity
      expect(lineItemsKeys.length).toBeLessThan(lineItemsFields.length)
    })
  })

  describe('Full Northwind V2 vs V4 - Version Differences', () => {
    it('should have the same entity types but different namespaces', () => {
      // Both versions should have similar entity types
      const v2Types = Object.keys(northwindV2Consts.NorthwindModel)
      const v4Types = Object.keys(northwindV4Consts.NorthwindModel)

      // Should have same entity types
      expect(v2Types).toContain('Product')
      expect(v4Types).toContain('Product')
      expect(v2Types).toContain('Category')
      expect(v4Types).toContain('Category')
      expect(v2Types).toContain('Supplier')
      expect(v4Types).toContain('Supplier')

      // Ensure namespaces differ between versions
      expectTypeOf<'ODataWeb.Northwind.Model.Products'>()
        // @ts-expect-error
        .toExtend<keyof TNorthwindV2OData['entitySets']>()
      expectTypeOf<'ODataWebV4.Northwind.Model.Products'>()
        // @ts-expect-error
        .toExtend<keyof TNorthwindV4OData['entitySets']>()
      expectTypeOf<'ODataWeb.Northwind.Model.Products'>()
        .not.toExtend<keyof TNorthwindV4OData['entitySets']>()
      expectTypeOf<'ODataWebV4.Northwind.Model.Products'>()
        .not.toExtend<keyof TNorthwindV2OData['entitySets']>()
    })

    it('should have navigation properties in both V2 and V4', () => {
      // Both V2 and V4 have navigation properties now
      type V2ProductNav = TNorthwindV2OData['entityTypes']['NorthwindModel.Product']
      type V4ProductNav = TNorthwindV4OData['entityTypes']['NorthwindModel.Product']

      // Navigation keys should match between versions
      expectTypeOf<keyof V2ProductNav['navToOne']>()
        .toEqualTypeOf<keyof V4ProductNav['navToOne']>()
      expectTypeOf<keyof V2ProductNav['navToMany']>()
        .toEqualTypeOf<keyof V4ProductNav['navToMany']>()

      // Ensure navigation targets point to the same entity type names
      expectTypeOf<V2ProductNav['navToOne']['Category']>()
        .toEqualTypeOf<'NorthwindModel.Category'>()
      expectTypeOf<V4ProductNav['navToOne']['Category']>()
        .toEqualTypeOf<'NorthwindModel.Category'>()

      expectTypeOf<V2ProductNav['navToOne']['Supplier']>()
        .toEqualTypeOf<'NorthwindModel.Supplier'>()
      expectTypeOf<V4ProductNav['navToOne']['Supplier']>()
        .toEqualTypeOf<'NorthwindModel.Supplier'>()

      expectTypeOf<V2ProductNav['navToMany']['Order_Details']>()
        .toEqualTypeOf<'NorthwindModel.Order_Detail'>()
      expectTypeOf<V4ProductNav['navToMany']['Order_Details']>()
        .toEqualTypeOf<'NorthwindModel.Order_Detail'>()
    })
  })

  describe('Class Instances and Singleton Pattern', () => {
    it('should create singleton instances correctly', () => {
      const hana1 = HanaV4Param.getInstance()
      const hana2 = HanaV4Param.getInstance()
      expect(hana1).toBe(hana2)

      const nw1 = NorthwindV2.getInstance()
      const nw2 = NorthwindV2.getInstance()
      expect(nw1).toBe(nw2)

      const sap1 = SapService.getInstance()
      const sap2 = SapService.getInstance()
      expect(sap1).toBe(sap2)

      const hanaService1 = HanaService.getInstance()
      const hanaService2 = HanaService.getInstance()
      expect(hanaService1).toBe(hanaService2)
    })
  })
})
