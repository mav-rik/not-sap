<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/notsap.png" alt="Not SAP" width="180" />
</p>

# notsapodata

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/odata.png" alt="Not SAP" />
</p>

## Overview

`notsapodata` is a TypeScript-first toolkit for working with OData v2/v4 services—SAP, HANA, Microsoft, custom providers, or anything else that speaks OData. It combines:

- a lightweight runtime `OData` client with CSRF handling, batching and metadata-aware helpers,
- metadata utilities for value help discovery, filter rendering and Excel export,
- a code generator (Vite plugin or programmatic API) that turns OData metadata into strongly typed models.

When the runtime is paired with generated models, every request becomes fully type-safe: entity set names, fields, navigation properties and function parameters are all validated at compile time. Everything in this README is derived from the current source code – every example maps to exports in `packages/odata/src`.

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

Environment variables read by `readODataEnv()`:

- `ODATA_HOST` – default host when `service.host` is not provided.
- `ODATA_COOKIE_NAME` and `ODATA_COOKIE_VALUE` – combined into a `cookie` header when present.

> **Type safety** – the generated `*.odata.types.ts` file provides literal types for entity sets, fields, keys and functions. Passing those types to the runtime (`OData<TModel>`) means every CRUD call, filter and navigation path is validated by TypeScript.

### Service Options

Each service entry matches `TGenerateModelOpts`:

| Option | Type | Description |
| --- | --- | --- |
| `host?` | `string` | Base host for all requests. Required when metadata is fetched from the service. |
| `path?` | `string` | Service path (e.g. `/sap/opu/odata/sap/MY_SERVICE`). Used by generated models and metadata fetch. |
| `headers?` | `Record<string,string>` | Extra headers (cookies, language, etc.). |
| `alias?` | `string` | Overrides the generated class/interface base name. |
| `entitySets?` | `string[]` | Restrict generation to specific entity sets (fully-qualified names). Omit to include everything. |
| `metadata?` | `string \| (odata, opts) => string \| Promise<string>` | Provide inline metadata or a custom loader (no network call). |

### Programmatic Generation

The generator can be used without Vite:

```typescript
import { generate } from 'notsapodata/codegen'
import { writeFileSync } from 'node:fs'

const content = await generate({
  NorthwindV4: {
    host: 'https://services.odata.org',
    path: '/V4/Northwind/Northwind.svc',
    entitySets: [
      'ODataWebV4.Northwind.Model.Products',
      'ODataWebV4.Northwind.Model.Orders',
    ],
  },
})

writeFileSync('src/.odata.types.ts', content)
```

### Using Local Metadata (no network)

Both the plugin and the `generate` function accept inline metadata. This is handy for mocking services in tests or working offline:

```typescript
import { readFileSync } from 'node:fs'
import { generate } from 'notsapodata/codegen'

const metadataXml = readFileSync('./fixtures/northwind-v4.xml', 'utf-8')

const content = await generate({
  MockNorthwind: {
    metadata: metadataXml,
    path: '/mock/Northwind',
  },
})
```

The same `metadata` property can be passed to the Vite plugin (`metadata: readFileSync('metadata.xml', 'utf-8')`) to skip live service calls during development.

### Generated Output Shape

The generator creates four exports per service:

```typescript
export const northwindV4Consts = {
  "NorthwindModel": {
    "Product": {
      fields: [/* ... */] as const,
      keys: [/* ... */] as const,
      measures: [/* ... */] as const,
    },
  },
}

export interface TNorthwindV4 {
  "NorthwindModel": {
    "Product": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["fields"][number]
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["keys"][number]
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["measures"][number]
    }
  }
}

export interface TNorthwindV4OData extends TOdataDummyInterface {
  entitySets: {
    'ODataWebV4.Northwind.Model.Products': "NorthwindModel.Product"
  }
  entityTypes: {
    'NorthwindModel.Product': {
      keys: TNorthwindV4["NorthwindModel"]["Product"]["keys"]
      fields: TNorthwindV4["NorthwindModel"]["Product"]["fields"]
      measures: TNorthwindV4["NorthwindModel"]["Product"]["measures"]
      navToMany: Record<string, string>
      navToOne: Record<string, string>
    }
  }
  functions: Record<string, { params: string }>
}

export class NorthwindV4 extends OData<TNorthwindV4OData> {
  public static readonly serviceName = 'NorthwindV4' as const
  private static instance?: NorthwindV4

  public static getInstance() {
    if (!NorthwindV4.instance) {
      NorthwindV4.instance = new NorthwindV4()
    }
    return NorthwindV4.instance
  }

  public static async entitySet<T extends keyof TNorthwindV4OData['entitySets']>(name: T) {
    const instance = NorthwindV4.getInstance()
    return instance.entitySet<T>(name)
  }

  private constructor(opts?: TODataOptions) {
    super('NorthwindV4', { ...opts, path: '/V4/Northwind/Northwind.svc' })
  }
}
```

The generated class inherits all runtime helpers, including batching, metadata access and typed queries.

## Runtime Client

### Creating or Reusing a Model

```typescript
import { OData } from 'notsapodata'
import { NorthwindV4, type TNorthwindV4OData } from '@/.odata.types'

// Preferred: reuse the generated singleton (fully typed)
const model = NorthwindV4.getInstance()

// Manual client – still type-safe because we pass the generated interface
const custom = new OData<TNorthwindV4OData>('NorthwindV4', {
  host: 'https://services.odata.org',
  path: '/V4/Northwind/Northwind.svc',
})
```

### Reading Data

```typescript
const products = await model.entitySet('ODataWebV4.Northwind.Model.Products')

const { data, count } = await products.query({
  top: 5,
  select: ['ProductID', 'ProductName', 'UnitPrice'],
  sorters: [{ name: 'ProductName' }],
  inlinecount: 'allpages',
  filter: [
    { ProductName: { contains: 'Chai' } },
    { UnitPrice: { bw: ['10', '50'] } },
  ],
})
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products?$filter=(contains(ProductName,'Chai') and (UnitPrice ge 10 and UnitPrice le 50))&$orderby=ProductName&$top=5&$count=true&$select=ProductID,ProductName,UnitPrice
```

The result is still `TOdataReadResult<TFields>` coming from the generated metadata, so `data` is strongly typed and `count` is populated when `$count` is requested.

More filter shapes are supported – the query builder mirrors the scenarios covered in the tests from `generated-filters.spec.ts`:

```typescript
// OR expression using $or
await products.query({
  top: 3,
  filter: {
    $or: [
      { ProductID: { eq: '1' } },
      { ProductID: { eq: '2' } },
      { ProductID: { eq: '3' } },
    ],
  },
})
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products?$filter=(ProductID eq 1 or ProductID eq 2 or ProductID eq 3)&$top=3

// Comparison helpers map to OData operators automatically
await products.query({
  filter: {
    UnitPrice: { gt: '50' },
    UnitsInStock: { le: '100' },
  },
})
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products?$filter=(UnitPrice gt 50 and UnitsInStock le 100)
```

### Working with Large Result Sets

```typescript
const progress: number[] = []
const query = model.readAllEntries('ODataWebV4.Northwind.Model.Products', {
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

### Updating Data

```typescript
const metadata = await model.getMetadata()
const products = metadata.getEntitySet('ODataWebV4.Northwind.Model.Products')
const key = products.prepareRecordKey({ ProductID: '1' })

await model.updateRecordByKey(key, {
  ProductName: 'Updated product name',
})
```

### Calling Function Imports

```typescript
await model.callFunction('SapService.CalculateTotals', {
  FiscalYear: '2024',
})
```

Replace `'SapService.CalculateTotals'` with the exact function import name defined in your metadata. The helper validates the name before sending the request and throws when the function is missing. Arguments are typed as `Record<M['functions'][T]['params'], string>`, so only declared parameters are accepted.

### Batch Execution

There are two batching modes:

1. **Implicit queueing** – set `model.options.useBatch = true` and the client will coalesce consecutive calls automatically.
2. **Manual control** – create a dedicated batch instance.

```typescript
const batch = model.createBatch()
const productsPromise = batch.read('ODataWebV4.Northwind.Model.Products', { $top: 10 })
const ordersPromise = batch.read('ODataWebV4.Northwind.Model.Orders', { $top: 10 })

const { promise } = batch.execute({ maxBatchLength: 10, maxConcurrentBatches: 2 })
await promise

const products = await productsPromise
const orders = await ordersPromise
```

`execute` also provides `abort()` to cancel outstanding work.

## Metadata Helpers

All metadata helpers live under `notsapodata/metadata` and are also exported from the package root.

### Accessing Entity Sets and Types

```typescript
const metadata = await model.getMetadata()
const products = metadata.getEntitySet('ODataWebV4.Northwind.Model.Products')
const productType = metadata.getEntityType('NorthwindModel.Product')

const { data } = await products.query({
  select: ['ProductID', 'ProductName', 'UnitPrice'],
  filter: { ProductID: { eq: '42' } },
})
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products?$filter=ProductID eq 42&$select=ProductID,ProductName,UnitPrice
```

Structured filters accept either single objects (`{ Field: { eq: 'Value' } }`), arrays to imply `and`, or `$or`/`$and` groups exactly like the examples in `generated-filters.spec.ts`.

### Refining Metadata

```typescript
products.refineField('ProductName', {
  $label: 'Product',
  $MaxLength: 100,
})
```

Refinements are cached per model. All future calls to `getField` reflect the refinements.

### Working with Navigation Properties

```typescript
const record = products.withKey({ ProductID: '1' })
const orderDetailsSet = record.toMany('Order_Details')

const orderDetails = await orderDetailsSet.query({ top: 5 })
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products(ProductID=1)/Order_Details?$top=5

const supplier = await record.toOne('Supplier').read()
// GET https://services.odata.org/V4/Northwind/Northwind.svc/Products(ProductID=1)/Supplier
```

### Excel Export

```typescript
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

`generateExcel` automatically pulls currency metadata via `SAP__CodeList.CurrencyCodes` annotations when present.

### Value Help Discovery

`EntityType.getValueHelpEntitySet(field)` inspects value-list annotations (both V2 and V4) and returns an `EntitySet` instance if the service exposes a value help collection.

### Currency Metadata

`EntityType.readCurrencies()` loads the referenced currency collection once and caches it for `ExcelGenerator` and custom code.

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

- Always pair the runtime with generated types (`new OData<TModel>()` or `Service.getInstance()`) to keep entity sets, fields and functions type-safe.
- Use generated models (`Service.getInstance()`) whenever possible – they carry service metadata, entity type mappings and helper statics.
- Always request metadata once and reuse `EntitySet` instances; they cache field maps, annotations and value help lookups.
- Use `EntitySet.query` with structured filter objects (`{ Field: { gt: '10' } }`, `{ $or: [...] }`, etc.) so OData expressions are generated for you.
- When batching via `model.options.useBatch`, group calls logically to avoid exceeding the default 100 request batch size.
- Handle `SapODataError` separately from generic network errors to surface SAP-provided diagnostics in the UI.

This README reflects the current behaviour of `packages/odata`. Refer to the source files in `src/` for deeper detail or additional extension points.
