<script setup lang="ts">
import { useToastStore } from '../stores/toast.store'
const toast = useToastStore()
</script>
<template><Transition name="toast"><div v-if="toast.message" class="fixed right-5 top-5 z-50 max-w-sm rounded-xl px-5 py-4 text-sm font-bold shadow-xl" :class="toast.type === 'error' ? 'bg-[#a64d3c] text-white' : 'bg-[#26352f] text-[#f4f0e8]'" role="status">{{ toast.message }}</div></Transition></template>