<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'radix-vue'
import type { EntitySetField } from '@notsap/odata'
import { isSmartTableInDevMode } from './dev-mode.composable'
import { mergeCssClasses, type TVueCssClass } from 'vunor/utils'
import VuButton from 'vunor/Button.vue'
import VuIcon from 'vunor/Icon.vue'

const props = defineProps<{
  field: EntitySetField
  order?: 'asc' | 'desc'
  columnMenu: { sort?: boolean; filters?: boolean; hide?: boolean; config?: boolean }
  filters?: unknown[]
  class?: TVueCssClass
}>()

const optsSet = computed(() => {
  type TKey = keyof typeof props.columnMenu
  const s = new Set<TKey>()
  const keys = ['sort', 'filters', 'config', 'hide'] as TKey[]
  for (const k of keys) {
    if (props.columnMenu[k]) {
      s.add(k)
    }
  }
  return s
})

const open = ref(false)

const emit = defineEmits<{
  (e: 'sort-asc'): void
  (e: 'sort-desc'): void
  (e: 'sort-off'): void
  (e: 'filters'): void
  (e: 'filters-off'): void
  (e: 'hide'): void
  (e: 'config'): void
}>()

function emitSort(order: 'asc' | 'desc') {
  if (order === props.order) {
    return emit('sort-off')
  }
  return emit(`sort-${order}` as 'sort-asc')
}
</script>

<template>
  <DropdownMenuRoot :modal="false" v-model:open="open">
    <DropdownMenuTrigger as-child>
      <VuButton
        v-bind="$attrs"
        @dragstart="
          () => {
            console.log('dragstart ineer')
          }
        "
        :class="
          mergeCssClasses('c8-flat not-sap-cell px-$m w-full justify-start rounded-0', props.class)
        "
        icon-side="right"
        :aria-selected="optsSet.size && open"
        :title="isSmartTableInDevMode ? field.$Name : field.$label"
      >
        <span class="flex-shrink-1 truncate">
          {{ isSmartTableInDevMode ? field.$Name : field.$label }}
        </span>
        <div class="flex gap-$s">
          <div class="relative pr-xxs" v-if="optsSet.has('filters') && filters?.length">
            <VuIcon name="i--filter" />
            <div
              class="absolute scope-secondary surface-200 text-body-s py-1px rounded top-[-.75em] right-[-0.75em]"
              :class="{
                'px-$xxs': filters.length < 10,
                'px-[2px]': filters.length > 9,
              }"
            >
              {{ filters.length > 9 ? '9+' : filters.length }}
            </div>
          </div>
          <VuIcon v-if="optsSet.has('sort') && order" :name="`i--sort-${order}`" />
          <VuIcon
            v-if="
              optsSet.size &&
              !(order && optsSet.has('sort')) &&
              !(filters?.length && optsSet.has('filters'))
            "
            :name="open ? 'i--chevron-up' : 'i--chevron-down'"
          />
        </div>
        <slot></slot>
      </VuButton>
    </DropdownMenuTrigger>

    <DropdownMenuPortal v-if="optsSet.size">
      <DropdownMenuContent
        align="start"
        class="z-150 min-w-[200px] outline-none bg-white/50 dark:bg-grey-500/10 backdrop-blur-xl border shadow-popup rounded"
        :side-offset="-8"
      >
        <DropdownMenuItem as-child v-if="optsSet.has('sort')">
          <VuButton
            label="Sort Ascending"
            :aria-selected="order === 'asc'"
            @click="emitSort('asc')"
            icon="i--sort-asc"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>
        <DropdownMenuItem as-child v-if="optsSet.has('sort')">
          <VuButton
            label="Sort Descending"
            :aria-selected="order === 'desc'"
            @click="emitSort('desc')"
            icon="i--sort-desc"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator class="h-[0px] border-b" v-if="optsSet.has('sort')" />

        <DropdownMenuItem as-child v-if="optsSet.has('filters')">
          <VuButton
            :label="filters?.length ? `Filters (${filters.length})` : 'Filters'"
            icon="i--filter"
            @click="emit('filters')"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>

        <DropdownMenuItem as-child v-if="optsSet.has('filters') && filters?.length">
          <VuButton
            label="Clear Filters"
            icon="i--filter-off"
            @click="emit('filters-off')"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator class="h-[0px] border-b" v-if="optsSet.has('filters')" />

        <DropdownMenuItem as-child v-if="optsSet.has('hide')">
          <VuButton
            label="Hide Column"
            icon="i--eye-off"
            @click="emit('hide')"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator class="h-[0px] border-b" v-if="optsSet.has('hide')" />

        <DropdownMenuItem as-child v-if="optsSet.has('config')">
          <VuButton
            label="Configure Table"
            icon="i--config"
            @click="emit('config')"
            class="c8-flat justify-between w-full px-$m fw-400"
            icon-side="right"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
