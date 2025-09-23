<script setup lang="ts">
import { useODataEntitySetPI } from './ODataEntitySet.pi'
const injected = useODataEntitySetPI().inject()
</script>
<template>
  <slot v-bind="injected"></slot>
</template>
