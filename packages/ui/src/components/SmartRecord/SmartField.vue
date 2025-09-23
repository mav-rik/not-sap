<script setup lang="ts">
import SmartFieldLabel from './SmartFieldLabel.vue'
import SmartFieldValue from './SmartFieldValue.vue'

defineProps<{
  name: string
  value: string | number | Date | boolean | undefined
  row?: Record<string, unknown>
  label?: string
}>()
</script>

<template>
  <SmartFieldLabel v-if="!label" :name v-slot="{ label }">
    <SmartFieldValue :name :value :row v-slot="slotProps">
      <slot v-bind="slotProps" :label></slot>
    </SmartFieldValue>
  </SmartFieldLabel>
  <SmartFieldValue v-else :name :value :row v-slot="slotProps">
    <slot v-bind="slotProps" :label></slot>
  </SmartFieldValue>
</template>
