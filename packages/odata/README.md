<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/notsap.png" alt="Not SAP" width="180" />
</p>

# notsapodata

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/odata.png" alt="Not SAP" />
</p>

## Overview

`notsapodata` is a **type-safe**, **developer-friendly** TypeScript toolkit for working with OData v2/v4 services—SAP, HANA, Microsoft, custom providers, or anything else that speaks OData.

[Demo Application](https://github.com/mav-rik/not-sap-demo)

### Why notsapodata?

- **🔒 Fully Type-Safe**: Every entity set, field, navigation property, and function parameter is validated at compile time
- **🚀 Developer-Friendly**: Intuitive API with auto-completion for all OData operations
- **📦 Zero Boilerplate**: Generated models handle all the type definitions—just import and use
- **🎯 Smart Defaults**: Automatic CSRF handling, intelligent batching, and optimized queries
- **🛠️ Production Ready**: Battle-tested with SAP/HANA OData services

### What's Included

- **Runtime Client**: Lightweight OData client with CSRF handling, batching, and metadata-aware helpers
- **Code Generator**: Vite plugin or programmatic API that turns OData metadata into strongly typed models
- **Metadata Utilities**: Value help discovery, filter rendering, Excel export, and more
- **Deep Navigation**: Support for complex navigation paths with multiple levels
- **Advanced Filtering**: Type-safe filter builder with support for all OData operators

When the runtime is paired with generated models, every request becomes fully type-safe: entity set names, fields, navigation properties and function parameters are all validated at compile time.

## Installation

```bash
npm install notsapodata
# or
pnpm add notsapodata
yarn add notsapodata
```

## Type Generation

### Using the Vite Plugin

The package ships with `notSapODataVitePlugin` (`import notSapODataVitePlugin from 'notsapodata/vite'`). The plugin fetches metadata (or uses a provided XML string), generates strongly-typed models and writes them to `src/.odata.types.ts` by default.

#### Minimal Example - Fetching Metadata from Service

```typescript
import { defineConfig } from 'vite'
import notSapODataVitePlugin from 'notsapodata/vite'

export default defineConfig({
  plugins: [
    notSapODataVitePlugin({
      services: {
        NorthwindV4: {
          host: 'https://services.odata.org',
          path: '/V4/Northwind/Northwind.svc',
        },
      },
    }),
  ],
})
```

#### With Authentication and Entity Selection

```typescript
import { defineConfig } from 'vite'
import notSapODataVitePlugin from 'notsapodata/vite'

const cookie = process.env.ODATA_COOKIE_NAME && process.env.ODATA_COOKIE_VALUE
  ? `${process.env.ODATA_COOKIE_NAME}=${process.env.ODATA_COOKIE_VALUE}`
  : undefined

export default defineConfig({
  plugins: [
    notSapODataVitePlugin({
      filename: 'src/.odata.types.ts',
      services: {
        sapV4: {
          host: process.env.ODATA_HOST ?? 'https://my.sap.example',
          path: '/sap/opu/odata4/sap/zsb_bp_data/srvd/sap/zsd_bp_data/0001',
          alias: 'SapV4',
          entitySets: [
            'ZSD_BP_DATA_CDS.CustomerSet',
            'ZSD_BP_DATA_CDS.Groups',
          ],
          headers: cookie ? { cookie } : {},
        },
      },
    }),
  ],
})
```

#### Using Offline Metadata

```typescript
import { defineConfig } from 'vite'
import notSapODataVitePlugin from 'notsapodata/vite'
import { readFileSync } from 'node:fs'

const metadataXml = readFileSync('./fixtures/northwind-v4.xml', 'utf-8')

export default defineConfig({
  plugins: [
    notSapODataVitePlugin({
      services: {
        MockNorthwind: {
          metadata: metadataXml,  // Provide XML directly, no network call
          path: '/mock/Northwind',
          alias: 'NorthwindMock',
        },
      },
    }),
  ],
})
```

Environment variables (automatically read when using the plugin):

- `ODATA_HOST` – default host when `service.host` is not provided.
- `ODATA_COOKIE_NAME` and `ODATA_COOKIE_VALUE` – combined into a `cookie` header when present.

### Service Configuration Options

| Option | Type | Description |
| --- | --- | --- |
| `host?` | `string` | Base host for all requests. Required when metadata is fetched from the service. |
| `path?` | `string` | Service path (e.g. `/sap/opu/odata/sap/MY_SERVICE`). Used by generated models and metadata fetch. |
| `headers?` | `Record<string,string>` | Extra headers (cookies, language, etc.). |
| `alias?` | `string` | Overrides the generated class/interface base name. |
| `entitySets?` | `string[]` | Restrict generation to specific entity sets (fully-qualified names). Omit to include everything. |
| `metadata?` | `string` | Provide inline metadata XML (no network call). |

### Programmatic Generation

```typescript
import { generate } from 'notsapodata/codegen'
import { writeFileSync } from 'node:fs'

// Generate types without Vite
const content = await generate({
  NorthwindV4: {
    host: 'https://services.odata.org',
    path: '/V4/Northwind/Northwind.svc',
  },
})

writeFileSync('src/.odata.types.ts', content)
```


### Generated Output Structure

For a service named `MyModel`, the generator creates four exports:

1. **Constants**: `myModelConsts` - Contains arrays of fields, keys, and measures for each entity type
2. **Types Interface**: `TMyModel` - TypeScript types derived from the constants
3. **OData Interface**: `TMyModelOData` - Main interface with entity sets, types, and functions mapping
4. **Service Class**: `MyModel` - Main interaction point extending `OData<TMyModelOData>`

```typescript
// Constants with field/key/measure lists
export const myModelConsts = {
  "Namespace": {
    "EntityType": {
      fields: ['Field1', 'Field2'] as const,
      keys: ['Field1'] as const,
      measures: [] as const,
    }
  }
}

// Service class with static helpers
export class MyModel extends OData<TMyModelOData> {
  public static getInstance() { /* singleton */ }
  public static async entitySet(name) { /* direct entity access */ }
}
```

## Simple OData Requests

### Getting an Entity Set

```typescript
import { NorthwindV4 } from '@/.odata.types'

// Get entity set using the static method (recommended)
const products = await NorthwindV4.entitySet('Products')

// Simple query with top 10 records
const result = await products.query({ top: 10 })
// GET: .../Products?$top=10
```

### Reading a Single Record

```typescript
const products = await NorthwindV4.entitySet('Products')

// Read a single record by key
const product = await products.readRecord({ ProductID: 42 })
// GET: .../Products(ProductID=42)
```

## Complex Queries

### All Query Parameters

```typescript
const products = await NorthwindV4.entitySet('Products')
const orders = await NorthwindV4.entitySet('Orders')

// Example with all supported parameters
const result = await products.query({
  top: 10,
  skip: 20,
  select: ['ProductID', 'ProductName', 'UnitPrice'],
  filter: { UnitPrice: { gt: 50 } },
  sorters: [{ name: 'ProductName', desc: false }],
  expand: products.expand('Category'),
  inlinecount: 'allpages',  // V2: returns count
  // count: true,            // V4: use this instead
  apply: 'filter(CategoryID eq 1)',  // V4 only
})
```

### Filter Parameter

Filters support type-safe operators and logical combinations:

#### Basic Operators
```typescript
// Equality and comparison
filter: {
  ProductID: { eq: 42 },          // ProductID eq 42
  UnitPrice: { gt: 50 },           // UnitPrice gt 50
  UnitsInStock: { le: 100 },       // UnitsInStock le 100
}

// String operations
filter: {
  ProductName: { contains: 'Chai' },    // contains(ProductName,'Chai')
  ProductName: { starts: 'A' },         // startswith(ProductName,'A')
  ProductName: { ends: 'tea' },         // endswith(ProductName,'tea')
}

// Range (between)
filter: {
  UnitPrice: { bw: ['10', '50'] }       // (UnitPrice ge 10 and UnitPrice le 50)
}

// Null/empty checks
filter: {
  Discontinued: { empty: true },        // Discontinued eq null
  ProductName: { notEmpty: true }       // ProductName ne null
}
```

#### Logical Operators
```typescript
// AND (implicit with array or object)
filter: [
  { ProductName: { contains: 'Chai' } },
  { UnitPrice: { bw: ['10', '50'] } },
]
// Result: (contains(ProductName,'Chai') and (UnitPrice ge 10 and UnitPrice le 50))

// OR expression
filter: {
  $or: [
    { ProductID: { eq: 1 } },
    { ProductID: { eq: 2 } },
    { ProductID: { eq: 3 } },
  ],
}
// Result: (ProductID eq 1 or ProductID eq 2 or ProductID eq 3)

// Complex nesting
filter: {
  $or: [
    {
      $and: [
        { CategoryID: { eq: 1 } },
        { UnitPrice: { gt: 10 } }
      ]
    },
    { Discontinued: { eq: true } }
  ]
}
```

### Select Parameter

```typescript
// Select specific fields (type-safe)
select: ['ProductID', 'ProductName', 'UnitPrice']
// Result: $select=ProductID,ProductName,UnitPrice
```

### Sorters Parameter

```typescript
// Multiple sort criteria
sorters: [
  { name: 'UnitPrice', desc: true },   // Descending
  'ProductName'                        // Ascending (shorthand)
]
// Result: $orderby=UnitPrice desc,ProductName
```

### Apply Parameter (V4 only)

```typescript
// OData V4 aggregations and transformations
apply: 'filter(CategoryID eq 1)/aggregate(UnitPrice with sum as TotalPrice)'
```

### Type-Safe Expands

One of the key features is type-safe expand building with full IntelliSense support.

#### OData V4 Expands

V4 supports inline query options within expand:

```typescript
const orders = await NorthwindV4.entitySet('Orders')

// Build type-safe expands with nested options
const customerExpand = orders.expand('Customer', {
  select: ['CustomerID', 'CompanyName', 'Country']
})

const orderDetailsExpand = orders
  .expand('Order_Details', {
    filter: { Quantity: { gt: 5 } },
    select: ['ProductID', 'Quantity', 'UnitPrice'],
    top: 10
  })
  .expand('Product', {  // Nested expand
    select: ['ProductName', 'CategoryID']
  })
  .expand('Category')  // Further nesting

const result = await orders.query({
  top: 2,
  expand: [customerExpand, orderDetailsExpand]
})
// Result: $expand=Customer($select=CustomerID,CompanyName,Country),Order_Details($filter=Quantity gt 5;$select=ProductID,Quantity,UnitPrice;$top=10;$expand=Product($select=ProductName,CategoryID;$expand=Category))
```

#### OData V2 Expands

V2 uses simpler path-based expansion. Filters and selects are applied at the root level with navigation prefixes:

```typescript
// V2: Simple expansion paths
expand: 'Order_Details/Product'

// V2: Filters use navigation prefix at root
filter: {
  'Order_Details/Quantity': { gt: 10 },  // Applied at root with path prefix
}
select: ['OrderID', 'Order_Details/ProductID', 'Order_Details/Product/ProductName']
```

### Working with Large Result Sets

```typescript
const model = NorthwindV4.getInstance()
const progress: number[] = []

const query = model.readAllEntries('Products', {
  chunkSize: 500,
  progressCb: (loaded, total, done) => {
    progress.push(loaded)
    if (done) {
      console.log(`Loaded ${loaded} of ${total}`)
    }
  },
})

const rows = await query.promise
// Abort if needed: query.abort()
```

`readAllEntries` performs chunked reads (defaults to 100 records) and reuses the batching engine under the hood.

## Navigation

Navigation allows you to traverse relationships between entities:

```typescript
const orders = await NorthwindV4.entitySet('Orders')

// Single-level navigation: Orders -> Customer
const customer = await orders
  .withKey({ OrderID: 10248 })
  .toOne('Customer')
  .read()
// GET: .../Orders(OrderID=10248)/Customer

// Multi-level navigation: Orders -> Customer -> Orders
const customerOrders = orders
  .withKey({ OrderID: 10248 })
  .toOne('Customer')
  .toMany('Orders')

const result = await customerOrders.query({ top: 5 })
// GET: .../Orders(OrderID=10248)/Customer/Orders?$top=5

// Complex 3+ level navigation
const deepNav = orders
  .withKey({ OrderID: 10249 })
  .toMany('Order_Details')
  .withKey({ OrderID: 10249, ProductID: 11 })
  .toOne('Product')
  .toOne('Category')

const category = await deepNav.read()
// GET: .../Orders(OrderID=10249)/Order_Details(OrderID=10249,ProductID=11)/Product/Category
```

### How Navigation Works

- `withKey()` - Specifies which record to start from
- `toOne()` - Navigate to a single related entity (1:1 or N:1)
- `toMany()` - Navigate to a collection of related entities (1:N)
- Chain methods to build deep navigation paths
- End with `.query()` or `.read()` to execute the request

## Useful Utilities

### Filter Rendering

```typescript
import { renderFilter } from 'notsapodata'

// Render filter string for manual use
const filterString = renderFilter({
  ProductName: { contains: 'Tea' },
  UnitPrice: { gt: 10 }
})
// Result: "(contains(ProductName,'Tea') and UnitPrice gt 10)"
```

### Key Preparation

```typescript
const products = await NorthwindV4.entitySet('Products')

// Single key
const key = products.prepareRecordKey({ ProductID: 42 })
// Result: 'Products(ProductID=42)'

// Composite key
const orderDetails = await NorthwindV4.entitySet('Order_Details')
const compositeKey = orderDetails.prepareRecordKey({
  OrderID: 10248,
  ProductID: 11
})
// Result: 'Order_Details(OrderID=10248,ProductID=11)'
```

### Expand String Rendering

```typescript
const products = await NorthwindV4.entitySet('Products')

// Build and render expand string
const expandBuilder = products
  .expand('Category')
  .expand('Order_Details', { top: 5 })

const expandString = expandBuilder.toString()
// Result: 'Category,Order_Details($top=5)'
```

## Additional Features

### Updating Data

```typescript
const model = NorthwindV4.getInstance()
const products = await NorthwindV4.entitySet('Products')

// Prepare the key
const key = products.prepareRecordKey({ ProductID: 1 })

// Update the record
await model.updateRecordByKey(key, {
  ProductName: 'Updated product name',
})
```

### Calling Function Imports

```typescript
const model = NorthwindV4.getInstance()

await model.callFunction('SapService.CalculateTotals', {
  FiscalYear: '2024',
})
```

### Batch Execution

There are two batching modes:

1. **Implicit queueing** – set `model.options.useBatch = true` and the client will coalesce consecutive calls automatically.
2. **Manual control** – create a dedicated batch instance.

```typescript
const model = NorthwindV4.getInstance()
const batch = model.createBatch()

const productsPromise = batch.read('Products', { $top: 10 })
const ordersPromise = batch.read('Orders', { $top: 10 })

const { promise } = batch.execute({ maxBatchLength: 10, maxConcurrentBatches: 2 })
await promise

const products = await productsPromise
const orders = await ordersPromise
```

## Metadata Helpers

### Accessing Metadata

```typescript
// If you need metadata for advanced operations
const model = NorthwindV4.getInstance()
const metadata = await model.getMetadata()
const productType = metadata.getEntityType('NorthwindModel.Product')
```

### Refining Metadata

```typescript
const products = await NorthwindV4.entitySet('Products')

products.refineField('ProductName', {
  $label: 'Product',
  $MaxLength: 100,
})
```

### Excel Export

```typescript
const products = await NorthwindV4.entitySet('Products')

const { data } = await products.query({
  select: ['ProductID', 'ProductName', 'UnitPrice', 'CategoryID'],
})

const buffer = await products.generateExcel(
  ['ProductID', 'ProductName', 'UnitPrice', 'CategoryID'],
  data,
  {
    subtotals: [
      {
        grpBy: ['CategoryID'],
        aggregate: ['UnitPrice'],
      },
    ],
  }
)
// buffer is a Node.js Buffer (Excel workbook)
```

## Errors and Fetch

`ifetch` wraps the Fetch API and raises rich error objects:

- `SapODataError` – thrown when the response body matches the SAP error schema.
- `IFetchError` – thrown for network errors or non-OData error responses.

```typescript
import { IFetchError, SapODataError } from 'notsapodata'

try {
  await model.updateRecordByKey('Products(1)', { ProductName: 'Test' })
} catch (error) {
  if (error instanceof SapODataError) {
    console.error(error.code, error.message)
  } else if (error instanceof IFetchError) {
    console.error(error.status, error.statusText)
  }
}
```

## Best Practices

- **Use the static `entitySet` method** (`Service.entitySet()`) for quick access—no need to fetch metadata first
- **Leverage type safety**: The generated types ensure all entity sets, fields, and navigation properties are validated at compile time
- **Use structured filters**: Let the query builder generate OData expressions for you (`{ Field: { gt: '10' } }`, `{ $or: [...] }`, etc.)
- **Cache entity sets**: The `entitySet` instances cache field maps, annotations, and value help lookups
- **Deep navigation**: Chain `toOne()` and `toMany()` methods for complex navigation paths
- **Batch wisely**: When using `model.options.useBatch`, group calls logically to avoid exceeding the default 100 request batch size
- **Handle errors properly**: Catch `SapODataError` separately from generic network errors to surface SAP-provided diagnostics in the UI
