<script setup lang="ts">
import { computed } from 'vue'
import { useODataEntitySetPI } from '../../pi';
import { isSmartTableInDevMode } from '../SmartTable/dev-mode.composable'

const props = defineProps<{
  name: string
}>()

const { fieldsMap } = useODataEntitySetPI().inject()

const _field = computed(() => fieldsMap.value.get(props.name))
</script>

<template>
  <slot :label="isSmartTableInDevMode ? _field?.$Name : _field?.$label"></slot>
</template>
