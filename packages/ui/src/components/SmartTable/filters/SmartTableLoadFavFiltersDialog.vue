<script setup lang="ts">
import { onMounted, watch } from 'vue'
import SmartFieldLabel from '../../SmartRecord/SmartFieldLabel.vue'
import { useSmartFilterPI } from './SmartFilter.pi'
import SmartTableFavFiltersList from './SmartTableFavFiltersList.vue'
import type { TODataTypedFilterValue } from '@notsap/odata'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuButton from 'vunor/Button.vue'

// const props = defineProps<{}>()
const open = defineModel<boolean>('open')

const { favFilters, fieldName, refreshFavFilters } = useSmartFilterPI().inject()

onMounted(refreshFavFilters)

const emit = defineEmits<{
  (e: 'select', filters: TODataTypedFilterValue[]): void
}>()

watch([open], async () => {
  if (open.value) {
    refreshFavFilters()
  }
})
</script>
<template>
  <VuDialog
    v-model:open="open"
    modal
    close-button
    level="h6"
    rounded
    no-padding
    overlay-class="z-100"
    content-class="layer-0"
    class="layer-0 elevated w-full h-auto max-w-40em max-h-40em"
  >
    <template v-slot:header>
      <header class="dialog-header">
        <SmartFieldLabel :name="fieldName" v-slot="{ label }">
          <VuCardHeader class="truncate max-w-100% text-my-0">
            Saved filters "{{ label }}"
          </VuCardHeader>
        </SmartFieldLabel>
      </header>
    </template>

    <SmartTableFavFiltersList
      v-if="favFilters.length"
      @select="
        f => {
          emit('select', f)
          open = false
        }
      "
    />

    <section v-else class="px-$card-spacing py-$m">
      <div class="scope-warn p-$m border surface-50 rounded flex items-center gap-$s">
        No saved filters found. To save filters press F2 while filter filed is active.
      </div>
    </section>

    <template v-slot:footer>
      <footer class="dialog-footer flex elevated flex-shrink-0 justify-end">
        <template v-if="favFilters.length > 0">
          <VuButton label="Cancel" class="c8-flat" @click="open = false" />
        </template>

        <VuButton v-else label="Got it" class="c8-flat" @click="open = false" />
      </footer>
    </template>
  </VuDialog>
</template>
