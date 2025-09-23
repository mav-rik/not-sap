<script setup lang="ts">
import { onMounted } from 'vue'
import type { TODataTypedFilterValue } from 'notsapodata'
import { useSmartFilterPI } from './SmartFilter.pi'
import SmartTableFavFiltersList from './SmartTableFavFiltersList.vue'
import VuPopover from 'vunor/Popover.vue'
import VuButton from 'vunor/Button.vue'
import VuIcon from 'vunor/Icon.vue'
import VuCard from 'vunor/Card.vue'

const props = defineProps<{
  fieldName: string
  filters: TODataTypedFilterValue[]
  canSave?: boolean
}>()

const { openFavFiltersDialog, favFilters, refreshFavFilters } = useSmartFilterPI().inject()
onMounted(() => {
  refreshFavFilters()
})

function save() {
  openFavFiltersDialog('save', props.filters)
}

const emit = defineEmits<{
  (e: 'select', filters: TODataTypedFilterValue[]): void
}>()
</script>

<template>
  <VuPopover align="start" v-if="favFilters.length">
    <template #default="{ isOpen }">
      <VuButton class="c8-flat" title="Manage saved filters" :aria-selected="isOpen">
        <VuIcon :name="isOpen ? 'i--fav-on' : 'i--fav-off'" />
        <VuIcon
          name="i--chevron-down"
          class="transition-transform"
          :class="{
            'rotate-180': isOpen,
          }"
        />
      </VuButton>
    </template>
    <template #content="{ close }">
      <VuCard
        class="layer-0 elevated shadow-popup min-w-15em rounded z-101 relative"
        no-padding
        level="body"
      >
        <SmartTableFavFiltersList
          @select="
            (filters: TODataTypedFilterValue[]) => {
              emit('select', filters)
              close()
            }
          "
        />
        <div class="border-t flex gap-$m justify-end">
          <div class="grow"></div>
          <VuButton
            v-if="canSave && filters.length > 0"
            icon="i--fav-off"
            label="Save"
            class="c8-flat px-$card-spacing"
            @click="
              () => {
                save()
                close()
              }
            "
          />
        </div>
      </VuCard>
    </template>
  </VuPopover>
  <VuButton
    v-else-if="canSave && filters.length > 0"
    icon="i--fav-off"
    class="c8-flat"
    label="Save"
    @click="save"
  />
</template>
