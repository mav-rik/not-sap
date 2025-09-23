<script setup lang="ts">
import type { TNotSapPreset } from '@/_not-sap-ui/presets/presets'
import { useSmartTablePI } from '../SmartTable.pi'

const open = defineModel<boolean>('open')

const {
  presets,
  deletePreset,
  // updatePreset,
  updateDefaultPreset,
  updateFavPresets,
  activePreset,
  applyPreset,
} = useSmartTablePI().inject()

const copy = ref<
  {
    id: string
    label: string
    fav?: boolean
    public?: boolean
    default?: boolean
    owner?: string
    toDelete?: boolean
    content: Record<string, unknown>
  }[]
>([])

const defaultPreset = computed(() => presets.value.find(p => p.default)?.id)
const defaultCopy = ref<string>()
const pMap = new Map<string, TNotSapPreset>()

watch([open], () => {
  if (open.value) {
    copy.value = [
      ...presets.value.map(p => ({
        id: p.id,
        label: p.label,
        fav: p.fav,
        public: p.public,
        owner: p.owner,
        default: p.default,
        content: p.content,
      })),
    ]
    defaultCopy.value = copy.value.find(p => p.default)?.id
    for (const p of presets.value) {
      pMap.set(p.id, p)
    }
  }
})

const loading = ref(false)
const error = ref<string>()

async function onSave() {
  const toDelete = copy.value.filter(p => p.toDelete)
  const deleteSet = new Set(toDelete.map(p => p.id))
  const toUpdate = copy.value.filter(p => !p.toDelete && p.id !== '*standard*')
  loading.value = true
  error.value = undefined
  try {
    for (const item of toUpdate) {
      const p = pMap.get(item.id)
      if (p && deleteSet.has(item.id)) {
        p.fav = false
      } else if (p && p.fav !== item.fav) {
        p.fav = !!item.fav
      }
    }
    await updateFavPresets()
    for (const item of toDelete) {
      await deletePreset(item.id)
    }
    if (deleteSet.has(defaultCopy.value ?? '')) {
      await updateDefaultPreset('*standard*')
    } else if (defaultPreset.value !== defaultCopy.value && defaultCopy.value) {
      await updateDefaultPreset(defaultCopy.value)
    }
    if (deleteSet.has(activePreset.value?.id || '')) {
      applyPreset(presets.value[0])
    }
  } catch (e) {
    error.value = (e as Error).message
  }
  loading.value = false
  open.value = false
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
      content-class="overflow-y-auto"
      class="layer-0 elevated w-full h-auto max-w-50em max-h-40em"
    >
      <template v-slot:header>
        <header class="dialog-header">
          <VuCardHeader class="truncate max-w-100% text-my-0"> Manage Presets </VuCardHeader>
        </header>
      </template>

      <table class="w-full" cellpadding="8" cellspacing="0">
        <thead>
          <tr class="bg-grey/10">
            <th>Favorite</th>
            <th align="left">Name</th>
            <th>Default</th>
            <th>Public</th>
            <th align="left">Includes</th>
            <th align="left">Owner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="preset in copy.filter(p => !p.toDelete)" :key="preset.id">
            <td>
              <div class="flex justify-center">
                <VuCheckbox v-model="preset.fav" :disabled="preset.id === '*standard*'" />
              </div>
            </td>
            <td>
              {{ preset.label }}
            </td>
            <td>
              <div class="flex justify-center">
                <VuCheckbox
                  :model-value="defaultCopy === preset.id"
                  @update:modelValue="() => (defaultCopy = preset.id)"
                />
              </div>
            </td>
            <td>
              <div class="flex justify-center">
                <VuCheckbox disabled v-model="preset.public" />
              </div>
            </td>
            <td>
              <div class="flex flex-center gap-$xs current-icon-grey">
                <VuIcon name="i--columns" v-if="preset.content.columnsNames" title="Columns" />
                <VuIcon
                  name="i--filter"
                  v-if="preset.content.filtersNames"
                  title="Displayed Filters"
                />
                <VuIcon name="i--sort-asc" v-if="preset.content.sorters" title="Sorters" />
                <div
                  class="flex gap-$s items-center relative"
                  v-if="preset.content.fieldsFilters"
                  title="Applied Filters"
                >
                  <VuIcon name="i--filter" class="current-icon-grey" />
                  <div
                    class="absolute scope-secondary surface-200 text-body-s py-1px rounded top-[-.2em] left-[1em] px-$xxs"
                  >
                    ..
                  </div>
                </div>
              </div>
            </td>
            <td>
              {{ preset.owner }}
            </td>
            <td>
              <VuButton
                v-if="preset.id !== '*standard*'"
                label="Delete"
                class="c8-flat"
                @click="preset.toDelete = true"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="error" class="p-$m scope-error surface-50 border rounded-$m">
        {{ error }}
      </div>

      <VuInnerLoading v-if="loading" />

      <template v-slot:footer>
        <footer class="dialog-footer flex elevated flex-shrink-0 justify-end">
          <VuButton label="Save" class="c8-filled" @click="onSave" />
          <VuButton label="Cancel" class="c8-flat" @click="open = false" />
        </footer>
      </template>
    </VuDialog>
  </VuDelayedSwitch>
</template>
