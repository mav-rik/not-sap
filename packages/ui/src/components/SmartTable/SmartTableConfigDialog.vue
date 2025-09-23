<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EntitySetField, TEntitySetSorter } from 'notsapodata'
import SmartTableConfigFieldsSelector from './SmartTableConfigFieldsSelector.vue'
import SmartTableConfigSorters from './SmartTableConfigSorters.vue'
import { useSmartTablePI } from './SmartTable.pi'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuTabs from 'vunor/Tabs.vue'
import VuIcon from 'vunor/Icon.vue'

const open = defineModel<boolean>('open')

const emit = defineEmits<{
  (e: 'apply'): void
}>()

const columnsDialogModel = defineModel<string[]>('columns', { default: () => [] })
const filtersDialogModel = defineModel<string[]>('filters', { default: () => [] })
const sortersDialogModel = defineModel<TEntitySetSorter[]>('sorters', {
  default: () => [],
})

const sortersDialogModelNorm = ref<Exclude<TEntitySetSorter, string>[]>([])
watch([sortersDialogModel], () => {
  if (sortersDialogModelNorm.value !== sortersDialogModel.value) {
    sortersDialogModelNorm.value = sortersDialogModel.value.map(item =>
      typeof item === 'string' ? { name: item } : item
    )
  }
})

sortersDialogModel.value = sortersDialogModelNorm.value

defineProps<{
  fieldsMap: Map<string, EntitySetField>
  filterableFields: Map<string, EntitySetField>
  sortableFields: Map<string, EntitySetField>
  tableName?: string
}>()

const tabs = [
  { value: 'columns' as const, label: 'Columns', icon: 'i--columns' },
  { value: 'filters' as const, label: 'Filters', icon: 'i--filter' },
  { value: 'sorters' as const, label: 'Sorters', icon: 'i--sort' },
]

const tab = defineModel<(typeof tabs)[number]['value']>('tab', { default: 'columns' })

const { entity, fieldsFilters } = useSmartTablePI().inject()

function onApply() {
  sortersDialogModel.value = sortersDialogModelNorm.value
  emit('apply')
}
</script>

<template>
  <VuDialog
    v-model:open="open"
    modal
    class="layer-0 elevated h-52rem max-h-[min(100vh,52rem)] w-44rem max-w-[min(100vw,44rem)]"
    close-button
    level="h6"
    content-class="flex-grow-1 overflow-auto"
    rounded
    :footer-buttons="['Apply', 'Cancel']"
    @footer-click-apply="onApply"
  >
    <template v-slot:header>
      <header class="dialog-header border-b z-2 flex justify-between pb-0 max-sm:flex-col">
        <VuCardHeader class="truncate pr-$m max-w-70% mb-$xxs">
          {{ tableName || entity?.getLabel() }}
        </VuCardHeader>

        <VuTabs indicator v-model="tab" :tabs class="flex-shrink-0 mr-$l">
          <template v-slot="{ label, icon }">
            <div class="c8-flat tab gap-$s"><VuIcon :name="icon" /> {{ label }}</div>
          </template>
        </VuTabs>
      </header>
    </template>

    <SmartTableConfigFieldsSelector
      v-if="tab === 'columns'"
      title="Columns"
      :fields-map
      v-model="columnsDialogModel"
    >
      <template #additional="{ item }">
        <div v-if="fieldsFilters[item.$Name]?.length" class="flex items-center gap-$xs opacity-70">
          <VuIcon name="i--filter" /> {{ fieldsFilters[item.$Name]?.length }}
        </div>
      </template>
    </SmartTableConfigFieldsSelector>

    <SmartTableConfigFieldsSelector
      v-else-if="tab === 'filters'"
      title="Filters"
      :fields-map="filterableFields"
      v-model="filtersDialogModel"
    >
      <template #additional="{ item }">
        <div v-if="fieldsFilters[item.$Name]?.length" class="flex items-center gap-$xs opacity-70">
          <VuIcon name="i--filter" /> {{ fieldsFilters[item.$Name]?.length }}
        </div>
      </template>
    </SmartTableConfigFieldsSelector>

    <SmartTableConfigSorters
      v-else-if="tab === 'sorters'"
      :fields-map="sortableFields"
      v-model="sortersDialogModelNorm"
    />
  </VuDialog>
</template>
