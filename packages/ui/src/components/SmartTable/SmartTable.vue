<script setup lang="ts" generic="T extends Record<K, unknown>, K extends string">
import { computed } from 'vue'
import type { EntitySetField, EntitySetFields } from '@notsap/odata'
import SmartTableBase from './SmartTableBase.vue'
import { useSmartTablePI } from './SmartTable.pi'
import { ListboxRoot } from 'radix-vue'

const props = withDefaults(
  defineProps<{
    rows?: Record<string, string>[]
    columns?: EntitySetFields
    loading?: boolean
    select?: 'none' | 'single' | 'multi'
    stretch?: boolean
    stickyHeader?: boolean
    stickyCheckbox?: boolean
    fixedRowHeight?: boolean
    rowsControl?: 'hard-limit' | 'pagination' | 'load-more-btn' | 'scroll-to-load'
    selectOnClick?: boolean
    selectAllEnabled?: boolean
    onItemClick?: (item: Record<string, string>) => any
    columnMenu?: { sort?: boolean; filters?: boolean; hide?: boolean; config?: boolean }
    virtualRowHeight?: number
    virtualOverscan?: number
  }>(),
  {
    select: 'none',
    rowsControl: 'load-more-btn',
  }
)

defineSlots<
  {
    [name in `cell-${K}`]: (props: { row: T; value: string; field: EntitySetField }) => any
  } & {
    'default': () => any
    'table': () => any
    'hl-cell': (props: { row: T }) => any
    'empty': () => any
    'last-row': () => any
  }
>()

const { querying, selectedRows } = useSmartTablePI().inject()
const _loading = computed(() => props.loading || querying.value)
</script>
<template>
  <ListboxRoot
    :multiple="select === 'multi'"
    v-model="selectedRows"
    data-virtual-scroll
    :class="{
      'overflow-auto': !_loading,
      'overflow-hidden': _loading,
    }"
  >
    <slot>
      <!-- <ListboxFilter /> -->
    </slot>
    <slot name="table">
      <SmartTableBase
        :rows
        :columns
        :rows-control
        :select
        :stretch
        :sticky-checkbox
        :sticky-header
        :fixed-row-height
        :select-on-click
        :select-all-enabled
        :on-item-click
        :column-menu
        :virtual-row-height
        :virtual-overscan
      >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <!-- prettier-ignore-attribute :name -->
          <slot :name="(slot as 'last-row')" v-bind="scope || {}"> </slot>
        </template>
      </SmartTableBase>
    </slot>
  </ListboxRoot>
</template>
