<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ListboxRoot, ListboxContent, ListboxItem } from 'radix-vue'
import type { TODataTypedFilterValue } from '@notsap/odata'
import { useSmartFilterPI } from './SmartFilter.pi'
import VuInnerLoading from 'vunor/InnerLoading.vue'
import VuIcon from 'vunor/Icon.vue'

const { favFilters, refreshFavFilters, delFavFilter } = useSmartFilterPI().inject()

onMounted(() => {
  refreshFavFilters()
})

const loading = ref(false)

async function _del(label: string) {
  loading.value = true
  try {
    await delFavFilter(label)
  } finally {
    loading.value = false
  }
}
const emit = defineEmits<{
  (e: 'select', filters: TODataTypedFilterValue[]): void
}>()
</script>

<template>
  <ListboxRoot
    v-if="favFilters.length"
    @update:modelValue="(f: any) => emit('select', f as TODataTypedFilterValue[])"
  >
    <ListboxContent>
      <ListboxItem
        v-for="item of favFilters"
        :key="item.label"
        :value="item.filters"
        class="hover:layer-1 data-[highlighted]:layer-2 outline-none relative px-$card-spacing"
      >
        <div class="flex items-center justify-between h-fingertip group/fav">
          {{ item.label }}
          <VuIcon
            name="i--delete"
            @click.stop.prevent="_del(item.label)"
            title="Delete"
            class="opacity-0 group-hover/fav:opacity-100 current-icon-grey hover:current-icon-error cursor-pointer"
          />
        </div>
      </ListboxItem>
    </ListboxContent>
  </ListboxRoot>

  <VuInnerLoading v-if="loading" />
</template>
