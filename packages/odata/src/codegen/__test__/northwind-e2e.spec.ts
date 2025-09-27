import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { NorthwindV4 } from './generated/northwind-v4'
import { NorthwindV2 } from './generated/northwind-v2'
import {
  metadataXml,
  metadataV2Xml,
  resetServiceInstances,
  setupGlobalMocks,
  teardownGlobalMocks,
} from './test-utils'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICE_HOST = 'https://services.odata.org'

interface FixtureFile {
  description: string
  requests: {
    url: string
    response: unknown
  }[]
}

function loadFixture(serviceFolder: string, scenario: string): FixtureFile {
  const path = join(__dirname, 'fixtures', serviceFolder, `${scenario}.json`)
  return JSON.parse(readFileSync(path, 'utf-8')) as FixtureFile
}

function buildResponseMap(serviceFolder: string, scenarios: readonly string[]) {
  const map = new Map<string, unknown>()
  for (const scenario of scenarios) {
    const fixture = loadFixture(serviceFolder, scenario)
    for (const request of fixture.requests) {
      map.set(request.url, request.response)
    }
  }
  return map
}

describe('Northwind fixture replays', () => {
  beforeAll(() => {
    setupGlobalMocks()
  })

  afterAll(() => {
    teardownGlobalMocks()
  })

  beforeEach(() => {
    resetServiceInstances()
  })

  describe('Northwind V4 scenarios', () => {
    const scenarios = ['products-filtered', 'orders-expanded', 'customer-orders-navigation'] as const
    let responseMap: Map<string, unknown>

    beforeEach(() => {
      responseMap = buildResponseMap('northwind-v4', scenarios)
    })

    it('replays captured queries', async () => {
      const service = NorthwindV4.getInstance()
      service.options.host = SERVICE_HOST
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataXml)

      const fetchMock = vi.spyOn(service, '_fetch').mockImplementation(
        async (url: string) => {
          const response = responseMap.get(url)
          if (!response) {
            throw new Error(`Missing fixture for url ${url}`)
          }
          return response as any
        }
      )

      const products = await service.entitySet('Products')
      const productsResult = await products.query({
        top: 5,
        filter: { UnitPrice: {gt: 50}},
        select: ['ProductID', 'ProductName', 'UnitPrice', 'Discontinued'],
        sorters: [
          { name: 'UnitPrice', desc: true },
          'ProductName',
        ],
      })
      expect(productsResult.data).toHaveLength(5)
      expect(productsResult.data[0].ProductName).toBe('Côte de Blaye')
      expect(productsResult.data[0].UnitPrice).toBeGreaterThan(200)

      const orders = await service.entitySet('Orders')
      const customerExpand = orders.expand('Customer', {
        select: ['CustomerID', 'CompanyName', 'Country'],
      })
      const orderDetailsExpand = orders
        .expand('Order_Details', {
          select: ['ProductID', 'Quantity', 'UnitPrice'],
        })
        .expand('Product', {
          select: ['ProductName', 'CategoryID'],
        })

      const ordersResult = await orders.query({
        top: 2,
        filter: { ShipCountry: 'USA'},
        expand: [customerExpand, orderDetailsExpand],
        sorters: [{ name: 'OrderDate', desc: true }],
      })
      expect(ordersResult.data).toHaveLength(2)
      const firstOrder = ordersResult.data[0]
      expect(firstOrder.Customer?.CompanyName).toBeDefined()
      expect(firstOrder.Order_Details?.length).toBeGreaterThan(0)
      expect(firstOrder.Order_Details?.[0].Product?.ProductName).toBeTruthy()

      const customerOrders = orders
        .withKey({ OrderID: 10248 })
        .toOne('Customer')
        .toMany('Orders')

      const navigationResult = await customerOrders.query({
        top: 2,
        select: ['OrderID', 'ShipName', 'ShipCountry'],
        sorters: [{ name: 'OrderDate', desc: true }],
      })
      expect(navigationResult.data).toHaveLength(2)
      expect(navigationResult.data[0].ShipName).toBeTruthy()
      expect(navigationResult.data[0].ShipCountry).toBeDefined()

      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('Northwind V2 scenarios', () => {
    const scenarios = ['products-filtered', 'orders-expanded', 'category-products-navigation'] as const
    let responseMap: Map<string, unknown>

    beforeEach(() => {
      responseMap = buildResponseMap('northwind-v2', scenarios)
    })

    it('replays captured queries', async () => {
      const service = NorthwindV2.getInstance()
      service.options.host = SERVICE_HOST
      vi.spyOn(service, 'readMetadata').mockResolvedValue(metadataV2Xml)

      const fetchMock = vi.spyOn(service, '_fetch').mockImplementation(
        async (url: string) => {
          const response = responseMap.get(url)
          if (!response) {
            throw new Error(`Missing fixture for url ${url}`)
          }
          return response as any
        }
      )

      const products = await service.entitySet('Products')
      const productsResult = await products.query({
        top: 5,
        filter: { Discontinued: { eq: false } },
        select: ['ProductID', 'ProductName', 'UnitsInStock', 'SupplierID'],
        sorters: [{ name: 'UnitsInStock', desc: true }],
      })
      expect(productsResult.data).toHaveLength(5)
      expect(productsResult.data[0].UnitsInStock).toBeGreaterThan(110)

      const orders = await service.entitySet('Orders')
      const ordersResult = await orders.query({
        top: 2,
        filter: { ShipCountry: 'USA' },
        expand: [orders.expand('Customer'), orders.expand('Order_Details').expand('Product')],
        select: ['OrderID', 'ShipName', 'ShipCountry'],
        sorters: [{ name: 'OrderDate', desc: true }],
      })
      expect(ordersResult.data).toHaveLength(2)
      expect(ordersResult.data[0].ShipCountry).toBe('USA')

      const categoryProducts = products.withKey({ ProductID: 1 }).toOne('Category').toMany('Products')
      const navigationResult = await categoryProducts.query({
        top: 2,
        select: ['ProductID', 'ProductName', 'CategoryID'],
        sorters: ['ProductName'],
      })
      expect(navigationResult.data).toHaveLength(2)
      expect(navigationResult.data[0].CategoryID).toBe(1)

      expect(fetchMock).toHaveBeenCalledTimes(3)
    })
  })
})
