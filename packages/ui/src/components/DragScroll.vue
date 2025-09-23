<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
const isDown = ref(false)
const container = ref<HTMLDivElement>()
let startX: number
let scrollLeft: number

function onMouseDown(event: MouseEvent | TouchEvent) {
  if (!container.value) return
  isDown.value = true
  const pageX = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX
  startX = pageX - container.value.offsetLeft
  scrollLeft = container.value.scrollLeft
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', onMouseMove)
  window.addEventListener('touchend', onMouseUp)
  event.stopPropagation()
  // @ts-expect-error
  if (event.target?.role === 'button' || event.target?.parentElement?.role === 'button') {
    return
  }
  event.preventDefault()
}

function onMouseMove(event: MouseEvent | TouchEvent) {
  if (!container.value) return
  if (!isDown.value) return
  event.preventDefault()
  const pageX = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX
  const x = pageX - container.value.offsetLeft
  const walk = (x - startX) * 1
  container.value.scrollLeft = scrollLeft - walk
  event.stopPropagation()
  event.preventDefault()
}

function onMouseUp() {
  isDown.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

function onMutation(mutationsList: MutationRecord[]) {
  for (let mutation of mutationsList) {
    if (container.value && mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      container.value.scrollLeft = container.value.scrollWidth
    }
  }
}

onMounted(async () => {
  if (container.value) {
    const observer = new MutationObserver(onMutation)
    observer.observe(container.value, {
      childList: true,
      subtree: false,
    })
    await nextTick()
    container.value.scrollLeft = container.value.scrollWidth
  }
})
</script>

<template>
  <div
    ref="container"
    @mousedown="onMouseDown"
    @touchstart="onMouseDown"
    :class="{ 'cursor-grabbing': isDown }"
    data-drag-scroll="true"
  >
    <slot></slot>
  </div>
</template>
