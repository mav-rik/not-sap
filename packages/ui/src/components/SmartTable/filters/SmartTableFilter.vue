<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick, type ComponentInstance } from 'vue'
import { useODataEntitySetPI } from '../../../renderless/ODataEntitySet.pi'
import F4Dialog from '../../F4/F4Dialog.vue'
import {
  convertF4Condition,
  isConditionFilled,
  type TODataTypedFilterValueDisplay,
} from '../filter-conditions.utils'
import DragScroll from '../../DragScroll.vue'
import { useValueHelp } from '../../F4/use-value-help.composable'
import SmartTableBase from '../../SmartTable/SmartTableBase.vue'
import { debounce } from 'notsapodata'
import {
  odataFilterFormat,
  type TODataFilterConditionType,
  type TODataValueType,
  type TODataTypedFilterValue,
} from 'notsapodata'
import SmartTableRoot from '../SmartTableRoot.vue'
import FilterToken from '../../FilterToken.vue'
import { isSmartTableInDevMode } from '../dev-mode.composable'

import {
  Primitive,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxViewport
} from 'radix-vue'
import { useSmartFilterPI } from './SmartFilter.pi'
import SmartTableSaveFavFiltersDialog from './SmartTableSaveFavFiltersDialog.vue'
import SmartTableLoadFavFiltersDialog from './SmartTableLoadFavFiltersDialog.vue'
import SmartTableFavFiltersMenu from './SmartTableFavFiltersMenu.vue'
import ODataEntitySet from '../../../renderless/ODataEntitySet.vue'
import VuDelayedSwitch from 'vunor/DelayedSwitch.vue'
import VuInput from 'vunor/Input.vue'
import VuCard from 'vunor/Card.vue'
import VuButton from 'vunor/Button.vue'

const { fieldsMap, metadataLoading } = useODataEntitySetPI().inject()

const props = defineProps<{
  field: string
  stackLabel?: boolean
  valueFormatter?: (value: string) => string
}>()

const emit = defineEmits<{
  change: [field: string, typedFilters: TODataTypedFilterValue[]]
}>()

const TOP = 10

const {
  getFilterValue,
  columnsNames,
  searchSupported,
  valueList,
  fieldsFilters,
  queryImmediate,
  mustRefresh,
  model,
} = useValueHelp<any, any, any>(props.field)

console.log({field: props.field, valueList})

const {
  favFiltersSaveDialog,
  favFiltersLoadDialog,
  favFiltersToSave,
  openFavFiltersDialog,
  enableVariants,
} = useSmartFilterPI().provide({
  fieldName: computed(() => props.field),
})

const forceFilters = computed(() => {
  if (valueList.value) {
    return searchSupported.value
      ? undefined
      : [
          {
            [valueList.value?.Parameters.find((p: any) =>
              ['Common.ValueListParameterInOut', 'SAP__common.ValueListParameterInOut'].includes(
                p.$Type
              )
            )?.ValueListProperty || '']: { starts: searchTerm.value },
          },
        ]
  }
})

const field = computed(() => fieldsMap.value?.get(props.field))

const f4Dialog = ref(false)

const dropdown = ref(false)

const searchTerm = ref('')

const dragContainer = ref<ComponentInstance<typeof DragScroll>>()
const searchInput = ref<HTMLInputElement>()

const internalFilters = defineModel<TODataTypedFilterValue[]>('filters', {
  default: () => [],
})

onMounted(() => {
  if (fieldsFilters.value[props.field]) {
    internalFilters.value = fieldsFilters.value[props.field]!.map((f: any) =>
      odataFilterFormat.toTypedValue(f)
    )
  }
})

watch([internalFilters], () => {
  if (fieldsFilters.value[props.field] && internalFilters.value.length === 0) {
    fieldsFilters.value[props.field] = []
  } else {
    fieldsFilters.value[props.field] = internalFilters.value.map(f =>
      odataFilterFormat.fromTypedValue(f)
    )
  }
  mustRefresh.value = true
  emit('change', props.field, internalFilters.value)
})

const areFiltersEqual = () => {
  const fieldsFiltersTyped =
    fieldsFilters.value[props.field]?.map((f: any) => odataFilterFormat.toTypedValue(f)) || []

  return JSON.stringify(fieldsFiltersTyped) === JSON.stringify(internalFilters.value)
}

watch([fieldsFilters], () => {
  if (!fieldsFilters.value[props.field]) {
    internalFilters.value = []
  } else if (!areFiltersEqual()) {
    internalFilters.value = fieldsFilters.value[props.field]!.map((f: any) =>
      odataFilterFormat.toTypedValue(f)
    )
  }
})

type TF4RemovableItem = TODataTypedFilterValueDisplay & { remove: () => void }

const filtersModel = computed<TF4RemovableItem[]>(() => {
  return internalFilters.value
    .filter(c => isConditionFilled(c))
    .map(c => ({
      ...convertF4Condition(c),
      remove: () => {
        internalFilters.value = internalFilters.value?.filter(f => f !== c)
      },
    }))
})

const filtersModelSliced = computed(() => filtersModel.value.slice(-5))

function openF4Help() {
  f4Dialog.value = true
  dropdown.value = false
}

function onDialogApply(newFilters: TODataTypedFilterValue[]) {
  searchTerm.value = ''
  f4Dialog.value = false
  internalFilters.value = newFilters
}

const refreshDropdownValues = debounce(async (queryImmediate: () => Promise<void>) => {
  if (valueList.value) {
    await queryImmediate()
    dropdown.value = false
    await nextTick()
    await nextTick() // hack to fix weird filtering on radix combobox
    await nextTick()
    if (!blurred.value) {
      dropdown.value = true
    }
  }
}, 200)

function focusNextToken(event: KeyboardEvent, offset = 1) {
  const token = (event.target as HTMLDivElement)?.parentElement as HTMLDivElement
  const t = (offset === -1 ? token?.previousElementSibling : token?.nextElementSibling)
    ?.lastElementChild as HTMLDivElement

  if (t) {
    t.focus()
    // t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    return true
  }
  if (offset === 1) {
    if (searchInput.value) {
      searchInput.value.focus()
      return true
    }
  }
}

function focusNToken(n: 'first' | 'last') {
  const t = dragContainer.value?.$el?.querySelector(
    `div:${n}-child > .not-sap-token`
  ) as HTMLDivElement
  if (t) {
    t.focus()
    // t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    return true
  }
}

function onBackspace() {
  if (searchTerm.value === '') {
    focusNToken('last')
  }
}

async function onDeleteToken(event: KeyboardEvent, item: TF4RemovableItem) {
  const token = (event.target as HTMLDivElement)?.parentElement as HTMLDivElement
  const el = (token?.previousElementSibling || token?.nextElementSibling)
    ?.lastElementChild as HTMLDivElement
  item.remove()
  if (el && el.focus) {
    await nextTick()
    el.focus()
    // el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
  } else {
    searchInput.value?.focus()
  }
}

function onLeft() {
  if (searchInput.value?.selectionStart! <= 0) {
    focusNToken('last')
  }
}
function handleHomeEnd(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  const length = event.key === 'Home' ? 0 : target.value.length
  if (event.shiftKey) {
    target.setSelectionRange(
      event.key === 'Home' ? 0 : target.selectionEnd ?? target.value.length,
      event.key === 'Home' ? target.selectionStart ?? 0 : target.value.length
    )
  } else {
    target.setSelectionRange(length, length)
  }
}

function addInlineFilter(
  type: TODataFilterConditionType,
  val: TODataValueType | [TODataValueType] | [TODataValueType, TODataValueType]
) {
  searchTerm.value = ''
  internalFilters.value.push({
    type,
    value: [val].flat() as [string],
  })
  internalFilters.value = [...internalFilters.value]
}

const searchTermInFilterFormat = computed(() => {
  const f = odataFilterFormat.fromString(searchTerm.value, valueList.value ? 'value' : 'eq')
  if (f) {
    // @ts-expect-error
    return !f.value
  }
  return false
})

function onEnter(event: KeyboardEvent) {
  onBlur(event)
}

// function onDateEnter(event: KeyboardEvent) {
//   if (dateValue.value && dateValue.value.year > 1900) {
//     console.log(dateValue.value.toDate('UTC'))
//     event?.stopPropagation()
//     event?.preventDefault()
//     addInlineFilter('eq', dateValue.value)
//     dateValue.value = undefined
//     queryImmediate()
//   }
// }

let blurred = ref(true)

async function onBlur(event?: KeyboardEvent, value?: string, forceValue?: boolean) {
  blurred.value = true
  const v = value || searchTerm.value
  const f = odataFilterFormat.fromString(v, valueList.value ? 'value' : 'eq')
  if (f) {
    const type = Object.keys(f)[0] as TODataFilterConditionType
    if (valueList.value && type !== 'value') {
      event?.stopPropagation()
      event?.preventDefault()
      addInlineFilter(type, f[type as keyof typeof f])
      if (event) {
        queryImmediate()
      }
    } else if (forceValue || !valueList.value) {
      addInlineFilter(type, f[type as keyof typeof f])
      if (event) {
        queryImmediate()
      }
    }
  }
}

const isDateType = computed(() => ['Edm.DateTime', 'Edm.Date'].includes(field.value?.$Type || ''))

function onInputClick() {
  if (isDateType.value) {
    openF4Help()
  }
}

async function onPaste(event: ClipboardEvent, queryImmediate: () => Promise<void>) {
  // @ts-expect-error
  const clipboardData = event.clipboardData || window.clipboardData
  const pastedData = clipboardData.getData('text')

  const dataArray = pastedData
    .split(/[\t\n\r,]+/)
    .map((s?: string) => s?.trim())
    .filter(Boolean)
    .map((s: string) => (props.valueFormatter ? props.valueFormatter(s) : s)) as string[]

  if (dataArray.length > 1) {
    event.preventDefault()
    const dedup = Array.from(new Set(dataArray))
    for (const d of dedup) {
      // force value when pasting multiple values
      onBlur(undefined, d, true)
    }
    dropdown.value = false
  } else if (!searchTerm.value) {
    event.preventDefault()
    searchTerm.value = dataArray[0] || ''
    if (searchTerm.value && valueList.value) {
      await nextTick()
      queryImmediate()
    }
  }
}

function saveFavs(event: KeyboardEvent) {
  if (enableVariants) {
    event.stopPropagation()
    event.preventDefault()
    dropdown.value = false
    openFavFiltersDialog('save', internalFilters.value)
  }
}

function loadFavs(event: KeyboardEvent) {
  if (enableVariants) {
    event.stopPropagation()
    event.preventDefault()
    dropdown.value = false
    favFiltersLoadDialog.value = true
    // openFavFiltersDialog('load')
  }
}

function applyFavFilters(filters: TODataTypedFilterValue[]) {
  dropdown.value = false
  internalFilters.value = filters
  fieldsFilters.value[props.field] = filters.map(f => odataFilterFormat.fromTypedValue(f))
}
</script>

<template>
  <template v-if="metadataLoading">
    <div
      class="h-fingertip bg-white/90 dark:bg-black/80 w-full animate-pulse mb-$xs rounded"
      v-bind="$attrs"
    ></div>
  </template>
  <template v-else-if="!!field">
    <component
      :is="model && valueList?.CollectionPath ? ODataEntitySet : Primitive"
      :as-child="model && valueList?.CollectionPath ? undefined : true"
      :model
      :entity-set="valueList?.CollectionPath"
    >
      <!-- prettier-ignore -->
      <SmartTableRoot
        :top="TOP"
        :search-term="searchSupported ? searchTerm : undefined"
        :columns-names
        :force-filters
        :row-value-fn="getFilterValue"
        keep-selected-after-refresh
        v-model:selectedRows="(internalFilters as unknown as Record<string, string>[])"
        v-slot="{ results, inlineCount, queryImmediate }"
      >
        <VuInput
          :label="isSmartTableInDevMode ? field.$Name : field.$label"
          :stack-label
          v-model="searchTerm"
          design="filled"
          icon-append="i--f4-help"
          @append-click="openF4Help"
          @keydown.f4="openF4Help"
          @keydown.f2="saveFavs"
          @keydown.f3="loadFavs"
          v-bind="$attrs"
          :active="internalFilters.length > 0"
        >
        
          <template v-slot:input="inputAttrs">
            <!-- @update:open="(v: boolean) => (v ? queryImmediate() : '')" -->
            <ComboboxRoot
              class=""
              @update:open="(v: boolean) => (valueList && v ? queryImmediate() : '')"
              v-model:open="dropdown"
              v-model:search-term="searchTerm"
              multiple
              as-child
              :reset-search-term-on-blur="false"
              v-model="internalFilters"
            >
              <ComboboxTrigger as-child>
                <ComboboxAnchor as-child>
                  <div
                    class="i8-input grid grid-cols-[auto_minmax(4em,1fr)] items-center relative gap-$s"
                    :class="{
                      'pt-$m': !stackLabel,
                    }"
                    v-bind="inputAttrs"
                  >
                    <DragScroll
                      v-if="filtersModelSliced.length > 0"
                      ref="dragContainer"
                      class="flex overflow-hidden gap-$xs h-full"
                    >
                      <div
                        v-for="item of filtersModelSliced"
                        :key="item.display"
                        class="flex items-center"
                      >
                        <FilterToken
                          tabindex="-1"
                          @keydown.backspace="onDeleteToken($event, item)"
                          @keydown.delete="onDeleteToken($event, item)"
                          @keydown.left="focusNextToken($event, -1)"
                          @keydown.right="focusNextToken($event, 1)"
                          @keydown.down="searchInput?.focus()"
                          @keydown.home="focusNToken('first')"
                          @keydown.end="focusNToken('last')"
                          @remove="item.remove()"
                        >
                          {{ item.display }}
                        </FilterToken>
                      </div>
                    </DragScroll>

                    <div
                      class="relative min-w-4em"
                      :class="{
                        '[grid-column:1/-1]': filtersModelSliced.length === 0,
                      }"
                    >
                      <ComboboxInput as-child>
                        <input
                          class="outline-none h-full w-full bg-transparent"
                          v-bind="inputAttrs"
                          ref="searchInput"
                          :readonly="isDateType"
                          autocomplete="off"
                          @input="refreshDropdownValues(queryImmediate)"
                          @keydown.backspace="onBackspace()"
                          @keydown.left="onLeft"
                          @keydown.home.end="handleHomeEnd"
                          @keydown.enter.stop="onEnter"
                          @paste="onPaste($event, queryImmediate)"
                          @blur="onBlur()"
                          @focus="blurred = false"
                          @click="onInputClick()"
                        />
                      </ComboboxInput>
                    </div>
                  </div>
                </ComboboxAnchor>
              </ComboboxTrigger>

              <!-- <ComboboxPortal> -->
              <ComboboxContent
                as-child
                align="start"
                :side-offset="4"
                position="popper"
                class="min-w-[var(--radix-combobox-trigger-width)] z-7"
              >
                <VuCard
                  v-if="valueList && results.length > 0 && !searchTermInFilterFormat"
                  level="body"
                  no-padding
                  @click.stop
                  class="scope-primary flex flex-col layer-0 shadow-xl min-h-3em rounded w-auto max-w-[40em] border z-10 translate-x-[-2px]"
                >
                  <ComboboxViewport class="fingertip-[2.7em] text-14px flex flex-col">
                    <SmartTableBase
                      as-combobox
                      select="multi"
                      rows-control="hard-limit"
                      stretch
                      sticky-header
                      fixed-row-height
                      select-on-click
                      :column-menu="{}"
                    />
                    <div class="flex">

                    <SmartTableFavFiltersMenu
                      v-if="enableVariants"
                      can-save
                      :field-name="field.$Name"
                      :filters="internalFilters"
                      @select="applyFavFilters"
                    />
                    <VuButton
                      v-if="internalFilters.length"
                      class="c8-flat grow"
                      label="Reset"
                      @click="internalFilters = []"
                    />
                    <VuButton
                      v-if="(inlineCount || 0) > TOP"
                      class="c8-flat grow"
                      icon="i--search"
                      :label="`See All (${inlineCount})`"
                      @click="openF4Help"
                    />
                  </div>
                  </ComboboxViewport>
                </VuCard>
              </ComboboxContent>
              <!-- </ComboboxPortal> -->
            </ComboboxRoot>
          </template>
        </VuInput>
      </SmartTableRoot>
    </component>
  </template>

  <VuDelayedSwitch v-if="!!field" :value="f4Dialog" v-slot="{ on }">
    <F4Dialog
      v-if="on"
      v-model:open="f4Dialog"
      :field
      :filters="internalFilters"
      @apply="onDialogApply"
      v-model:search="searchTerm"
    />
  </VuDelayedSwitch>

  <VuDelayedSwitch :value="favFiltersSaveDialog" v-slot="{ on }">
    <!-- prettier-ignore-attribute :filters -->
    <SmartTableSaveFavFiltersDialog
      v-if="on"
      v-model:open="favFiltersSaveDialog"
      :label="favFiltersToSave.label"
      :filters="(favFiltersToSave.filters as (TODataTypedFilterValue[]))"
    />
  </VuDelayedSwitch>

  <VuDelayedSwitch :value="favFiltersLoadDialog" v-slot="{ on }">
    <SmartTableLoadFavFiltersDialog
      v-if="on"
      v-model:open="favFiltersLoadDialog"
      @select="applyFavFilters($event)"
    />
  </VuDelayedSwitch>
</template>
