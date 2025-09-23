<script setup lang="ts">
import type { EntitySetField, TODataFilterConditionType, TODataTypedFilterValue } from '@/_odata'
import { doesConditionHave2ndValue, isConditionFilled } from '../SmartTable/filter-conditions'
import { ref, type Ref, nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { createCaledarDate, dateRangeShortcuts } from './date-shortcuts'

type TConditionItem = { label: string; value: TODataFilterConditionType }

const props = defineProps<{
  field: EntitySetField
  isV4?: boolean
}>()

const conditionTypes: { Include: TConditionItem[]; Exclude: TConditionItem[] } = {
  Include: [
    { label: 'contains', value: props.isV4 ? 'contains' : 'substringof' },
    { label: 'equal to', value: 'eq' },
    { label: 'between', value: 'bw' },
    { label: 'starts with', value: 'starts' },
    { label: 'ends with', value: 'ends' },
    { label: 'less than', value: 'lt' },
    { label: 'less than or equal to', value: 'le' },
    { label: 'greater than', value: 'gt' },
    { label: 'greater than or equal to', value: 'ge' },
    { label: 'empty', value: 'empty' },
  ],
  Exclude: [
    { label: 'does not contain', value: props.isV4 ? 'notContains' : 'notSubstringof' },
    { label: 'not equal to', value: 'notEq' },
    { label: 'not between', value: 'notBw' },
    { label: 'does not start with', value: 'notStarts' },
    { label: 'does not end with', value: 'notEnds' },
    { label: 'not less than', value: 'notLt' },
    { label: 'not less than or equal to', value: 'notLe' },
    { label: 'not greater than', value: 'notGt' },
    { label: 'not greater than or equal to', value: 'notGe' },
    { label: 'not empty', value: 'notEmpty' },
  ],
}

const conditionTypesDate: { Include: TConditionItem[]; Exclude: TConditionItem[] } = {
  Include: [
    { label: 'equal to', value: 'eq' },
    { label: 'between', value: 'bw' },
    { label: 'before', value: 'lt' },
    { label: 'before or on', value: 'le' },
    { label: 'after', value: 'gt' },
    { label: 'on or after', value: 'ge' },
    { label: 'empty', value: 'empty' },
  ],
  Exclude: [
    { label: 'not equal to', value: 'notEq' },
    { label: 'not between', value: 'notBw' },
    { label: 'not before', value: 'notLt' },
    { label: 'not before or on', value: 'notLe' },
    { label: 'not after', value: 'notGt' },
    { label: 'not on or after', value: 'notGe' },
    { label: 'not empty', value: 'notEmpty' },
  ],
}

const isDateType = computed(() => ['Edm.DateTime', 'Edm.Date'].includes(props.field.$Type || ''))

const conditionTypesByType = computed(() =>
  isDateType.value ? conditionTypesDate : conditionTypes
)

const conditions = defineModel<TODataTypedFilterValue[]>({
  default: () => [],
}) as Ref<TODataTypedFilterValue[]>

const dummy = ref<TODataTypedFilterValue>({
  type: isDateType.value ? 'eq' : props.isV4 ? 'contains' : 'substringof',
  value: [undefined as unknown as string, undefined as unknown as string],
}) as Ref<TODataTypedFilterValue>

function onDummyEnter() {
  if (isConditionFilled(dummy.value)) {
    conditions.value.push(dummy.value)
    conditions.value = [...conditions.value]
    dummy.value = {
      type: dummy.value.type,
      value: ['', ''],
    }
  }
}

const calendarOpen = ref<[boolean, boolean]>([false, false])

function onDateInputChanged() {
  if (calendarOpen.value[0] || calendarOpen.value[1]) {
    return onDateInputEnter()
  }
}

async function onDateInputEnter() {
  if (((dummy.value.value[0] as CalendarDate | undefined)?.year || 0) < 1900) {
    return
  }
  if (
    doesConditionHave2ndValue(dummy.value) &&
    ((dummy.value.value[1] as CalendarDate | undefined)?.year || 0) < 1900
  ) {
    return
  }
  if (isConditionFilled(dummy.value)) {
    conditions.value.push(dummy.value)
    conditions.value = [...conditions.value]
    await nextTick()
    await nextTick()
    dummy.value = {
      type: dummy.value.type,
      value: [undefined as unknown as string, undefined as unknown as string],
    }
  }
}

function remove(item: TODataTypedFilterValue) {
  conditions.value = conditions.value.filter(c => c !== item)
}

function onDateShortcut(sc: (typeof dateRangeShortcuts)[number]) {
  if (calendarOpen.value[0] || calendarOpen.value[1]) {
    return
  }
  conditions.value = [
    {
      type: 'bw',
      value: [createCaledarDate(sc.dates[0]), createCaledarDate(sc.dates[1])],
    },
  ]
}
</script>
<template>
  <section class="">
    <div class="p-$card-spacing overflow-auto">
      <VuInput
        v-for="(c, index) of conditions"
        :key="index"
        design="filled"
        class="mb-[-1px]"
        :group-template="doesConditionHave2ndValue(c) ? '1fr 1fr 1fr' : '1fr 2fr'"
        icon-after="i--clear"
        @after-click="remove(c)"
      >
        <VuSelect
          group-item
          design="filled"
          :items="conditionTypesByType"
          v-model="c.type"
          popup-class="elevated border"
        />
        <template v-if="isDateType">
          <!-- prettier-ignore-attribute v-model -->
          <VuDatePickerBase
            group-item
            popup-class="z-200 border-0 elevated"
            locale="en-UK"
            design="filled"
            v-model="(c.value[0] as CalendarDate)"
            popup-rounded
          />
          <!-- prettier-ignore-attribute v-model -->
          <VuDatePickerBase
            v-if="doesConditionHave2ndValue(c)"
            group-item
            popup-class="z-200 border-0 elevated"
            locale="en-UK"
            design="filled"
            v-model="(c.value[1] as CalendarDate)"
            popup-rounded
          />
        </template>
        <template v-else>
          <!-- prettier-ignore-attribute v-model -->
          <VuInputBase
            v-if="c.type !== 'empty' && c.type !== 'notEmpty'"
            group-item
            design="filled"
            v-model="(c.value[0] as string)"
            :placeholder="doesConditionHave2ndValue(c) ? 'From' : 'Value'"
          />
          <!-- prettier-ignore-attribute v-model -->
          <VuInputBase
            v-if="doesConditionHave2ndValue(c)"
            group-item
            design="filled"
            v-model="(c.value[1] as string)"
            placeholder="To"
          />
        </template>
      </VuInput>

      <div class="pb-$s fw-$bold" :class="{ 'pt-$l': conditions.length > 0 }">Add Condition:</div>
      <VuInput
        design="filled"
        :group-template="doesConditionHave2ndValue(dummy) ? '1fr 1fr 1fr' : '1fr 2fr'"
        class="scope-grey"
      >
        <VuSelect
          group-item
          design="filled"
          :items="conditionTypesByType"
          v-model="dummy.type"
          popup-class="elevated border"
          @blur="onDummyEnter"
          @update:model-value="onDummyEnter"
        />
        <template v-if="isDateType">
          <!-- prettier-ignore-attribute v-model -->
          <VuDatePickerBase
            group-item
            popup-class="z-200 border-0 elevated"
            locale="en-UK"
            design="filled"
            v-model="(dummy.value[0] as CalendarDate)"
            popup-rounded
            v-model:open="calendarOpen[0]"
            @keydown-enter="onDateInputEnter"
            @update:modelValue="onDateInputChanged"
          />
          <!-- prettier-ignore-attribute v-model -->
          <VuDatePickerBase
            v-if="doesConditionHave2ndValue(dummy)"
            group-item
            popup-class="z-200 border-0 elevated"
            locale="en-UK"
            design="filled"
            v-model="(dummy.value[1] as CalendarDate)"
            popup-rounded
            v-model:open="calendarOpen[1]"
            @keydown-enter="onDateInputEnter"
            @update:modelValue="onDateInputChanged"
          />
        </template>
        <template v-else>
          <!-- prettier-ignore-attribute v-model -->
          <VuInputBase
            group-item
            design="filled"
            v-model="(dummy.value[0] as string)"
            :placeholder="doesConditionHave2ndValue(dummy) ? 'From' : 'Value'"
            @keydown.enter="onDummyEnter"
            @blur="onDummyEnter"
          />
          <!-- prettier-ignore-attribute v-model -->
          <VuInputBase
            v-if="doesConditionHave2ndValue(dummy)"
            group-item
            design="filled"
            v-model="(dummy.value[1] as string)"
            placeholder="To"
            @keydown.enter="onDummyEnter"
            @blur="onDummyEnter"
          />
        </template>

        <template v-slot:after>
          <div class="w-fingertip"></div>
        </template>
      </VuInput>
    </div>

    <div class="p-$card-spacing overflow-auto" v-if="isDateType">
      <div class="pb-$s fw-$bold">Date Ranges Shortcuts:</div>
      <div class="flex flex-col">
        <VuButton
          v-for="sc in dateRangeShortcuts"
          :key="sc.label"
          :label="sc.label"
          class="c8-flat justify-start"
          @click="onDateShortcut(sc)"
        />
      </div>
    </div>
  </section>
</template>
