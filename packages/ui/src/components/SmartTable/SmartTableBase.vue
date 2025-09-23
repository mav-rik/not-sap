<script setup lang="ts" generic="T extends Record<K, unknown>, K extends string">
import {
  odataFilterFormat,
  type EntitySetField,
  type EntitySetFields,
  type TODataTypedFilterValue,
} from '@/_odata'
import {
  ListboxContent,
  ListboxItem,
  ListboxItemIndicator,
  ComboboxItem,
  ComboboxItemIndicator,
  Primitive,
} from 'radix-vue'
import { useSmartTablePI } from './SmartTable.pi'
import SmartTableHeaderCell from './SmartTableHeaderCell.vue'
import F4Dialog from '../F4/F4Dialog.vue'
import SmartFieldValue from '../SmartRecord/SmartFieldValue.vue'
import SmartTableVirtualizer from './SmartTableVirtualizer.vue'
const props = withDefaults(
  defineProps<{
    rows?: T[]
    columns?: EntitySetFields
    loading?: boolean
    asCombobox?: boolean
    select?: 'none' | 'single' | 'multi'
    stretch?: boolean
    stickyHeader?: boolean
    stickyCheckbox?: boolean
    fixedRowHeight?: boolean
    rowsControl?: 'hard-limit' | 'pagination' | 'load-more-btn' | 'scroll-to-load'
    selectOnClick?: boolean
    selectAllEnabled?: boolean
    onItemClick?: (item: T) => any
    columnMenu?: { sort?: boolean; filters?: boolean; hide?: boolean; config?: boolean }
    virtualRowHeight?: number
    virtualOverscan?: number
  }>(),
  {
    select: 'none',
    rowsControl: 'load-more-btn',
    columnMenu: () => ({
      sort: true,
      filters: true,
      config: true,
      hide: true,
    }),
  }
)

defineSlots<
  {
    [name in `cell-${K}`]: (props: { row: T; value: string; field: EntitySetField }) => any
  } & {
    'hl-cell': (props: { row: T }) => any
    'empty': () => any
    'last-row': () => any
  }
>()

const {
  results,
  querying,
  columns: _columns,
  inlineCount,
  queryNext,
  queryingNext,
  selectAll,
  selectedRows,
  rowValueFn,
  sorters,
  columnsNames,
  showConfigDialog,
  fieldsFilters,
  queryImmediate,
  mustRefresh,
  entity,
  queryError,
  loadedCount,
  blockQuery,
  blockQueryReason,
} = useSmartTablePI().inject()

interface T__Metadata {
  id: string
  type: string
  uri: string
}

const _rows = computed(
  () => (props.rows ?? results.value) as (Record<string, string> & { __metadata: T__Metadata })[]
)
const _loading = computed(() => props.loading || querying.value)
const _cols = computed(() => props.columns ?? _columns.value)
const _sortersMap = computed(() => {
  const m = new Map<string, 'asc' | 'desc'>()
  for (const item of sorters.value) {
    m.set(
      typeof item === 'string' ? item : item.name,
      typeof item === 'string' ? 'asc' : item.desc ? 'desc' : 'asc'
    )
  }
  return m
})

function getWidth(field: EntitySetField) {
  return `${Math.min(Math.max((field.$MaxLength || 10) * 0.6, 12), 22)}em`
}

function _onItemClick(event: MouseEvent, item: T) {
  if (!props.selectOnClick) {
    event.stopPropagation()
  }
  props.onItemClick?.(item)
}

function _onSelectAll() {
  if (selectAll.value) {
    selectedRows.value = _rows.value.map(r => rowValueFn.value(r)) as string[]
  } else {
    selectedRows.value = []
  }
}

function sort(name: string, order?: 'asc' | 'desc') {
  const newSorter = { name, desc: order === 'desc' }
  sorters.value = [newSorter] // overwrites all sorters (more user friendly)

  //====================================================
  // commented code preserves the existing sorters,
  // which is a bit confusing from user's perspective
  //====================================================
  // const sorter = _sortersMap.value.get(name)
  // if (sorter) {
  //   if (!order) {
  //     sorters.value = sorters.value.filter(s =>
  //       typeof s === 'string' ? s !== name : s.name !== name
  //     )
  //   } else {
  //     const index = sorters.value.findIndex(item =>
  //       typeof item === 'string' ? item === name : item.name === name
  //     )
  //     if (index >= 0) {
  //       sorters.value[index] = newSorter
  //     } else {
  //       sorters.value.push(newSorter)
  //     }
  //     sorters.value = [...sorters.value]
  //   }
  // } else {
  //   sorters.value = [...sorters.value, newSorter]
  // }
}

const highlightedColumnName = ref('')

function highlightColumn(name: string) {
  highlightedColumnName.value = name
}

const f4Dialog = reactive({
  open: false,
  field: {} as EntitySetFields[number],
  filters: [] as TODataTypedFilterValue[],
}) as {
  open: boolean
  field: EntitySetFields[number]
  filters: TODataTypedFilterValue[]
}

function openF4Dialog(field: EntitySetFields[number]) {
  f4Dialog.field = field
  f4Dialog.open = true
  f4Dialog.filters = (fieldsFilters.value[field.$Name] || []).map(f =>
    odataFilterFormat.toTypedValue(f)
  )
}

function onF4DialogApply(newFilters: TODataTypedFilterValue[]) {
  f4Dialog.open = false
  if (fieldsFilters.value[f4Dialog.field.$Name] && newFilters.length === 0) {
    fieldsFilters.value[f4Dialog.field.$Name] = []
  } else {
    fieldsFilters.value[f4Dialog.field.$Name] = newFilters.map(f =>
      odataFilterFormat.fromTypedValue(f)
    )
  }
  fieldsFilters.value = { ...fieldsFilters.value }
}

function filtersOff(name: string) {
  fieldsFilters.value = { ...fieldsFilters.value, [name]: [] }
}
function hideColumn(name: string) {
  columnsNames.value = columnsNames.value.filter(n => n !== name)
}

const dragIndex = ref(-1)
const dragOverIndex = ref(-1)

function dragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}
function drop() {
  const itemToMove = _columns.value.splice(dragIndex.value, 1)[0]
  const targetIndex =
    dragOverIndex.value > dragIndex.value ? dragOverIndex.value - 1 : dragOverIndex.value
  _columns.value.splice(targetIndex, 0, itemToMove)
  _columns.value = [..._columns.value]
  dragIndex.value = -1
  dragOverIndex.value = -1
}
function over(event: DragEvent, index: number) {
  const item = (event.target as HTMLDivElement).closest('[draggable="true"]') as HTMLDivElement
  const { x, width } = item.getBoundingClientRect()
  const atLeft = event.clientX - x < width / 2
  let overIndex = atLeft ? index : index + 1
  dragOverIndex.value = overIndex
}
</script>
<template>
  <table
    class="not-sap-table relative"
    @mouseleave="highlightColumn('')"
    :class="{ 'not-sap-table-fixed': fixedRowHeight }"
    :style="{
      'width': 'max-content',
      'min-width': stretch ? '100%' : undefined,
    }"
  >
    <thead v-if="_cols.length" :class="{ 'sticky top-0 z-2 bg-current': stickyHeader }" class="">
      <tr>
        <th
          v-if="select === 'multi' && results.length"
          @mouseenter="highlightColumn('')"
          :class="{ 'sticky left-0 bg-current z-1': stickyCheckbox }"
          class="shadow-[inset_-1px_0_#77777725] px-$m w-[1%]"
          align="left"
        >
          <VuCheckbox
            v-if="_rows.length && selectAllEnabled"
            v-model="selectAll"
            @update:model-value="_onSelectAll"
          />
        </th>
        <th
          v-for="(field, index) of _cols"
          :key="field.$Name"
          :class="{
            'not-sap-col-hl': highlightedColumnName === field.$Name && _cols.length > 1,
          }"
          @mouseenter="highlightColumn(field.$Name)"
          :style="
            fixedRowHeight ? { 'width': getWidth(field), 'max-width': getWidth(field) } : undefined
          "
        >
          <SmartTableHeaderCell
            :field
            :columnMenu
            :order="_sortersMap.get(field.$Name)"
            :filters="fieldsFilters[field.$Name]"
            :class="{
              'not-sap-head-numeric': field.isNumber,
            }"
            draggable="true"
            @dragstart="dragStart(index, $event)"
            @dragenter.prevent="over($event, index)"
            @dragover.prevent="over($event, index)"
            @drop="drop()"
            @sort-asc="sort(field.$Name, 'asc')"
            @sort-desc="sort(field.$Name, 'desc')"
            @sort-off="sort(field.$Name)"
            @filters="openF4Dialog(field)"
            @filters-off="filtersOff(field.$Name)"
            @hide="hideColumn(field.$Name)"
            @config="showConfigDialog()"
          >
            <!-- drop placeholder -->
            <div
              v-if="dragOverIndex === index"
              class="absolute top-0 bottom-0 w-2px bg-grey-500/40 pointer-events-none left-[-.2em]"
            >
              <div class="absolute top-0 size-6px left-[-2px] bg-grey-500 rounded-full"></div>
            </div>
          </SmartTableHeaderCell>
        </th>
        <th style="width: auto" @mouseenter="highlightColumn('')"></th>
      </tr>
    </thead>

    <component v-if="_cols.length" :is="asCombobox ? Primitive : ListboxContent" as-child>
      <SmartTableVirtualizer
        :options="_rows"
        :estimate-size="virtualRowHeight"
        :as="'tbody'"
        :bypass="!virtualRowHeight"
        :overscan="virtualOverscan"
        v-slot="{ item, spaceBefore, ...rest }"
      >
        <component
          :is="asCombobox ? ComboboxItem : ListboxItem"
          :value="rowValueFn(item)"
          class="group/lbindicator not-sap-row"
          as="tr"
          :class="item.__rowClass"
          v-bind="rest"
          :style="{
            height: virtualRowHeight ? `${virtualRowHeight}px` : undefined,
            transform: spaceBefore ? `translateY(${spaceBefore}px)` : undefined,
          }"
        >
          <td
            v-if="select === 'multi' && results.length"
            :class="{ 'sticky left-0 bg-current z-1': stickyCheckbox }"
            class="not-sap-checkbox-cell"
            @mouseenter="highlightColumn('')"
            align="left"
          >
            <div class="not-sap-listbox-checkbox">
              <component
                :is="asCombobox ? ComboboxItemIndicator : ListboxItemIndicator"
                class="checkbox-indicator"
              >
                <VuIcon v-if="true" name="i--checkmark" class="checkbox-icon" />
              </component>
            </div>
          </td>
          <td
            v-for="field of _cols"
            :key="field.$Name + String(item[field.$Name])"
            @click="_onItemClick($event, item as unknown as T)"
            :class="{
              'not-sap-col-hl': highlightedColumnName === field.$Name && _cols.length > 1,
            }"
            @mouseenter="highlightColumn(field.$Name)"
            :style="
              fixedRowHeight
                ? { 'width': getWidth(field), 'max-width': getWidth(field) }
                : undefined
            "
          >
            <div
              class="not-sap-cell"
              :class="{
                'not-sap-cell-numeric': field.isNumber,
              }"
            >
              <slot
                :name="`cell-${field.$Name as K}`"
                v-bind="{ row: item as unknown as T, value: item[field.$Name], field }"
              >
                <SmartFieldValue
                  :name="field.$Name"
                  :value="item[field.$Name]"
                  :row="item"
                  v-slot="{ value, units, isMonetary, currency }"
                >
                  <span v-if="isMonetary" :aria-label="`${value} ${currency?.Text}`">
                    {{ value }}
                    <span v-if="units" class="not-sap-unit" :title="currency?.Text">{{
                      units
                    }}</span>
                  </span>
                  <template v-else>
                    {{ value }}
                  </template>
                </SmartFieldValue>
              </slot>
            </div>
          </td>
          <td style="width: auto" @mouseenter="highlightColumn('')">
            <!-- prettier-ignore-attribute :row -->
            <slot name="hl-cell" :row="(item as unknown as T)">
              <div class="not-sap-hl"></div>
            </slot>
          </td>
        </component>
      </SmartTableVirtualizer>
    </component>

    <VuDelayedSwitch v-if="f4Dialog.field" :value="f4Dialog.open" v-slot="{ on }">
      <F4Dialog
        v-if="on"
        v-model:open="f4Dialog.open"
        :field="f4Dialog.field"
        :filters="f4Dialog.filters"
        @apply="onF4DialogApply"
      />
    </VuDelayedSwitch>
  </table>

  <div
    v-if="queryError"
    class="sticky left-0 right-0 flex justify-center items-center bg-current py-$s border-t"
  >
    <div class="p-$m text-center scope-error surface-100 border rounded m-$m">
      {{ queryError.message }}
    </div>
  </div>

  <div
    v-else-if="!_cols.length"
    class="sticky left-0 right-0 flex justify-center items-center bg-current py-$s border-t"
  >
    <slot name="empty">
      <div class="py-$m opacity-50 text-center w-full">No Columns Selected</div>
    </slot>
  </div>

  <div
    v-else-if="!results.length"
    class="sticky left-0 right-0 flex justify-center items-center bg-current py-$s border-t"
  >
    <slot name="empty">
      <div class="py-$m opacity-50">No Records</div>
    </slot>
  </div>

  <slot name="last-row">
    <div
      v-if="rowsControl === 'load-more-btn' && (inlineCount || 0) > loadedCount"
      class="sticky left-0 right-0 flex justify-center items-center bg-current py-$s border-t"
    >
      <VuButton label="Load More..." class="c8-flat" @click="queryNext" :loading="queryingNext" />
    </div>
  </slot>

  <VuInnerLoading size="24" class="text-current/40 backdrop-blur-sm" v-if="_loading" />

  <!-- <div v-if="blockQuery && blockQueryReason" class="inner-loading cursor-default backdrop-blur-sm">
    <slot name="block-query">
      <div class="max-w-[40ch] surface-50 p-$m border rounded scope-warn">
        {{ blockQueryReason }}
      </div>
    </slot>
  </div> -->
  <div
    v-else-if="!blockQuery && !_loading && mustRefresh"
    class="inner-loading cursor-default backdrop-blur-sm"
  >
    <VuButton label="Refresh" class="c8-filled" icon="i--refresh" @click="queryImmediate()" />
  </div>
</template>
