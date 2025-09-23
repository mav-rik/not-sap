<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import SmartFieldLabel from '../../SmartRecord/SmartFieldLabel.vue'
import type { TODataTypedFilterValue } from '@notsap/odata'
import { useSmartFilterPI } from './SmartFilter.pi'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuInput from 'vunor/Input.vue'
import VuIcon from 'vunor/Icon.vue'
import VuInnerLoading from 'vunor/InnerLoading.vue'
import VuButton from 'vunor/Button.vue'

const props = defineProps<{
  label: string
  filters: TODataTypedFilterValue[]
}>()
const open = defineModel<boolean>('open')

const labelName = ref('')

function selectLabelName() {
  const input = document.querySelector('input#label-name')
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}
const { favFilters, saveFavFilter, fieldName } = useSmartFilterPI().inject()

onMounted(init)
onMounted(selectLabelName)

async function init() {
  labelName.value = props.label || ''
}

const labelNames = computed<Set<string>>(() => {
  return new Set(favFilters.value.map(f => f.label))
})

const labelNameError = computed(() => {
  if (!labelName.value) {
    return 'Label can not be empty'
  }
  if (labelName.value === 'Default') {
    return '"none" is reserved'
  }
})

watch([open], async () => {
  if (open.value) {
    init()
    await nextTick()
    selectLabelName()
  }
})

const error = ref<string>()
const loading = ref(false)

async function onSaveFilter() {
  if (labelNameError.value) return
  error.value = undefined
  loading.value = true
  try {
    await saveFavFilter(labelName.value, props.filters)
  } catch (e) {
    error.value = (e as Error).message
  }
  if (!error.value) {
    open.value = false
  }
  loading.value = false
}
</script>
<template>
  <VuDialog
    v-model:open="open"
    modal
    close-button
    level="h6"
    no-padding
    rounded
    overlay-class="z-100"
    class="layer-0 elevated w-full h-auto max-w-40em max-h-40em"
  >
    <template v-slot:header>
      <header class="dialog-header">
        <SmartFieldLabel :name="fieldName" v-slot="{ label }">
          <VuCardHeader class="truncate max-w-100% text-my-0">
            Save filter "{{ label }}"
          </VuCardHeader>
        </SmartFieldLabel>
      </header>
    </template>

    <VuInput
      v-if="filters.length > 0"
      id="filter-name"
      label="Edit your saved filter name"
      stack-label
      design="filled"
      :class="{
        'scope-error': !!labelNameError,
      }"
      v-model="labelName"
      :hint="labelNames.has(labelName) ? 'Saved filter with this label will be overwritten' : ''"
      :error="labelNameError"
      @keydown.enter="onSaveFilter"
      :icon-prepend="labelNames.has(labelName) ? 'i--fav-on' : 'i--fav-off'"
    />
    <div v-else class="scope-warn p-$m border surface-50 rounded flex items-center gap-$s">
      Please first add some filters, then you will be able to save filters as favorites
      <!-- <VuIcon name="i--fav-on" /> -->
    </div>

    <VuInnerLoading v-if="loading" />

    <template v-slot:footer>
      <footer class="dialog-footer flex elevated flex-shrink-0 justify-end">
        <template v-if="filters.length > 0">
          <VuButton
            :label="labelNames.has(labelName) ? 'Overwrite' : 'Save'"
            class="c8-filled"
            @click="onSaveFilter"
          />
          <VuButton label="Cancel" class="c8-flat" @click="open = false" />
        </template>

        <VuButton v-else label="Got it" class="c8-flat" @click="open = false" />
      </footer>
    </template>
  </VuDialog>
</template>
