<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/notsap.png" alt="Not SAP" width="180" />
</p>

# notsapui Library Documentation

## Overview

notsapui is a type-safe Vue 3 component library that provides SAP-like UI components for building data-driven applications with OData services. It offers smart components that automatically handle data fetching, filtering, sorting, and display based on OData metadata.

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/notsapui-table.webp" alt="Not SAP" />
</p>


### Type Safety with notsapodata

notsapui achieves full type safety through the `notsapodata` vite plugin that generates TypeScript types from OData service metadata. This integration provides:

- **Compile-time type checking** for all OData operations
- **IntelliSense support** for entity fields, filters, and sorters
- **Auto-completion** for field names and values
- **Type-safe props** in all smart components
- **Generated model classes** with singleton pattern

The type generation happens at build time using the `.odata.types.ts` file (see [notsapodata setup](../odata/README.md#vite-plugin-setup-for-type-generation) for details).

### Prerequisites

1. Configure the `notsapodata` vite plugin to generate types (see [notsapodata setup](../odata/README.md#vite-plugin-setup-for-type-generation))
2. Set up a development proxy for SAP OData services
3. Import and use the generated types from `.odata.types.ts`

## Architecture: Renderless Components & Provide/Inject Pattern

notsapui uses a powerful renderless component architecture combined with Vue's provide/inject pattern to create a flexible, composable data flow. This design enables deep component trees to access shared data and functionality without prop drilling.

### Why This Architecture?

1. **Separation of Concerns**: Data management logic is separated from presentation components
2. **No Prop Drilling**: Deep nested components can access context without passing props through every level
3. **Type Safety**: Full TypeScript support through the provide/inject chain
4. **Flexibility**: Components can be composed in any order while maintaining access to context
5. **Performance**: Only components that inject context re-render when data changes

### The Provide/Inject Composables (notsapui/pi)

All composables from `notsapui/pi` follow a consistent pattern using `useProvideInject`:

```typescript
import { useODataEntitySetPI } from 'notsapui/pi';

// In provider component
const { provide } = useODataEntitySetPI();
const injected = provide(props);

// In consumer component
const { inject } = useODataEntitySetPI();
const { entity, fields, model, metadata } = inject();
```

These composables create a type-safe bridge between provider and consumer components, ensuring that:

- Providers expose a consistent API
- Consumers get full IntelliSense for available data
- TypeScript catches mismatches at compile time

## Key Components

### 1. NotSapApp (Root Context Provider)

A renderless component that provides the application namespace for preset storage.

**What it provides:**

- `appNamespace`: Application identifier used for storing user presets (table configurations, filters, column settings)

**Implementation:**

```vue
<script setup lang="ts">
import { computed, provide } from 'vue';
const props = defineProps<{ namespace: string }>();
const appNamespace = computed(() => props.namespace);
provide('__not_sap_app_namespace__', appNamespace);
</script>
<template><slot></slot></template>
```

**Usage:**

```vue
<NotSapApp namespace="com.mycompany.products.app">
  <!-- All child components can access the namespace -->
  <!-- Used for storing table presets per application -->
</NotSapApp>
```

### 2. ODataEntitySet (Data Context Provider)

A renderless component that provides OData model and entity set context to all child components.

**What it provides via `useODataEntitySetPI`:**

- `model`: The OData model instance
- `entity`: The entity set instance for queries
- `fields`: Array of field definitions
- `fieldsMap`: Map of field names to field metadata
- `metadata`: Full OData metadata
- `metadataLoading`: Loading state for metadata
- `metadataLoadingError`: Any metadata loading errors
- `appNamespace`: Inherited from NotSapApp

**Usage:**

```vue
<ODataEntitySet :model="model" :entity-set="entitySet">
  <!-- All child components have access to OData context -->
  <SmartTable /> <!-- Can access entity, fields, etc. -->
  <SmartFilter /> <!-- Can access fieldsMap for validation -->
</ODataEntitySet>
```

**Accessing in child components:**

```typescript
import { useODataEntitySetPI } from 'notsapui/pi';

const { entity, fields, fieldsMap, model } = useODataEntitySetPI().inject();

// Now you have type-safe access to:
// - entity.value?.query() for data fetching
// - fields.value for field list
// - fieldsMap.value.get('ProductId') for field metadata
```

### 3. UseEntitySetContext (Context Consumer Helper)

A utility renderless component that extracts and exposes ODataEntitySet context via slot props.

**Purpose:** Makes injected context available as slot props for template usage.

**Implementation:**

```vue
<script setup lang="ts">
import { useODataEntitySetPI } from './ODataEntitySet.pi';
const injected = useODataEntitySetPI().inject();
</script>
<template>
  <slot v-bind="injected"></slot>
</template>
```

**Usage:**

```vue
<UseEntitySetContext v-slot="{ entity, fields, model }">
  <!-- Direct template access to context -->
  <div>Entity: {{ entity?.getName() }}</div>
  <div>Fields: {{ fields.length }}</div>
</UseEntitySetContext>
```

### 4. SmartTableRoot

The root component for smart tables that provides table state management.

**What it provides via `useSmartTablePI`:**

- Query management (`queryImmediate`, `querying`, `results`)
- Filter state (`fieldsFilters`, `fieldsFiltersCount`, `resetFilters`)
- Column/field configuration (`columnsNames`, `filtersNames`)
- Data state (`inlineCount`, `loadedCount`, `selected`)
- UI helpers (`showConfigDialog`, `mustRefresh`)
- Export functionality (`readAllEntries`)

**Usage with slot props:**

```vue
<SmartTableRoot
  :top="50"
  v-slot="{
    showConfigDialog,
    inlineCount,
    queryImmediate,
    querying,
    fieldsFiltersCount,
    resetFilters,
    loadedCount,
  }"
>
  <button @click="queryImmediate">Refresh ({{ loadedCount }}/{{ inlineCount }})</button>
  <button @click="showConfigDialog">Configure</button>
  <!-- Table content -->
</SmartTableRoot>
```

**Accessing via composable in any child:**

```typescript
import { useSmartTablePI } from 'notsapui/pi';

const { queryImmediate, results, selected, fieldsFilters } = useSmartTablePI().inject();

// Trigger a refresh
queryImmediate();

// Access current results
console.log(results.value);
```

## Available Provide/Inject Composables

### useODataEntitySetPI

Provides access to OData model and entity set context.

```typescript
import { useODataEntitySetPI } from 'notsapui/pi';

// In a component under ODataEntitySet
export default {
  setup() {
    const { entity, fields, fieldsMap, model, metadata } = useODataEntitySetPI().inject();

    // Use entity for queries
    const loadData = async () => {
      const result = await entity.value?.query({
        $top: 50,
        $filter: 'Status eq "ACTIVE"',
      });
    };

    // Access field metadata
    const getFieldLabel = (fieldName: string) => {
      return fieldsMap.value.get(fieldName)?.$label;
    };

    return { loadData, getFieldLabel };
  },
};
```

### useSmartTablePI

Provides access to smart table state and controls.

```typescript
import { useSmartTablePI } from 'notsapui/pi';

// In a component under SmartTableRoot
export default {
  setup() {
    const {
      queryImmediate, // Function to trigger query
      results, // Current table results
      selected, // Selected rows
      fieldsFilters, // Active filters
      columnsNames, // Visible columns
      inlineCount, // Total count from server
      readAllEntries, // Export function
      showConfigDialog, // Show configuration UI
    } = useSmartTablePI().inject();

    // Custom export button
    const exportToExcel = async () => {
      const { records, done } = readAllEntries({ chunkSize: 1000 });
      // Process records for export
    };

    return { exportToExcel };
  },
};
```

## Data Flow Example

Here's how data flows through the component hierarchy:

```vue
<template>
  <!-- 1. Root context: namespace for presets -->
  <NotSapApp namespace="com.company.app">
    <!-- 2. OData context: model and entity set -->
    <ODataEntitySet :model="ProductModel.getInstance()" :entity-set="'Products'">
      <!-- 3. Table context: state management -->
      <SmartTableRoot>
        <!-- 4. Any child can access all parent contexts -->
        <MyCustomToolbar />
        <!-- Can use useSmartTablePI() and useODataEntitySetPI() -->

        <SmartTable />
        <!-- Uses both contexts internally -->

        <SmartTableFilter />
        <!-- Uses entity metadata for field types -->

        <MyCustomExporter />
        <!-- Can use readAllEntries from SmartTableRoot -->
      </SmartTableRoot>
    </ODataEntitySet>
  </NotSapApp>
</template>
```

## Benefits of This Architecture

### 1. Clean Component APIs

Components don't need dozens of props - they get what they need from context:

```vue
<!-- Without context (prop drilling nightmare) -->
<DeepChild
  :model="model"
  :entity="entity"
  :fields="fields"
  :results="results"
  :filters="filters"
  ...
  (20+
  more
  props)
/>

<!-- With context (clean and simple) -->
<DeepChild />
<!-- Gets everything via inject -->
```

### 2. Flexible Composition

Components can be rearranged without breaking data flow:

```vue
<!-- These all work because of context -->
<ODataEntitySet :model="model" :entity-set="entitySet">
  <CustomWrapper>
    <AnotherWrapper>
      <SmartTable /> <!-- Still has access to entity context -->
    </AnotherWrapper>
  </CustomWrapper>
</ODataEntitySet>
```

### 3. Type Safety Throughout

TypeScript knows exactly what's available at each level:

```typescript
// Full IntelliSense and type checking
const { entity } = useODataEntitySetPI<ProductModel, 'Products'>().inject();
// entity is typed as Ref<EntitySet<TProductModel, 'Products'>>
```

### 4. Performance Optimization

Only components that actually inject and use the data will re-render when it changes. Intermediate wrapper components don't cause unnecessary renders.

### 5. Testability

Each context can be mocked independently for testing:

```typescript
// Mock the OData context for testing
const mockProvide = {
  entity: ref(mockEntity),
  fields: computed(() => mockFields),
  // ...
};
provide('not-sap-ui-entity-set', mockProvide);
```

## Visual Components

### 1. SmartTable

The main table component that renders data with automatic sorting, filtering, and pagination.

```vue
<SmartTable
  v-model:results="results"
  v-model:selected="selected"
  v-model:filters-names="filtersNames"
  v-model:columns-names="columnsNames"
  v-model:fields-filters="fieldsFilters"
  :force-select="forceSelectFields"
  :select-mode="'multi'"
  :row-height="40"
  :block-query="blockQuery"
  :variant-key="'products'"
>
  <!-- Cell templates -->
  <template #cell-ProductId="{ value, row }">
    <a @click="showDetails(row)">{{ value }}</a>
  </template>
  <template #cell-Status="{ value }">
    <span :class="getStatusColor(value)">{{ value }}</span>
  </template>
</SmartTable>
```

### 2. SmartTableFilter

Provides filtering UI for SmartTable columns.

```vue
<SmartTableFilter
  v-model="fieldsFilters"
  :fields="filterFields"
  :filter-value-formatters="{
    ProductId: (s: string) => s.toUpperCase(),
    Price: (s: string) => s.replace(/[^0-9.]/g, '')
  }"
/>
```

### 3. SmartRecordDialog

A dialog component for displaying and editing single records.

```vue
<SmartRecordDialog
  v-model:open="dialogOpen"
  :record="selectedRecord"
  :header-fields="['ProductId', 'Name', 'Category']"
  title-field="Name"
  sub-title-field="ProductId"
  fetch-data
  hide-unit-fields
  hide-description-fields
  :groups="{
    'Basic Information': ['Description', 'Price', 'Currency'],
    Inventory: ['Quantity', 'Location', 'LastRestocked'],
    Metadata: ['CreatedBy', 'CreatedDate', 'ModifiedDate'],
  }"
/>
```

## Development Setup

### SAP OData Proxy Configuration

For local development, create a proxy to forward requests to your SAP system:

**sap-proxy.ts:**

```typescript
import { readFileSync, existsSync } from 'node:fs';

function readEnv(): { target: string; cookie: string } {
  if (!existsSync('./.env')) {
    return { target: '', cookie: '' };
  }
  const envString = readFileSync('./.env').toString();
  const env = {} as {
    SAP_HOST?: string;
    SAP_COOKIE_NAME?: string;
    SAP_COOKIE_VALUE?: string;
  };
  envString.split('\n').forEach((line) => {
    const parts = line.split('=');
    env[parts[0] as keyof typeof env] = parts.slice(1).join('');
  });

  const target = env.SAP_HOST || 'https://sap-dev.example.com';
  return {
    target,
    cookie: `${env.SAP_COOKIE_NAME}=${env.SAP_COOKIE_VALUE}`,
  };
}

const { target, cookie } = readEnv();

export const proxy = {
  '/sap/opu': {
    target,
    changeOrigin: true,
    headers: { cookie },
    secure: false,
  },
  '/sap/bc/ui2': {
    target,
    changeOrigin: true,
    headers: { cookie },
    secure: false,
  },
};
```

**.env file:**

```bash
SAP_HOST=https://sap-dev.example.com
SAP_COOKIE_NAME=SAP_SESSIONID
SAP_COOKIE_VALUE=your_session_cookie_value
```

**vite.config.ts:**

```typescript
import { proxy } from './sap-proxy';

export default defineConfig({
  server: {
    proxy,
  },
  // ... other config
});
```

This setup enables the OData plugin to fetch metadata during build time and allows runtime access to SAP services in development.

## Using Generated Types

After configuring the notsapodata plugin (see [notsapodata setup](../odata/README.md#vite-plugin-setup-for-type-generation)), import and use the generated types:

```typescript
import { ProductModel, type TProductModelType } from '@/.odata.types';

// Model is a singleton with type-safe entity aliases
const model = ProductModel.getInstance();
model.options.useBatch = true;

// Type-safe entity set reference
const entitySet = ProductModel.entitySetAliases.Products;
```

For metadata refinement and OData operations, refer to the [notsapodata reference](../odata/README.md#core-classes-and-types).

## Complete Type-Safe Example

### SmartTable with Full Type Safety

A complete example showing type-safe smart table implementation:

```vue
<template>
  <ODataEntitySet :model="model" :entity-set="entitySet">
    <SmartTableRoot
      :top="50"
      v-slot="{
        showConfigDialog,
        inlineCount,
        queryImmediate,
        querying,
        fieldsFiltersCount,
        resetFilters,
        mustRefresh,
        loadedCount,
      }"
    >
      <!-- Filters -->
      <SmartTableFilter v-model="fieldsFilters" :fields="filtersNames" />

      <!-- Main table -->
      <SmartTable
        v-model:results="results"
        v-model:selected="selected"
        v-model:filters-names="filtersNames"
        v-model:columns-names="columnsNames"
        v-model:fields-filters="fieldsFilters"
        :force-select="forceSelect"
        :select-mode="'multi'"
        :row-height="40"
        :custom-query="customQuery"
      >
        <!-- Custom cell rendering -->
        <template #cell-ProductId="{ value, row }">
          <a @click="showDetails(row)">{{ value }}</a>
        </template>

        <template #cell-Status="{ value }">
          <span :class="getStatusClass(value)">{{ value }}</span>
        </template>
      </SmartTable>

      <!-- Toolbar -->
      <div v-if="selected.length > 0">
        <button @click="exportSelected">Export {{ selected.length }} items</button>
      </div>

      <!-- Detail dialog -->
      <SmartRecordDialog
        v-model:open="detailsDialog"
        v-if="selectedRow"
        :record="selectedRow"
        :header-fields="['ProductId', 'Name', 'Category']"
        title-field="Name"
        sub-title-field="ProductId"
        fetch-data
        :groups="{
          'Basic Info': ['Description', 'Price', 'Currency'],
          Stock: ['Quantity', 'Location', 'LastUpdate'],
        }"
      />
    </SmartTableRoot>
  </ODataEntitySet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ProductModel, type TProductModelProductsFields } from '@/.odata.types';
import ODataEntitySet from 'notsapui/ODataEntitySet.vue';
import SmartTableRoot from 'notsapui/SmartTableRoot.vue';
import SmartTable from 'notsapui/SmartTable.vue';
import SmartTableFilter from 'notsapui/SmartTableFilter.vue';
import SmartRecordDialog from 'notsapui/SmartRecordDialog.vue';
import { checkODataFilter, type TODataFieldsFilters } from 'notsapodata';
import type { TODataEntityCustomQuery } from 'notsapui/pi';

// Type-safe model setup
const model = ProductModel.getInstance();
model.options.useBatch = true;
const entitySet = ProductModel.entitySetAliases.Products;

// Type-safe state with generated types
const results = ref<Record<TProductModelProductsFields, string>[]>([]);
const selected = ref<Record<TProductModelProductsFields, string>[]>([]);
const fieldsFilters = ref<TODataFieldsFilters<TProductModelProductsFields>>({});
const filtersNames = ref<TProductModelProductsFields[]>([
  'ProductId',
  'Name',
  'Category',
  'Status',
]);
const columnsNames = ref<TProductModelProductsFields[]>(['ProductId', 'Name', 'Price', 'Status']);

// Type-safe force select fields
const forceSelect: TProductModelProductsFields[] = ['ProductId', 'Name', 'ModifiedDate'];

// UI state
const detailsDialog = ref(false);
const selectedRow = ref<Record<TProductModelProductsFields, string>>();

// Custom query for complex scenarios (optional)
const customQuery: TODataEntityCustomQuery<
  ProductModel,
  typeof ProductModel.entitySetAliases.Products
> = async (entity, mainParams, append) => {
  // Custom data fetching logic
  const result = await entity.query(mainParams);
  return {
    records: result.data,
    inlineCount: result.count,
    append: false,
    nextSkip: result.data.length,
    loadedCount: result.data.length,
  };
};

// Helper functions
function showDetails(row: Record<TProductModelProductsFields, string>) {
  selectedRow.value = row;
  detailsDialog.value = true;
}

function getStatusClass(status: string) {
  return {
    'text-green': status === 'ACTIVE',
    'text-red': status === 'INACTIVE',
    'text-gray': status === 'PENDING',
  };
}

function exportSelected() {
  console.log('Exporting:', selected.value);
}
</script>
```

## Custom Query with Type Safety

Leverage generated types for custom query implementations:

```typescript
import type { TODataEntityCustomQuery } from 'notsapui/pi';
import { ProductModel, type TProductModelType } from '@/.odata.types';

const customQuery: TODataEntityCustomQuery<
  ProductModel,
  typeof ProductModel.entitySetAliases.Products
> = async (entity, mainParams, append) => {
  // Type-safe entity and params
  const batch = entity.getModel().createBatch();

  // Your custom logic here
  const result = await batch.read(ProductModel.entitySetAliases.Products, mainParams);

  return {
    records: result.data,
    inlineCount: result.count,
    append: false,
    nextSkip: result.data.length,
    loadedCount: result.data.length,
  };
};
```

For detailed custom query examples, see [notsapodata usage examples](../odata/README.md#usage-examples).

## Utility Functions

### fieldsFiltersToODataFilters

Converts UI filter format to OData filter format:

```typescript
import { fieldsFiltersToODataFilters } from 'notsapui/utils';

const filters = fieldsFiltersToODataFilters(fieldsFilters.value);
// Returns OData-compatible filter array
```

For other utility functions like `checkODataFilter`, see the [notsapodata utility section](../odata/README.md#utility-functions).

## Composables

### useSmartTablePI

Access smart table programmatic interface:

```typescript
import { useSmartTablePI } from 'notsapui/pi';

const tablePI = useSmartTablePI();
const injected = tablePI.inject();

// Access table state
injected.queryImmediate(); // Trigger query
injected.showConfigDialog(); // Show configuration dialog
injected.resetFilters(); // Reset all filters
injected.readAllEntries(); // Read all entries
```

### useODataEntitySetPI

Access entity set context:

```typescript
import { useODataEntitySetPI } from 'notsapui/pi'

const entitySetPI = useODataEntitySetPI()
const { entity, model } = entitySetPI.inject()

// Use entity for queries
await entity.value.query({ filter: [...] })
```

## Best Practices

1. **Use generated types everywhere** for compile-time safety:

   ```typescript
   // Always import and use generated types
   import type { TProductModelProductsFields } from '@/.odata.types';

   const fields: TProductModelProductsFields[] = ['ProductId', 'Status'];
   ```

2. **Define force-select fields** with type safety:

   ```typescript
   const forceSelect: TProductModelProductsFields[] = [
     'ProductId', // IntelliSense shows available fields
     'Name',
     'ModifiedDate',
   ];
   ```

3. **Implement query blocking** for performance:

   ```typescript
   const blockQuery = computed(() => {
     const filters = Object.entries(fieldsFilters.value).filter(
       ([, v]) => !checkODataFilter(v).hasEmpty()
     );

     if (!filters.length) {
       return {
         reason: 'Please provide at least one filter',
         filters: [] as TProductModelProductsFields[],
       };
     }
   });
   ```

4. **Type your custom queries**:
   ```typescript
   const customQuery: TODataEntityCustomQuery<
     ProductModel,
     typeof ProductModel.entitySetAliases.Products
   > = async (entity, params, append) => {
     // Type-safe custom logic
   };
   ```

For OData-specific best practices (batch mode, metadata refinement), see the [notsapodata best practices](../odata/README.md#best-practices).

## Type-Safe Component Props

All notsapui components leverage the generated types for compile-time safety:

```typescript
import type { TProductModelProductsFields } from '@/.odata.types'

// SmartTable with type-safe props
<SmartTable
  :force-select="forceSelect"  // TProductModelProductsFields[]
  :required-filters="['ProductId', 'Status']"  // Auto-completed field names
  v-model:fields-filters="fieldsFilters"  // TODataFieldsFilters<TProductModelProductsFields>
/>

// Type-safe field arrays
const forceSelect: TProductModelProductsFields[] = ['ProductId', 'Name', 'Status']
const columnsNames = ref<TProductModelProductsFields[]>([])

// Type-safe filter objects
const fieldsFilters = ref<TODataFieldsFilters<TProductModelProductsFields>>({})
```

For complete TypeScript type definitions, see the [notsapodata type reference](../odata/README.md#typescript-types).

## Shortcuts Integration

notsapui integrates with Vunor shortcuts:

```typescript
import { notsapuiVunorShortcuts } from 'notsapui/vunor';

// Register shortcuts
const shortcuts = notsapuiVunorShortcuts();
```

This enables keyboard shortcuts for table navigation, selection, and actions.
