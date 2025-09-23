<script setup lang="ts">
import { useODataEntitySetPI } from '../../renderless/ODataEntitySet.pi'
import { useSmartTablePI, type TODataEntityCustomQuery } from './SmartTable.pi'
import type { TEntitySetSorter, TODataFieldsFilters, TODataFilters } from '@/_odata'
import SmartTableConfigDialog from './SmartTableConfigDialog.vue'
import { nextTick } from 'vue'
import SmartTableCreatePreset from './presets/SmartTableCreatePreset.vue'
import SmartTableManagePresets from './presets/SmartTableManagePresets.vue'

const { metadata, entity, fields, metadataLoading, fieldsMap } = useODataEntitySetPI().inject()

const props = withDefaults(
  defineProps<{
    top?: number
    skip?: number
    searchTerm?: string
    searchFocus?: string
    forceFilters?: string | TODataFilters
    forceSelect?: string[]
    forceSorters?: TEntitySetSorter[]
    queryOnMount?: boolean
    keepSelectedAfterRefresh?: boolean
    tableName?: string
    rowValueFn?: (row: Record<string, any>) => Record<string, any> | string
    customQuery?: TODataEntityCustomQuery<any, any, any>
    blockQuery?: boolean
    blockQueryReason?: string
    variantKey?: string
    enableVariants?: boolean
  }>(),
  {
    rowValueFn: (row: Record<string, any>) => row,
    top: 1000,
  }
)
const results = defineModel<Record<string, string>[]>('results', { default: () => [] })

const selectedRows = defineModel<
  Record<string, string> | string | (Record<string, string> | string)[]
>('selectedRows')

const filtersNames = defineModel<string[]>('filtersNames', {
  default: () => [],
})

const columnsNames = defineModel<string[]>('columnsNames', {
  default: () => [],
})

const sorters = defineModel<TEntitySetSorter[]>('sorters', {
  default: () => [],
})

const fieldsFilters = defineModel<TODataFieldsFilters>('fieldsFilters', {
  default: () => ({}),
})

const emit = defineEmits<{
  (e: 'initPreset'): void
}>()

const {
  fieldsFiltersCount,
  getFilterString,
  getODataFilters,
  model,
  querying,
  query,
  queryImmediate,
  readAllEntries,
  inlineCount,
  filters,
  columns,
  filterableFields,
  sortableFields,
  selectAll,
  resetFilters,
  mustRefresh,
  metadataLoadingPromise,
  metadataLoadingError,
  queryError,
  loadedCount,
  appNamespace,
  variantKey: tableVariantKey,
  presets,
  deletePreset,
  createPreset,
  updatePreset,
  applyPreset,
  activePreset,
  onInitPreset,
} = useSmartTablePI().provide({
  filtersNames,
  fieldsFilters,
  columnsNames,
  sorters,
  results,
  skip: computed(() => props.skip),
  top: computed(() => props.top),
  searchTerm: computed(() => props.searchTerm),
  searchFocus: computed(() => props.searchFocus),
  forceFilters: computed(() => props.forceFilters),
  forceSelect: computed(() => props.forceSelect),
  forceSorters: computed(() => props.forceSorters),
  blockQuery: computed(() => props.blockQuery),
  blockQueryReason: computed(() => props.blockQueryReason),
  rowValueFn: computed(() => props.rowValueFn),
  keepSelectedAfterRefresh: computed(() => props.keepSelectedAfterRefresh),
  selectedRows,
  showConfigDialog,
  showCreatePresetDialog,
  showManagePresetsDialog,
  customQuery: computed(() => props.customQuery),
  variantKey: computed(() => props.variantKey),
  enableVariants: props.enableVariants,
})

onInitPreset(() => emit('initPreset'))

watch([selectedRows], () => {
  if (Number(selectedRows.value?.length || 0) >= results.value.length && results.value.length > 0) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
})

onMounted(async () => {
  if (props.queryOnMount) {
    await metadataLoadingPromise.value
    await nextTick()
    queryImmediate()
  }
})

const configDialog = ref(false)
const createPresetDialog = ref(false)
const managePresetsDialog = ref(false)

const filtersDialogModel = ref<string[]>([])
const columnsDialogModel = ref<string[]>([])
const sortersDialogModel = ref<TEntitySetSorter[]>([])

const configTab = ref<'columns' | 'filters' | 'sorters'>('columns')

function showConfigDialog(_tab: 'columns' | 'filters' | 'sorters' = 'columns') {
  configTab.value = _tab
  filtersDialogModel.value = [...filtersNames.value]
  columnsDialogModel.value = [...columnsNames.value]
  sortersDialogModel.value = [...sorters.value]
  configDialog.value = true
}

function showCreatePresetDialog() {
  createPresetDialog.value = true
}
function showManagePresetsDialog() {
  managePresetsDialog.value = true
}

function onApplyConfig() {
  configDialog.value = false
  if (!sameArrays(columnsNames.value, columnsDialogModel.value)) {
    columnsNames.value = columnsDialogModel.value
  }
  if (!sameArrays(filtersNames.value, filtersDialogModel.value)) {
    filtersNames.value = filtersDialogModel.value
  }
  if (!sameArrays(sorters.value, sortersDialogModel.value)) {
    sorters.value = sortersDialogModel.value
  }
}

function sameArrays<T>(a1: T[], a2: T[]) {
  return JSON.stringify(a1) === JSON.stringify(a2)
}
</script>

<template>
  <slot
    :filters
    :columns
    :filterable-fields
    :sortable-fields
    :filters-names
    :columns-names
    :fields
    :entity
    :metadata
    :metadataLoading
    :showConfigDialog
    :showCreatePresetDialog
    :showManagePresetsDialog
    :fieldsFiltersCount
    :getFilterString
    :getODataFilters
    :metadata-loading-error
    :model
    :querying
    :query
    :query-immediate
    :read-all-entries
    :inlineCount
    :results
    :reset-filters
    :must-refresh
    :block-query
    :block-query-reason
    :fields-map
    :query-error
    :loaded-count
    :force-sorters
    :app-namespace="appNamespace"
    :variant-key="tableVariantKey"
    :presets
    :delete-preset
    :create-preset
    :update-preset
    :apply-preset
    :active-preset
    :on-init-preset
  >
  </slot>

  <SmartTableConfigDialog
    v-model:open="configDialog"
    :fields-map
    :filterable-fields
    :sortable-fields
    v-model:tab="configTab"
    v-model:columns="columnsDialogModel"
    v-model:filters="filtersDialogModel"
    v-model:sorters="sortersDialogModel"
    @apply="onApplyConfig"
  />

  <SmartTableCreatePreset v-model:open="createPresetDialog" />
  <SmartTableManagePresets v-model:open="managePresetsDialog" />
</template>
