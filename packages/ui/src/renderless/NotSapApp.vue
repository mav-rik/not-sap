<script setup lang="ts">
const props = defineProps<{ namespace: string }>()
const appNamespace = computed(() => props.namespace)
provide('__not_sap_app_namespace__', appNamespace)
</script>

<template>
  <slot></slot>
</template>
