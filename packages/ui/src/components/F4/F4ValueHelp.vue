<script setup lang="ts">
import { ref } from 'vue'
import SmartTableRoot from '../SmartTable/SmartTableRoot.vue'
import SmartTable from '../SmartTable/SmartTable.vue'
import { useValueHelp } from './use-value-help.composable'
import SmartTableFilters from '../SmartTable/filters/SmartTableFilters.vue'
import type { TODataTypedFilterValue } from 'notsapodata'
import ODataEntitySet from '../../renderless/ODataEntitySet.vue'
import VuCardInner from 'vunor/CardInner.vue'
import VuInput from 'vunor/Input.vue'
import VuButton from 'vunor/Button.vue'

const props = defineProps<{
  field: string
}>()

const TOP = 1000

const { getFilterValue, columnsNames, valueList, searchSupported, model } = useValueHelp(
  props.field
)

const searchTerm = defineModel('search', { default: '' })

const selected = defineModel<TODataTypedFilterValue[]>()

const lastSearchTerm = ref(searchTerm.value)

const showFilters = ref(false)

function onSearch(query: () => void) {
  if (lastSearchTerm.value !== searchTerm.value) {
    lastSearchTerm.value = searchTerm.value
    query()
  }
}
</script>
<template>
  <section class="layer-0">
    <ODataEntitySet v-if="!!valueList && !!model" :model :entity-set="valueList.CollectionPath">
      <!-- prettier-ignore -->
      <SmartTableRoot
        :top="TOP"
        :search-term
        :columns-names
        :row-value-fn="getFilterValue" 
        keep-selected-after-refresh
        v-slot="{ query, inlineCount }"
        v-model:selectedRows="(selected as unknown as Record<string, string>[])"
        query-on-mount
      >
        <div class="pt-$m flex flex-col gap-$m border-b">
          <VuCardInner v-if="searchSupported" class="py-0 flex gap-$m justify-between flex-wrap">
            <VuInput
              placeholder="Search"
              design="filled"
              class="w-15em"
              v-model="searchTerm"
              @keydown.enter="onSearch(query)"
              @focus="lastSearchTerm = searchTerm"
              @blur="onSearch(query)"
              icon-append="i--search"
              @append-click="onSearch(query)"
            />

            <VuButton
              v-if="searchSupported"
              :label="!showFilters ? 'Show Filters' : 'Hide Filters'"
              class="c8-flat"
              @click="showFilters = !showFilters"
            />
          </VuCardInner>

          <VuCardInner
            v-if="(!searchSupported || showFilters) && valueList.Parameters.length"
            class="py-0"
          >
            <div class="flex gap-$m flex-wrap">
              <SmartTableFilters
                :filters-names="valueList.Parameters.map((p: any) => p.ValueListProperty)"
                stack-label
                class="w-15em"
                @change="query()"
              />
            </div>
          </VuCardInner>

          <div class="px-$card-spacing opacity-75 pb-$s">
            <span class="text-body-s"> {{ inlineCount }} records found </span>
          </div>
        </div>
        <template v-if="columnsNames.length">
          <SmartTable
            :row-value="getFilterValue"
            :column-menu="{sort: true }"
            :virtual-row-height="38"
            :virtual-overscan="50"
            stretch
            select-all-enabled
            sticky-header
            sticky-checkbox
            fixed-row-height
            select-on-click
            rows-control="hard-limit"
            select="multi"
            class="layer-0 border-t"
          />
        </template>
      </SmartTableRoot>
    </ODataEntitySet>
  </section>
</template>
