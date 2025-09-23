<script setup lang="ts">
const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="not-sap-token">
    <slot> </slot>
    <VuIcon
      name="i--clear"
      class="not-sap-token-remove"
      @click.stop="emit('remove')"
      role="button"
    />
  </div>
</template>
