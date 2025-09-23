# notsapodata Module Documentation

## Overview

`notsapodata` is a TypeScript-first OData client library that provides type-safe access to OData services with automatic type generation through a Vite plugin. It handles OData v2/v4 protocols, batch operations, metadata parsing, and Excel export functionality.

## Installation

```bash
npm install notsapodata
```

## Vite Plugin Setup for Type Generation

The Vite plugin automatically generates TypeScript types from OData service metadata, providing full IntelliSense and type safety.

### Configuration in vite.config.ts

```typescript
import { defineConfig } from 'vite'
import { odataCodegenPlugin } from 'notsapodata/vite'

export default defineConfig({
  plugins: [
    odataCodegenPlugin({
      services: {
        // OData v2 service
        ZSVC_MODEL: {
          alias: 'MainModel',
          entitySets: [
            { name: 'ZSET_CUSTOMERS', alias: 'Customers' },
            { name: 'ZSET_GROUPS', alias: 'Groups' },
          ],
        },

        // OData v4 service
        zsd_bp_data: {
          odataUrl: '/sap/opu/odata4/sap/zsb_bp_data/srvd/sap/zsd_bp_data/0001',
          alias: 'BPModel',
          entitySets: [{ name: 'line_items', alias: 'LineItems' }],
        },
      },
    }),
  ],
})
```

### Plugin Options

- **services**: Object defining OData services to generate types for
- **alias**: Model class name to generate
- **entitySets**: Array of entity sets with optional aliases
- **odataUrl**: (Optional) Custom OData URL for v4 services

### Generated Types (.odata.types.ts)

The plugin generates a `.odata.types.ts` file with:

```typescript
// Auto-generated types
export interface TMainModelType extends TOdataDummyInterface {
  entitySets: {
    ZVEC_MDG_BP_HOTEL_GRP_KEY: {
      keys: TMainModelCustomersKeys;
      fields: TMainModelCustomersFields;
      measures: TMainModelCustomersMeasures;
    };
  };
  functions: {
    ConfirmGrpKey: { params: "Customer" };
  };
}

// Model class with singleton pattern
export class MainModel extends OData<TMainModelType> {
  public static readonly name = "ZSVC_MODEL";
  private static instance?: MainModel;

  static entityAliases = {
    Customers: "ZSET_CUSTOMERS",
    Groups: "ZSET_GROUPS"
  };

  public static getInstance() {
    if (!MainModel.instance) {
      MainModel.instance = new MainModel()
    }
    return MainModel.instance
  }
}

// Type exports for fields, keys, and measures
export type TMainModelCustomersFields = "Customer" | "Grouping" | ...
export type TMainModelCustomersKeys = "Customer"
export type TMainModelCustomersMeasures = "Amount" | ...
```

## Core Classes and Types

### OData Class

The main class for interacting with OData services:

```typescript
import { OData } from 'notsapodata'

class MyModel extends OData<TModelType> {
  constructor(opts?: TODataOptions) {
    super('SERVICE_NAME', {
      url: '/sap/opu/odata/sap/SERVICE_NAME',
      csrfFetch: true,
      useBatch: false,
      ...opts,
    })
  }
}
```

#### Options (TODataOptions)

- **url**: Base URL for the OData service
- **csrfFetch**: Enable CSRF token handling (default: true for SAP)
- **useBatch**: Enable batch request mode
- **headers**: Additional HTTP headers

### Model Instance Methods

#### Basic CRUD Operations

```typescript
const model = MainModel.getInstance()

// Read entities
const result = await model.read('EntitySet', {
  $top: 50,
  $skip: 0,
  $filter: 'Field eq "value"',
  $select: ['Field1', 'Field2'],
  $orderby: 'Field1 desc',
  $expand: 'NavigationProperty',
})

// Create entity
await model.create('EntitySet', {
  Field1: 'value1',
  Field2: 'value2',
})

// Update entity
await model.update('EntitySet', 'KeyValue', {
  Field1: 'new value',
})

// Delete entity
await model.delete('EntitySet', 'KeyValue')

// Execute function import
await model.execute('FunctionName', {
  param1: 'value',
})
```

#### Batch Operations

```typescript
model.options.useBatch = true

const batch = model.createBatch()

// Queue multiple operations
const read1 = batch.read('EntitySet1', { $top: 10 })
const read2 = batch.read('EntitySet2', { $top: 20 })
const create1 = batch.create('EntitySet3', { data })

// Execute all at once
const { promise } = batch.execute()
await promise

// Get results
const { data: data1 } = await read1
const { data: data2 } = await read2
const createdEntity = await create1
```

### EntitySet Class

Work with entity sets and metadata:

```typescript
const metadata = await model.getMetadata()
const entitySet = metadata.getEntitySet('EntitySetName')

// Refine field metadata
entitySet.refineField('Customer', {
  $label: 'Business Partner',
  $MaxLength: 10,
})

// Add description field references
entitySet.refineField('CompanyCode', {
  $$description: 'CompanyCodeDesc',
})

// Query with prepared parameters
const { params } = entitySet.prepareQuery({
  filter: { Field: { eq: 'value' } },
  select: ['Field1', 'Field2'],
  orderby: [{ field: 'Field1', order: 'desc' }],
})

const result = await entitySet.query(params)
```

### Excel Export

Generate Excel files from OData results:

```typescript
const records = await model.read('EntitySet', { $top: 1000 })

const buffer = await entitySet.generateExcel(
  ['Column1', 'Column2'], // columns to include
  records.data,
  {
    subtotals: [
      {
        groupBy: 'Category',
        aggregate: ['Amount'],
      },
    ],
  }
)

// Download the file
const blob = new Blob([buffer], { type: 'application/octet-stream' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'export.xlsx'
a.click()
```

## TypeScript Types

### Core Types

```typescript
// OData query parameters
type TODataParams = {
  $top?: number
  $skip?: number
  $filter?: string
  $select?: string[]
  $orderby?: string
  $expand?: string
  $count?: boolean
  $apply?: string
}

// Read result
type TOdataReadResult<T> = {
  data: T[]
  count?: number
}

// Record type
type TOdataRecord<TFields> = Record<TFields, any> & {
  __metadata: {
    id: string
    type: string
    uri: string
  }
}

// Field filters
type TODataFieldsFilters<TFields = string> = {
  [K in TFields]?: TODataFilterValWithType[]
}

// Filter value with type
type TODataFilterValWithType = {
  value: any[]
  type?: 'date' | 'datetime' | 'time'
  operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le' | 'contains'
}

// Entity set sorter
type TEntitySetSorter<TFields = string> = {
  field: TFields
  order: 'asc' | 'desc'
}

// Custom query function
type TODataEntityCustomQuery<MODEL, K> = (
  entity: EntitySet,
  mainParams: TODataParams,
  append: boolean
) => Promise<{
  records: any[]
  inlineCount?: number
  append: boolean
  nextSkip: number
  loadedCount: number
}>
```

### Error Types

```typescript
// Fetch error interface
interface IFetchError extends Error {
  status: number
  statusText: string
  response: Response
}

// SAP OData error
class SapODataError extends Error {
  code: string
  message: string
  innererror?: {
    application?: object
    transactionid?: string
    timestamp?: string
  }
}
```

## Utility Functions

### checkODataFilter

Validates filter conditions:

```typescript
import { checkODataFilter } from 'notsapodata'

const filter = fieldsFilters.Customer
const check = checkODataFilter(filter)

check.hasEmpty() // true if filter is empty
check.hasConditional() // true if has conditional operators
check.isValid() // true if filter is valid
```

### fieldsFiltersToODataFilters

Convert UI filters to OData format (from notsapui/utils):

```typescript
import { fieldsFiltersToODataFilters } from 'notsapui/utils'

const uiFilters = {
  Customer: [{ value: ['CUST001', 'CUST002'] }],
  Status: [{ value: ['ACTIVE'], operator: 'eq' }],
}

const odataFilters = fieldsFiltersToODataFilters(uiFilters)
// Result: [
//   { Customer: { in: ['CUST001', 'CUST002'] } },
//   { Status: { eq: 'ACTIVE' } }
// ]
```

## Usage Examples

### Basic Setup and Query

```typescript
import { MainModel } from '@/.odata.types'

// Get model instance
const model = MainModel.getInstance()
model.options.useBatch = true

// Simple read
const customers = await model.read(MainModel.entityAliases.Customers, {
  $top: 50,
  $filter: "Country eq 'US'",
  $select: ['Customer', 'Name', 'Country'],
  $orderby: 'Name asc',
})

console.log(customers.data)
```

### With Metadata Refinement

```typescript
onMounted(async () => {
  const metadata = await model.getMetadata()
  const customerSet = metadata.getEntitySet(MainModel.entityAliases.Customers)

  // Customize labels
  customerSet.refineField('Customer', { $label: 'Business Partner' })
  customerSet.refineField('HotelGroupingKey', { $label: 'Grouping Key' })

  // Add description fields
  customerSet.refineField('CompanyCode', { $$description: 'CompanyCodeDesc' })
})
```

### Complex Query with Aggregation

```typescript
const customQuery: TODataEntityCustomQuery<FP04Model, 'LineItems'> = async (
  entity,
  mainParams,
  append
) => {
  const batch = entity.getModel().createBatch()
  const metadata = await entity.getModel().getMetadata()
  const entitySet = metadata.getEntitySet('LineItems')

  // Main data
  const lines = batch.read('LineItems', mainParams)

  // Aggregated totals
  const { params: aggParams } = entitySet.prepareQuery({
    apply: {
      filters: mainParams.$filter,
      group: {
        fields: ['Category', 'Currency'],
        aggregate: ['Amount'],
      },
    },
  })

  const totals = batch.read('LineItems', {
    ...mainParams,
    $apply: aggParams.$apply,
    $top: 999999,
  })

  await batch.execute().promise

  const { data: lineData, count } = await lines
  const { data: totalData } = await totals

  // Process and merge results
  const processedResults = mergeWithTotals(lineData, totalData)

  return {
    records: processedResults,
    inlineCount: count,
    append: false,
    nextSkip: lineData.length,
    loadedCount: lineData.length,
  }
}
```

### Error Handling

```typescript
import { IFetchError, SapODataError } from 'notsapodata'

try {
  await model.update('Customers', 'CUST001', {
    Status: 'INACTIVE',
  })
} catch (error) {
  if (error instanceof SapODataError) {
    console.error('SAP Error:', error.code, error.message)
    console.error('Transaction ID:', error.innererror?.transactionid)
  } else if ((error as IFetchError).status) {
    const fetchError = error as IFetchError
    console.error('HTTP Error:', fetchError.status, fetchError.statusText)
  } else {
    console.error('Unknown error:', error)
  }
}
```

### Using useModel Composable

```typescript
import { useModel } from 'notsapodata'
import { MainModel, type TMainModelType } from '@/.odata.types'

function useGroupTypeahead() {
  const model = useModel<TMainModelType>(MainModel.name)

  async function loadKeys() {
    const result = await model.read(MainModel.entityAliases.Groups, {
      $top: 999,
      $select: ['Grouping'],
    })

    return result.data.map(r => r.Grouping).filter(Boolean)
  }

  return { loadKeys }
}
```

## Best Practices

1. **Always use the singleton pattern** for model instances:

   ```typescript
   const model = MainModel.getInstance()
   ```

2. **Enable batch mode** for multiple operations:

   ```typescript
   model.options.useBatch = true
   ```

3. **Type your filters and sorters**:

   ```typescript
   const filters: TODataFieldsFilters<TCustomersFields> = {}
   const sorters: TEntitySetSorter<TCustomersFields>[] = []
   ```

4. **Handle errors appropriately**:

   ```typescript
   try {
     await model.operation()
   } catch (error) {
     if (error instanceof SapODataError) {
       // Handle SAP-specific errors
     }
   }
   ```

5. **Use metadata refinement** for better UX:

   ```typescript
   entitySet.refineField('Field', {
     $label: 'User Friendly Label',
     $$description: 'DescriptionField',
   })
   ```

6. **Leverage TypeScript** for compile-time safety:
   ```typescript
   // This will error if 'InvalidField' doesn't exist
   const fields: TMainModelCustomersFields[] = ['Customer', 'InvalidField']
   ```

## Advanced Features

### Apply Operations (OData v4)

```typescript
const result = await model.read('EntitySet', {
  $apply: 'groupby((Category,Country),aggregate(Amount with sum as TotalAmount))',
})
```

### Custom Headers

```typescript
model.options.headers = {
  'X-Custom-Header': 'value',
  'Accept-Language': 'en-US',
}
```

### CSRF Token Handling

Automatically handled when `csrfFetch: true`:

```typescript
// Token is fetched and included automatically
await model.create('EntitySet', data)
```

### Pagination Helper

```typescript
async function* paginate(pageSize = 50) {
  let skip = 0
  let hasMore = true

  while (hasMore) {
    const result = await model.read('EntitySet', {
      $top: pageSize,
      $skip: skip,
      $count: true,
    })

    yield result.data

    skip += pageSize
    hasMore = skip < (result.count || 0)
  }
}

// Usage
for await (const page of paginate()) {
  processRecords(page)
}
```

This documentation provides comprehensive coverage of the notsapodata module, including setup, type generation, core functionality, and practical examples for building type-safe OData applications.
