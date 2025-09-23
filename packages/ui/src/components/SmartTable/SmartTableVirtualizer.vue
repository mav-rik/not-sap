<script setup lang="ts" generic="T extends any">
import { computed, type Ref } from 'vue'
import { Primitive } from 'radix-vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useParentElement } from '@vueuse/core'

const props = defineProps<{
  options: T[]
  estimateSize?: number
  bypass?: boolean
  overscan?: number
}>()

const parentEl = useParentElement() as Ref<HTMLElement>

const virtualizer = useVirtualizer({
  get scrollPaddingStart() {
    return 0
  },
  get scrollPaddingEnd() {
    return 0
  },
  get count() {
    return props.options.length
  },
  get horizontal() {
    return false
  },
  estimateSize() {
    return props.estimateSize ?? 50
  },
  getScrollElement() {
    return parentEl.value?.closest('[data-virtual-scroll]')
  },
  overscan: props.overscan ?? 0,
})

const vi = computed(() => virtualizer.value.getVirtualItems())

const virtualizedItems = computed(() =>
  vi.value.map(vItem => ({
    item: props.options[vItem.index],
    ariaSetsize: props.options.length,
    ariaPosinset: vItem.index + 1,
    dataIndex: vItem.index,
  }))
)

const spaceBefore = computed(() => vi.value?.[0]?.start || 0)
</script>

<template>
  <Primitive v-if="bypass">
    <slot v-for="item of options" v-bind="{ item, spaceBefore: undefined }"> </slot>
  </Primitive>
  <Primitive
    v-else
    :style="{
      height: `${virtualizer.getTotalSize()}px`,
    }"
  >
    <slot v-for="vItem of virtualizedItems" v-bind="vItem" :space-before> </slot>
    <tr />
  </Primitive>
</template>
