<script setup lang="ts">
import { useODataEntitySetPI } from '@/_not-sap-ui/renderless/ODataEntitySet.pi'
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
