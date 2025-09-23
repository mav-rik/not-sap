<script setup lang="ts" generic="T extends object">
import type { UnwrapRef } from 'vue'

type TModelItem = { label?: string; value: string; data: T; index: number }

const props = defineProps<{
  title?: string
  items: T[]
  disabled?: string[]
  getLabel: (item: T) => string
  getValue: (item: T) => string
}>()

const modelValue = defineModel<string[]>({ default: () => [] })
const itemsMap = computed(() => {
  const m = new Map<string, Omit<TModelItem, 'index'>>()
  for (const item of props.items) {
    const value = props.getValue(item)
    m.set(value, {
      data: item,
      value,
      label: props.getLabel(item),
    })
  }
  return m
})

const listBoxModel = ref<string[]>([])

const dragIndex = ref(-1)
const dragOverIndex = ref(-1)

const orderedItems = ref<TModelItem[]>([])
const searchTerm = ref('')
const orderedItemsWithSearch = computed<TModelItem[]>(() => {
  return orderedItems.value.filter(
    f =>
      (f.label || f.value).trim().toLowerCase().search(searchTerm.value.trim().toLowerCase()) >= 0
  ) as TModelItem[]
})

onMounted(() => {
  const model = modelValue.value || ([] as string[])
  const modelSet = new Set<string>(model)
  const valuesSet = new Set<string>(itemsMap.value.keys())
  const unselectedSet = new Map<string, Omit<TModelItem, 'index'>>(itemsMap.value)

  modelSet.forEach(name => {
    if (valuesSet.has(name)) {
      unselectedSet.delete(name)
    } else {
      modelSet.delete(name)
    }
  })

  const selected = Array.from(modelSet)
  listBoxModel.value = selected
  const unselected = Array.from(unselectedSet.values())
    .sort((a, b) => (props.getLabel(a.data) > props.getLabel(b.data) ? 1 : -1))
    .map(v => v.value)
  const ordered = [] as Omit<TModelItem, 'index'>[]
  for (const name of selected) {
    ordered.push(itemsMap.value.get(name)!)
  }
  for (const name of unselected) {
    ordered.push(itemsMap.value.get(name)!)
  }
  orderedItems.value = ordered.map((o, index) => ({
    ...o,
    label: o.label || o.value,
    data: o.data as UnwrapRef<T>,
    index,
  }))
})

function dragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}
function drop() {
  const itemToMove = orderedItems.value.splice(dragIndex.value, 1)[0]
  const targetIndex =
    dragOverIndex.value > dragIndex.value ? dragOverIndex.value - 1 : dragOverIndex.value
  orderedItems.value.splice(targetIndex, 0, itemToMove)
  updateOrderedFields()
  dragIndex.value = -1
  dragOverIndex.value = -1
}
function over(event: DragEvent, index: number) {
  const item = event.target as HTMLDivElement
  const { y, height } = item.getBoundingClientRect()
  const atTop = event.clientY - y < height / 2
  let overIndex = atTop ? index : findFilteredIndex(index, 1) ?? index + 1
  dragOverIndex.value = overIndex
}

function findFilteredIndex(index: number, offset: number) {
  for (let i = 0; i < orderedItemsWithSearch.value.length; i++) {
    if (orderedItemsWithSearch.value[i].index === index) {
      return orderedItemsWithSearch.value[i + offset]?.index
    }
  }
}

function moveExact(index: number, targetIndex: number) {
  const itemToMove = orderedItems.value.splice(index, 1)[0]
  orderedItems.value.splice(targetIndex, 0, itemToMove)
  updateOrderedFields()
}
function moveOneStep(index: number, offset: number) {
  const targetIndex = findFilteredIndex(index, offset)
  if (typeof targetIndex === 'number') {
    const itemToMove = orderedItems.value.splice(index, 1)[0]
    orderedItems.value.splice(targetIndex, 0, itemToMove)
    updateOrderedFields()
  }
}
function updateOrderedFields() {
  orderedItems.value.forEach((o, index) => (o.index = index))
  orderedItems.value = [...orderedItems.value]
  updateModel()
}
async function updateModel() {
  const s = new Set(listBoxModel.value as string[])
  modelValue.value = orderedItems.value.filter(f => s.has(f.value)).map(f => f.value)
}
function selectAll() {
  listBoxModel.value = orderedItemsWithSearch.value.map(f => f.value)
  updateModel()
}
function deselectAll() {
  listBoxModel.value = listBoxModel.value.filter(v => props.disabled?.includes(v))
  updateModel()
}
</script>

<template>
  <ListboxRoot multiple v-model="listBoxModel" @update:modelValue="updateModel">
    <slot name="filter-bar">
      <ListboxFilter
        as-child
        class="sticky top-0 bg-current/100 px-$card-spacing py-$xs border-b z-1 flex flex-row-reverse gap-$xs"
      >
        <div class="flex items-center">
          <VuInput
            v-model="searchTerm"
            design="filled"
            placeholder="Search"
            class="w-12em"
            icon-append="i--search"
          />
          <div class="flex-grow-1"></div>
          <VuButton
            class="c8-flat btn-square"
            title="Deselect All"
            icon="i--select-none"
            @click="deselectAll"
          />
          <VuButton
            class="c8-flat btn-square"
            title="Select All"
            icon="i--select-all"
            @click="selectAll"
          />
          <div class="fw-$bold lh-fingertip" v-if="!!title">{{ title }}</div>
        </div>
      </ListboxFilter>
    </slot>
    <ListboxContent class="flex flex-col">
      <ListboxItem
        v-for="item of orderedItemsWithSearch"
        :key="item.value"
        :value="item.value"
        class="group/lbindicator hover:layer-1 data-[highlighted]:layer-2 outline-none relative"
        :disabled="disabled?.includes(item.value)"
        :draggable="disabled?.includes(item.value) ? false : true"
        :class="{
          'opacity-25': dragIndex === item.index,
          'pointer-events-none cursor-default!': dragIndex >= 0 && disabled?.includes(item.value),
        }"
        @dragstart="dragStart(item.index, $event)"
        @dragenter.prevent="over($event, item.index)"
        @dragover.prevent="over($event, item.index)"
        @drop="drop()"
      >
        <!-- drop placeholder -->
        <div
          v-if="dragOverIndex === item.index"
          class="absolute left-0 right-0 h-2px bg-grey-500/40 pointer-events-none top-[-1px]"
        >
          <div class="absolute left-0 size-6px top-[-2px] bg-grey-500 rounded-full"></div>
        </div>

        <!-- item -->
        <div class="not-sap-listbox-item cursor-grab">
          <div
            class="not-sap-listbox-checkbox cursor-pointer"
            :class="{
              'scope-grey opacity-50': disabled?.includes(item.value),
            }"
          >
            <ListboxItemIndicator class="checkbox-indicator">
              <VuIcon v-if="true" name="i--checkmark" class="checkbox-icon" />
            </ListboxItemIndicator>
          </div>

          <div class="grid grid-cols-[1fr_auto_1fr] w-full items-center" @click.stop>
            <slot name="label" :item="item.data" :label="item.label">
              <div>{{ item.label }}</div>
            </slot>

            <div>
              <slot name="additional" :item="item.data" :label="item.label"> </slot>
            </div>

            <div
              class="group-hover/lbindicator:opacity-100 opacity-0 flex gap-$s justify-center items-center"
            >
              <VuButton
                icon="i--chevron-up-2"
                @click.stop="moveExact(item.index, 0)"
                title="Move all the way up"
                class="c8-flat btn-square current-icon-scope-color-500"
              />

              <VuButton
                icon="i--chevron-up"
                @click.stop="moveOneStep(item.index, -1)"
                title="Move Up"
                class="c8-flat btn-square current-icon-scope-color-500"
              />

              <VuButton
                icon="i--chevron-down"
                @click.stop="moveOneStep(item.index, 1)"
                title="Move Down"
                class="c8-flat btn-square current-icon-scope-color-500"
              />

              <VuButton
                icon="i--chevron-down-2"
                title="Move all the way down"
                @click.stop="moveExact(item.index, orderedItems.length)"
                class="c8-flat btn-square current-icon-scope-color-500"
              />
            </div>
          </div>
        </div>
      </ListboxItem>
    </ListboxContent>
  </ListboxRoot>
</template>
