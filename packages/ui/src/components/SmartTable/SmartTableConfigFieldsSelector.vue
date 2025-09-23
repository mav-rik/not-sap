<script setup lang="ts">
import { computed } from 'vue'
import type { EntitySetField } from '@notsap/odata'
import OrderableListBox from '../OrderableListBox.vue'
import { isSmartTableInDevMode } from './dev-mode.composable'

const props = defineProps<{
  fieldsMap: Map<string, EntitySetField>
  title: string
}>()

const items = computed(() => {
  return Array.from(props.fieldsMap.values())
})

const getLabel = (field: EntitySetField) =>
  isSmartTableInDevMode.value ? field.$Name : field.$label || field.$Name
const getValue = (field: EntitySetField) => field.$Name

const modelValue = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <OrderableListBox
    class="py-0 px-1px flex-grow-1 flex-shrink-1"
    :key="isSmartTableInDevMode ? 'dev' : 'user'"
    :title
    :items
    :get-label
    :get-value
    v-model="modelValue"
  >
    <template #additional="slotProps">
      <slot name="additional" v-bind="slotProps"> </slot>
    </template>
  </OrderableListBox>
</template>
