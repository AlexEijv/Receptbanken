import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref<'success' | 'error'>('success')
  let timer: number | undefined
  function show(nextMessage: string, nextType: 'success' | 'error' = 'success') { message.value = nextMessage; type.value = nextType; window.clearTimeout(timer); timer = window.setTimeout(() => { message.value = '' }, 3500) }
  return { message, type, show }
})