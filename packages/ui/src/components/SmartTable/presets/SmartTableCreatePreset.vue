<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useSmartTablePI } from '../SmartTable.pi'
import VuDelayedSwitch from 'vunor/DelayedSwitch.vue'
import VuDialog from 'vunor/Dialog.vue'
import VuCardHeader from 'vunor/CardHeader.vue'
import VuInput from 'vunor/Input.vue'
import VuCheckbox from 'vunor/Checkbox.vue'
import VuIcon from 'vunor/Icon.vue'
import VuInnerLoading from 'vunor/InnerLoading.vue'
import VuButton from 'vunor/Button.vue'

const open = defineModel<boolean>('open')
const presetName = ref('MyPreset')

function selectPresetName() {
  const input = document.querySelector('input#preset-name')
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}
const { presets, columnsNames, filtersNames, sorters, fieldsFiltersCount, createPreset } =
  useSmartTablePI().inject()

const presetLabels = computed(() => new Set(presets.value.map(p => p.label)))

const presetNameError = computed(() => {
  if (!presetName.value) {
    return 'Preset name cannot be empty'
  }
  if (presetName.value === 'Default') {
    return '"none" preset name is reserved'
  }
  if (presetLabels.value.has(presetName.value)) {
    return 'Preset with this name already exists'
  }
})

const optsError = computed(
  () =>
    (!opts.columnsNames &&
      !opts.filtersNames &&
      !opts.sorters &&
      !opts.fieldsFilters &&
      'Select at least one item') ||
    undefined
)

const opts = reactive({
  columnsNames: true,
  filtersNames: true,
  sorters: true,
  fieldsFilters: false,
  fav: true,
  public: false,
  default: false,
})

onMounted(selectPresetName)
watch([open], async () => {
  if (open.value) {
    presetName.value = 'MyPreset'
    await nextTick()
    selectPresetName()
  }
})

const error = ref<string>()
const loading = ref(false)

async function onCreatePreset() {
  if (presetNameError.value || optsError.value) return
  error.value = undefined
  loading.value = true
  try {
    await createPreset({
      label: presetName.value,
      columnsNames: opts.columnsNames,
      filtersNames: opts.filtersNames,
      sorters: opts.sorters,
      fieldsFilters: opts.fieldsFilters,
      fav: opts.fav,
      public: opts.public,
      default: opts.default,
    })
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
  <VuDelayedSwitch v-slot="{ on }" :value="open">
    <VuDialog
      v-if="on"
      v-model:open="open"
      modal
      close-button
      level="h6"
      no-padding
      rounded
      class="layer-0 elevated w-full h-auto max-w-40em max-h-40em"
    >
      <template v-slot:header>
        <header class="dialog-header">
          <VuCardHeader class="truncate max-w-100% text-my-0"> Create Preset </VuCardHeader>
        </header>
      </template>

      <VuInput
        id="preset-name"
        label="Preset name"
        stack-label
        design="filled"
        :class="{
          'scope-error': !!presetNameError,
        }"
        v-model="presetName"
        :rules="[(v: string) => presetLabels.has(v) || 'A preset with this name already exists']"
        :error="presetNameError"
        @keydown.enter="onCreatePreset"
      />

      <div class="flex flex-col gap-$s mt-$l" :class="{ 'scope-error': !!optsError }">
        <strong :class="optsError ? 'text-scope-color' : ''">Include in preset</strong>
        <VuCheckbox v-model="opts.columnsNames" label="Displayed Columns" v-slot="{ label }">
          <div class="flex gap-$s items-center">
            <VuIcon name="i--columns" class="current-icon-grey" />
            <span>{{ label }} ({{ columnsNames.length }})</span>
          </div>
        </VuCheckbox>
        <VuCheckbox v-model="opts.filtersNames" label="Displayed Filters" v-slot="{ label }">
          <div class="flex gap-$s items-center">
            <VuIcon name="i--filter" class="current-icon-grey" />
            <span>{{ label }} ({{ filtersNames.length }})</span>
          </div>
        </VuCheckbox>
        <VuCheckbox v-model="opts.sorters" label="Applied Sorters" v-slot="{ label }">
          <div class="flex gap-$s items-center">
            <VuIcon name="i--sort-asc" class="current-icon-grey" />
            <span>{{ label }} ({{ sorters.length }})</span>
          </div>
        </VuCheckbox>
        <VuCheckbox v-model="opts.fieldsFilters" label="Applied Filters" v-slot="{ label }">
          <div class="flex gap-$s items-center relative">
            <VuIcon name="i--filter" class="current-icon-grey" />
            <div
              class="absolute scope-secondary surface-200 text-body-s py-1px rounded top-[-.2em] left-[1em] px-$xxs"
            >
              ..
            </div>
            <span>{{ label }} ({{ fieldsFiltersCount }})</span>
          </div>
        </VuCheckbox>
        <div class="text-error" v-if="optsError">{{ optsError }}</div>
      </div>

      <div class="flex flex-col gap-$s mt-$l">
        <strong>Preset Attributes</strong>
        <VuCheckbox v-model="opts.fav" label="Add to Favorites" />
        <VuCheckbox v-model="opts.default" label="Apply by Default" />
        <VuCheckbox
          v-model="opts.public"
          label="Public (other users will be able to see this preset)"
        />
      </div>

      <div v-if="error" class="p-$m scope-error surface-50 border rounded-$m">
        {{ error }}
      </div>

      <VuInnerLoading v-if="loading" />

      <template v-slot:footer>
        <footer class="dialog-footer flex elevated flex-shrink-0 justify-end">
          <VuButton label="Create" class="c8-filled" @click="onCreatePreset" />
          <VuButton label="Cancel" class="c8-flat" @click="open = false" />
        </footer>
      </template>
    </VuDialog>
  </VuDelayedSwitch>
</template>
