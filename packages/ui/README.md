<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsap.png" alt="Not SAP" width="180" />
</p>

# notsapui

## Overview

Vue 3 component library for building OData-driven applications. Provides smart tables, dialogs, and filters that work with OData metadata.

[Demo Application](https://github.com/mav-rik/not-sap-demo)

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap/main/docs/notsapui-table.webp" alt="Not SAP" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mav-rik/not-sap-demo/main/docs/table-record.gif" alt="Not SAP" />
</p>

### Prerequisites

1. Configure `notsapodata` vite plugin to generate types from OData metadata ([setup guide](../odata/README.md#vite-plugin-setup-for-type-generation))
2. Set up development proxy for OData services
3. Import generated types from `.odata.types.ts`

## Architecture

Uses renderless components with Vue's provide/inject pattern to share OData context through component trees without prop drilling.

### Provide/Inject Composables

Composables from `notsapui/pi` create typed context:

```typescript
import { useODataEntitySetPI } from 'notsapui/pi';

// Provider
const { provide } = useODataEntitySetPI();
provide(props);

// Consumer
const { inject } = useODataEntitySetPI();
const { entity, fields, model } = inject();
```

## Key Components

### 1. NotSapApp

Provides application namespace for storing user presets (variants in SAP, relevant only for SAP based services).

**Usage:**
```html
<NotSapApp namespace="com.mycompany.app">
  <!-- Child components access namespace -->
</NotSapApp>
```

### 2. ODataEntitySet

Provides OData model and entity set context.

**Provides:**
- `model` - OData instance
- `entity` - Entity set for queries
- `fields` - Field definitions
- `fieldsMap` - Field metadata
- `metadata` - OData metadata

**Usage:**
```html
<ODataEntitySet :model="model" :entity-set="entitySet">
  <SmartTable />
  <SmartFilter />
</ODataEntitySet>
```

**Access in children:**
```typescript
import { useODataEntitySetPI } from 'notsapui/pi';
const { entity, fields, model } = useODataEntitySetPI().inject();
```

### 3. UseEntitySetContext

Exposes OData context as slot props.

```html
<UseEntitySetContext v-slot="{ entity, fields, model }">
  <div>Entity: {{ entity?.getName() }}</div>
  <div>Fields: {{ fields.length }}</div>
</UseEntitySetContext>
```

### 4. SmartTableRoot

Manages table state and queries.

**Provides:**
- Query functions and state
- Filter state and controls
- Column configuration
- Selection and results
- Export functionality

**Usage:**
```html
<SmartTableRoot :top="50" v-slot="{ queryImmediate, inlineCount }">
  <button @click="queryImmediate">Refresh</button>
  <SmartTable />
</SmartTableRoot>
```

**Access in children:**
```typescript
import { useSmartTablePI } from 'notsapui/pi';
const { queryImmediate, results, selected } = useSmartTablePI().inject();
```

## Composables

### useODataEntitySetPI

```typescript
import { useODataEntitySetPI } from 'notsapui/pi';
const { entity, fields, fieldsMap, model } = useODataEntitySetPI().inject();
```

### useSmartTablePI

```typescript
import { useSmartTablePI } from 'notsapui/pi';
const { queryImmediate, results, selected, fieldsFilters } = useSmartTablePI().inject();
```

## Data Flow

```html
<NotSapApp namespace="com.company.app">
  <ODataEntitySet :model="model" :entity-set="'Products'">
    <SmartTableRoot>
      <SmartTable />
      <SmartTableFilter />
    </SmartTableRoot>
  </ODataEntitySet>
</NotSapApp>
```

Child components access parent context via `inject()` without prop drilling.

## Components

### SmartTable

Table with sorting, filtering, and pagination.

```html
<SmartTable
  v-model:results="results"
  v-model:selected="selected"
  v-model:columns-names="columnsNames"
  v-model:fields-filters="fieldsFilters"
  :select-mode="'multi'"
>
  <template #cell-ProductId="{ value, row }">
    <a @click="showDetails(row)">{{ value }}</a>
  </template>
</SmartTable>
```

### SmartTableFilter

Filter UI for table columns.

```html
<SmartTableFilter
  v-model="fieldsFilters"
  :fields="filterFields"
/>
```

### SmartRecordDialog

Dialog for viewing/editing records.

```html
<SmartRecordDialog
  v-model:open="dialogOpen"
  :record="selectedRecord"
  :header-fields="['ProductId', 'Name']"
  title-field="Name"
/>
```

## Development Setup

Configure Vite proxy for OData services:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/sap/opu': {
        target: process.env.SAP_HOST,
        changeOrigin: true,
        headers: { cookie: process.env.SAP_COOKIE },
      },
    },
  },
});
```

## Using Generated Types

```typescript
import { ProductModel } from '@/.odata.types';

const model = ProductModel.getInstance();
const entitySet = ProductModel.entitySetAliases.Products;
```

See [notsapodata docs](../odata/README.md) for type generation setup.

## Complete Example

```html
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

const model = ProductModel.getInstance();
const entitySet = ProductModel.entitySetAliases.Products;

const results = ref([]);
const selected = ref([]);
const fieldsFilters = ref({});
const filtersNames = ref(['ProductId', 'Name', 'Status']);
const columnsNames = ref(['ProductId', 'Name', 'Price']);

const detailsDialog = ref(false);
const selectedRow = ref();

function showDetails(row) {
  selectedRow.value = row;
  detailsDialog.value = true;
}
</script>
```

## Custom Query

```typescript
import type { TODataEntityCustomQuery } from 'notsapui/pi';

const customQuery: TODataEntityCustomQuery = async (entity, params) => {
  const result = await entity.query(params);
  return {
    records: result.data,
    inlineCount: result.count,
  };
};
```

## Utilities

```typescript
import { fieldsFiltersToODataFilters } from 'notsapui/utils';

const filters = fieldsFiltersToODataFilters(fieldsFilters.value);
```

See [notsapodata docs](../odata/README.md) for more utilities.


## Best Practices

1. Use generated types from `notsapodata` for field names and filters
2. Implement query blocking when filters are required
3. Use `forceSelect` to ensure critical fields are always fetched
4. Leverage provide/inject for shared state instead of props

See [notsapodata best practices](../odata/README.md#best-practices) for OData-specific guidance.


## Styling

Import pre-compiled styles:
```typescript
import 'notsapui/styles.css';
```

Or configure UnoCSS shortcuts and icons for raw components:
```typescript
// uno.config.ts
import { defineConfig, type Preset } from 'unocss';
import { presetVunor, vunorShortcuts } from 'vunor/theme';
import { notSapUiVunorShortcuts } from 'notsapui/vunor';
import { notSapIconsPreset } from 'notsapui/icons';

export default defineConfig({
  presets: [
    presetVunor() as Preset,
    notSapIconsPreset({
      // Override default icons (optional)
      'light-mode': 'line-md:light-dark-loop',
      'dark-mode': 'line-md:light-dark-loop',
      'details': 'ix:jigsaw-details-filled',
      'minimal': 'streamline-plump:table',
      'advanced': 'si:dashboard-vert-fill',
    }),
  ],
  shortcuts: [vunorShortcuts(notSapUiVunorShortcuts)],
});
```

### Icons

`notSapIconsPreset` provides default icons used by notsapui components. Icons come from [Iconify](https://icon-sets.iconify.design/).

**Override default icons:**
```typescript
notSapIconsPreset({
  'refresh': 'mdi:refresh',  // Override default refresh icon
  'search': 'mdi:magnify',   // Find icons at icon-sets.iconify.design
})
```

**Add custom icons:**
```typescript
notSapIconsPreset({
  'my-custom-icon': 'mdi:star',  // Use as: i--my-custom-icon
})
```

Use icons in templates with `i--<icon-name>` class:
```vue
<div class="i--refresh" />
<div class="i--search" />
<div class="i--my-custom-icon" />
```
