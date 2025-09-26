import { describe, it, beforeEach, beforeAll, afterAll, expect, vi } from 'vitest'
import { NorthwindV4, TNorthwindV4 } from './generated/northwind-v4'
import { NorthwindV2, TNorthwindV2 } from './generated/northwind-v2'
import { HanaV4Param, THanaV4Param } from './generated/hana-v4-param'
import {
  metadataXml,
  metadataV2Xml,
  metadataHanaXml,
  setupGlobalMocks,
  teardownGlobalMocks,
  resetServiceInstances,
} from './test-utils'

describe('Navigation properties', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  it('should build correct URL for single-level navigation with HanaV4Param', async () => {
    const service = HanaV4Param.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataHanaXml)

    // Mock the _fetch method to capture the URL
    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: [] })

    const entitySet = await HanaV4Param.entitySet('MyPartners')

    const keyInput: Record<THanaV4Param['UKDataService']['MyPartnersParameters']['keys'], string> = {
      YEAR: '2023',
    }

    // Navigate from MyPartners(2023) to Set (toMany relationship)
    const navPath = entitySet.withKey(keyInput).toMany('Set')

    // Execute a query operation to trigger the fetch
    await navPath.query({ top: 10 })

    // Check the URL that was called
    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe("/odata/hana-v4-param/MyPartners(YEAR='2023')/Set?$top=10")
  })

  it('should build correct URL for 2-level deep navigation', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: [] })

    const entitySet = await NorthwindV4.entitySet('Orders')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Order']['keys'], string> = {
      OrderID: '10248',
    }

    // Navigate from Orders(10248) -> Customer -> Orders (2 levels)
    const deepNav = entitySet.withKey(keyInput).toOne('Customer').toMany('Orders')

    // Execute a query to trigger the fetch
    await deepNav.query({ top: 5 })

    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe('/odata/northwind-v4/Orders(OrderID=10248)/Customer/Orders?$top=5')
  })

  it('should build correct URL for 3-level deep navigation', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: [] })

    const entitySet = await NorthwindV4.entitySet('Orders')

    const orderKey: Record<TNorthwindV4['NorthwindModel']['Order']['keys'], string> = {
      OrderID: '10248',
    }

    // Navigate from Orders(10248) -> Order_Details -> Product -> Category (3 levels)
    const deepNav = entitySet
      .withKey(orderKey)
      .toMany('Order_Details')
      .withKey({ OrderID: '10248', ProductID: '11' })
      .toOne('Product')
      .toOne('Category')

    // Execute a read to trigger the fetch
    await deepNav.read()

    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe('/odata/northwind-v4/Orders(OrderID=10248)/Order_Details(OrderID=10248,ProductID=11)/Product/Category')
  })

  it('should build correct URL for mixed toOne and toMany navigation', async () => {
    const service = NorthwindV2.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: [] })

    const entitySet = await NorthwindV2.entitySet('Products')

    const keyInput: Record<TNorthwindV2['NorthwindModel']['Product']['keys'], string> = {
      ProductID: '1',
    }

    // Navigate from Products(1) -> Category -> Products (toOne then toMany)
    const mixedNav = entitySet.withKey(keyInput).toOne('Category').toMany('Products')

    // Execute a query to trigger the fetch
    await mixedNav.query({ top: 20 })

    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe('/odata/northwind-v2/Products(ProductID=1)/Category/Products?$top=20')
  })

  it('should build correct URL for navigation to Category from Product', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: {} })

    const entitySet = await NorthwindV4.entitySet('Products')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Product']['keys'], string> = {
      ProductID: '3',
    }

    // Navigate from Products(3) to Category (toOne relationship)
    const categoryNav = entitySet.withKey(keyInput).toOne('Category')

    await categoryNav.read()

    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe('/odata/northwind-v4/Products(ProductID=3)/Category')
  })

  it('should build correct URL for navigation from Category to Products', async () => {
    const service = NorthwindV4.getInstance()
    vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

    const fetchSpy = vi.spyOn(service, '_fetch').mockResolvedValue({ value: [] })

    const entitySet = await NorthwindV4.entitySet('Categories')

    const keyInput: Record<TNorthwindV4['NorthwindModel']['Category']['keys'], string> = {
      CategoryID: '2',
    }

    // Navigate from Categories(2) to Products (toMany relationship)
    const productsNav = entitySet.withKey(keyInput).toMany('Products')

    await productsNav.query({ top: 10 })

    expect(fetchSpy).toHaveBeenCalled()
    const actualUrl = fetchSpy.mock.calls[0][0]
    expect(actualUrl).toBe('/odata/northwind-v4/Categories(CategoryID=2)/Products?$top=10')
  })
})