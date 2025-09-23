import { ref } from 'vue'
export const isSmartTableInDevMode = ref(false)

window.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.altKey && event.shiftKey && event.code === 'KeyP') {
    isSmartTableInDevMode.value = !isSmartTableInDevMode.value
  }
})
