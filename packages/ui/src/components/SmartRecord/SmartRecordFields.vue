<script setup lang="ts" generic="T extends Record<string, unknown>">
import { isSmartTableInDevMode } from '../SmartTable/dev-mode.composable'
import SmartField from './SmartField.vue'

defineProps<{
  record: T
  fields: { name: keyof T; label?: string }[]
}>()
</script>

<template>
  <div class="not-sap-record-fields">
    <!-- prettier-ignore-attribute :name :value -->
    <SmartField
      v-for="f in fields"
      :key="f.name"
      :name="(f.name as string)"
      :value="(record[f.name] as string)"
      :row="record"
      v-slot="{
        value,
        label,
        units,
        isMonetary,
        currency,
        date,
        field,
        rawValue,
        unitField,
        description,
      }"
    >
      <slot :name="`label-${f.name as string}`" v-bind="{ label }">
        <div class="not-sap-record-label">
          {{ isSmartTableInDevMode ? label : f.label || label }}:
        </div>
      </slot>
      <slot
        :name="`value-${f.name as string}`"
        v-bind="{
          value,
          units,
          isMonetary,
          currency,
          date,
          field,
          rawValue,
          unitField,
          record,
          description,
        }"
      >
        <div :class="{ 'not-sap-cell-numeric text-primary': isMonetary }">
          {{ units }}
          {{ value }}
          <span v-if="description" class="not-sap-field-value-description"
            >- {{ description }}</span
          >
        </div>
      </slot>
    </SmartField>
  </div>
</template>
