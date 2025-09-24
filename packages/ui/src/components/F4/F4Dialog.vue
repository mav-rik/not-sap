<script setup lang="ts">
import type { EntitySetField } from 'notsapodata'
import F4ValueHelp from './F4ValueHelp.vue'
import F4Conditions from './F4Conditions.vue'
import {
  convertF4Condition,
  isConditionFilled,
  type TODataTypedFilterValueDisplay,
} from '../SmartTable/filter-conditions.utils'
import DragScroll from '../DragScroll.vue'
import { type TODataTypedFilterValue } from 'notsapodata'
import FilterToken from '../FilterToken.vue'
import type { ComponentInstance } from 'vue'
import VuCard from 'vunor/Card.vue'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuTabs from 'vunor/Tabs.vue'
import VuCardInner from 'vunor/CardInner.vue'
import VuButton from 'vunor/Button.vue'

import { type Ref, computed, ref, onMounted, nextTick } from 'vue'
import { DialogClose } from 'radix-vue'
import SmartTableFavFiltersMenu from '../SmartTable/filters/SmartTableFavFiltersMenu.vue'
import { useSmartTablePI } from '../SmartTable/SmartTable.pi'
import { useSmartFilterPI } from '../SmartTable/filters/SmartFilter.pi'
import { useODataEntitySetPI } from '../../pi'

const props = withDefaults(
  defineProps<{
    field: EntitySetField
    filters?: TODataTypedFilterValue[]
  }>(),
  {
    filters: () => [],
  }
)

const useSmartFilter = useSmartFilterPI()

if (!useSmartFilter.inject()) {
  useSmartFilter.provide({
    fieldName: computed(() => props.field.$Name),
  })
}

const root = ref<ComponentInstance<typeof VuCard>>()

async function focusFirstInput() {
  await nextTick()
  root.value?.$el?.querySelector('input')?.focus()
}

onMounted(() => {
  focusFirstInput()
  distributeFilters(props.filters)
})

function distributeFilters(filters: TODataTypedFilterValue[]) {
  valueListConditions.value = []
  conditions.value = []
  for (const typed of filters) {
    if (typed.type === 'value') {
      valueListConditions.value.push({
        type: typed.type,
        value: typed.value,
      })
    } else {
      conditions.value.push({
        type: typed.type,
        value: typed.value,
      })
    }
  }
}

const emit = defineEmits<{
  apply: [TODataTypedFilterValue[]]
}>()

const tabs = [
  { value: 'value-help' as const, label: 'Value Help' },
  { value: 'conditions' as const, label: 'Conditions' },
]

const tab = ref<(typeof tabs)[number]['value']>('value-help')

const valueListCollection = computed(
  () =>
    props.field.annotations['Common.ValueList']?.CollectionPath ||
    props.field.annotations['SAP__common.ValueListReferences']
)

const openModel = defineModel<boolean>('open')
const searchTerm = defineModel<string>('search')

const { metadata } = useODataEntitySetPI().inject()
const { enableVariants } = useSmartTablePI().inject()

const isV4 = computed(() => metadata.value?.isV4)

const valueListConditions = ref<TODataTypedFilterValue[]>([]) as Ref<TODataTypedFilterValue[]>
const valueListFiltersModel = computed<(TODataTypedFilterValueDisplay & { remove: () => void })[]>(
  () => {
    return valueListConditions.value
      .filter(c => isConditionFilled(c))
      .map(c => ({
        ...convertF4Condition(c),
        remove: () => (valueListConditions.value = valueListConditions.value?.filter(f => f !== c)),
      }))
  }
)

const conditions = ref<TODataTypedFilterValue[]>([]) as Ref<TODataTypedFilterValue[]>
const conditionsFiltersModel = computed<(TODataTypedFilterValueDisplay & { remove: () => void })[]>(
  () => {
    return conditions.value
      .filter(c => isConditionFilled(c))
      .map(c => ({
        ...convertF4Condition(c),
        remove: () => (conditions.value = conditions.value?.filter(f => f !== c)),
      }))
  }
)

function clearSelection() {
  valueListConditions.value = []
  conditions.value = []
}

const conditionTokens = computed(() => {
  const merged = [] as { label: string; remove: () => void }[]
  let i = 0
  if (valueListFiltersModel.value) {
    for (const item of valueListFiltersModel.value) {
      i++
      merged.push({
        label: item.display,
        remove: item.remove,
      })
      if (i > 50) break
    }
  }
  i = 0
  if (conditionsFiltersModel.value) {
    for (const item of conditionsFiltersModel.value) {
      i++
      merged.push({
        label: item.display,
        remove: item.remove,
      })
      if (i > 50) break
    }
  }
  return merged
})

function onApply() {
  emit('apply', [...valueListConditions.value, ...conditions.value])
}
</script>

<template>
  <VuDialog
    v-model:open="openModel"
    modal
    close-button
    level="h6"
    no-padding
    rounded
    class="layer-0 elevated w-full h-screen"
    :class="{
      'max-h-[min(98vh,50rem)] max-w-[60rem]': !!valueListCollection,
      'max-h-[min(98vh,56rem)] max-w-[40rem]': !valueListCollection,
    }"
    content-class="overflow-hidden flex-grow-1 flex-shrink-1 relative"
  >
    <template v-slot:header>
      <header
        class="dialog-header flex justify-between pb-0 max-sm:flex-col shadow-[inset_0_-2px_#77777725] border-none z-1"
      >
        <VuCardHeader class="truncate pr-$m max-w-70% mb-$s dialog-title flex items-center">
          {{ field.$label }}
        </VuCardHeader>

        <VuTabs
          indicator
          v-if="valueListCollection"
          v-model="tab"
          :tabs
          class="flex-shrink-0 mr-$l"
        />
      </header>
    </template>

    <KeepAlive>
      <F4ValueHelp
        v-if="tab === 'value-help' && valueListCollection"
        class="grow overflow-hidden flex flex-col h-full"
        v-model="valueListConditions"
        :field="field.$Name"
        v-model:search="searchTerm"
      />

      <F4Conditions
        v-else
        class="grow overflow-hidden flex flex-col h-full"
        v-model="conditions"
        :is-v4="isV4"
        :field
      />
    </KeepAlive>

    <template v-slot:footer>
      <footer class="dialog-footer p-0 flex flex-col elevated flex-shrink-0">
        <div v-if="conditionTokens?.length" class="grow pt-$m pb-$xs">
          <div class="px-$card-spacing flex justify-between">
            Added {{ valueListFiltersModel.length + conditionsFiltersModel.length }} conditions:
            <div class="flex gap-$l">
              <a
                class="cursor-pointer text-scope-color-500 hover:text-scope-color-400"
                @click="clearSelection"
              >
                Clear All
              </a>
            </div>
          </div>
        </div>
        <div class="px-$card-spacing border-b pb-$m" v-if="conditionTokens?.length">
          <DragScroll class="overflow-hidden gap-$xs flex grow">
            <FilterToken v-for="item of conditionTokens" :key="item.label" @remove="item.remove()">
              {{ item.label }}
            </FilterToken>
          </DragScroll>
        </div>

        <VuCardInner class="flex-shrink-0 flex justify-end py-$m gap-$m">
          <SmartTableFavFiltersMenu
            v-if="enableVariants"
            can-save
            :field-name="field.$Name"
            :filters="[...valueListConditions, ...conditions]"
            @select="distributeFilters"
          />

          <div class="grow" />
          <VuButton label="Apply" class="c8-filled" @click="onApply" />

          <DialogClose as-child>
            <VuButton label="Cancel" class="c8-flat" />
          </DialogClose>
        </VuCardInner>
      </footer>
    </template>
  </VuDialog>
</template>

<!--  -->
