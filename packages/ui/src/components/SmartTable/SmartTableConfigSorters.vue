<script setup lang="ts">
import type { EntitySetField, TEntitySetSorter } from '@/_odata'
import OrderableListBox from '../OrderableListBox.vue'
import { isSmartTableInDevMode } from './dev-mode.composable'
import { useSmartTablePI } from './SmartTable.pi'

type TEntitySetSorterNorm = Exclude<TEntitySetSorter, string>

const props = defineProps<{
  fieldsMap: Map<string, EntitySetField>
}>()

const externalModel = defineModel<TEntitySetSorterNorm[]>({ default: () => [] })

const { forceSorters } = useSmartTablePI().inject()
const forceSortersList = computed(
  () => forceSorters.value?.map(s => (typeof s === 'string' ? s : s.name)) || undefined
)

const selected = ref([
  ...(forceSortersList.value || []),
  ...externalModel.value.map(item => item.name),
])

const forceMap = (() => {
  const m = new Map<string, { desc?: boolean }>()
  for (const item of forceSorters.value || []) {
    if (typeof item === 'string') {
      m.set(item, {})
    } else if (item.name) {
      m.set(item.name, { desc: item.desc })
    }
  }
  return m
})()

const orderDescMap = (() => {
  const m = new Map<string, boolean>()
  for (const item of externalModel.value) {
    m.set(item.name, !!item.desc)
  }
  for (const item of forceSorters.value || []) {
    if (typeof item !== 'string' && item.desc !== undefined) {
      m.set(item.name, item.desc)
    }
  }
  return m
})()

const items = ref<TEntitySetSorterNorm[]>(
  Array.from(props.fieldsMap.values()).map(f => ({
    name: f.$Name,
    desc: !!orderDescMap.get(f.$Name),
  }))
)

function switchOrder(item: TEntitySetSorterNorm) {
  if (forceMap.get(item.name)?.desc !== undefined) {
    return
  }
  item.desc = !item.desc
  orderDescMap.set(item.name, item.desc)
  updateExternalModel()
}

function updateExternalModel() {
  externalModel.value = selected.value.map(name => ({
    name,
    desc: orderDescMap.get(name),
  }))
}

const getLabel = (sorter: TEntitySetSorterNorm) =>
  isSmartTableInDevMode.value
    ? props.fieldsMap.get(sorter.name)!.$Name
    : props.fieldsMap.get(sorter.name)?.$label || props.fieldsMap.get(sorter.name)?.$Name || ''
const getValue = (sorter: TEntitySetSorterNorm) => props.fieldsMap.get(sorter.name)?.$Name!
</script>

<template>
  <OrderableListBox
    class="py-0 px-1px flex-grow-1 flex-shrink-1"
    title="Order by"
    :key="isSmartTableInDevMode ? 'dev' : 'user'"
    :items
    :disabled="forceSortersList"
    :get-label
    :get-value
    v-model="selected"
    @update:model-value="updateExternalModel()"
  >
    <template #label="{ item, label }">
      <div class="flex gap-$s items-center">
        <span class="w-14em block truncate" :title="label">
          {{ label }}
        </span>
        <VuButton
          class="btn-square c8-flat group-[[data-state=unchecked]]/lbindicator:hidden"
          :icon="item.desc ? 'i--sort-desc' : 'i--sort-asc'"
          :title="item.desc ? 'Descending' : 'Ascending'"
          @click="switchOrder(item)"
        />
      </div>
    </template>
    <template #additional="{ item }" v-if="forceSortersList">
      <VuIcon name="i--lock" v-if="forceSortersList.some(f => f === item.name)" />
    </template>
  </OrderableListBox>
</template>
