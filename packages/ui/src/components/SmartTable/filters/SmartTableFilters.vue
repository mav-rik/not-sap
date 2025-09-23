<script setup lang="ts" generic="T extends string">
import type { TODataTypedFilterValue } from 'notsapodata'
import { useSmartTablePI } from '../SmartTable.pi'
import SmartTableFilter from './SmartTableFilter.vue'

defineProps<{
  filtersNames?: T[]
  valueFormatters?: {
    [key in T]?: (value: string) => string
  }
}>()

const { filtersNames: _filtersNames } = useSmartTablePI().inject()

const emit = defineEmits<{
  change: [field: string, typedFilters: TODataTypedFilterValue[]]
}>()

function emitChange(field: string, fieldFilters: TODataTypedFilterValue[]) {
  emit('change', field, fieldFilters)
}
</script>
<template>
  <SmartTableFilter
    v-for="f of filtersNames || _filtersNames"
    :key="f"
    v-bind="$attrs"
    :field="f"
    @change="emitChange"
    :value-formatter="valueFormatters?.[f as keyof T]"
  />
</template>
