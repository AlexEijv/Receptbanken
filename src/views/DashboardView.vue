<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import RecipeCard from '../components/RecipeCard.vue'
import { fetchDashboard, type DashboardData } from '../services/api'

const dashboard = ref<DashboardData | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const validFavorites = computed(() => dashboard.value?.recentFavorites.filter((favorite) => favorite.recipeId) ?? [])

onMounted(async () => {
  await loadDashboard()
})

async function loadDashboard() {
  isLoading.value = true
  errorMessage.value = ''
  try { dashboard.value = await fetchDashboard() } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Kunde inte hämta dashboarden.' } finally { isLoading.value = false }
}
</script>

<template>
  <main class="dashboard-page">
    <p v-if="isLoading" class="state-message">Hämtar din dashboard...</p>
    <div v-else-if="errorMessage" class="mx-auto max-w-lg py-20 text-center"><p class="text-[#a64d3c]">{{ errorMessage }}</p><button class="mt-5 rounded-full border border-[#26352f]/20 px-5 py-3 text-sm font-bold" type="button" @click="loadDashboard">Försök igen</button></div>
    <template v-else-if="dashboard">
      <header class="dashboard-heading"><div><p class="eyebrow">Din receptbank</p><h1>Hej, {{ dashboard.user.username }}.</h1><p>Här är din senaste matglädje.</p></div><RouterLink class="button button--dark" to="/skapa-recept">Skapa recept <span aria-hidden="true">→</span></RouterLink></header>
      <section class="mb-10 flex flex-wrap items-center justify-between gap-5 border border-[#26352f]/15 bg-[#fffdf8] p-5 md:p-7"><div class="flex items-center gap-4"><div class="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-[#c16e4b] font-serif text-2xl text-[#f4f0e8]"><img v-if="dashboard.user.profileImage" :src="dashboard.user.profileImage" :alt="`Profilbild för ${dashboard.user.username}`" class="h-full w-full object-cover" /><span v-else>{{ dashboard.user.username.charAt(0).toUpperCase() }}</span></div><div><p class="text-xs font-bold uppercase tracking-[.14em] text-[#6f8067]">Ditt profilkort</p><h2 class="font-serif text-2xl text-[#26352f]">{{ dashboard.user.username }}</h2><p class="text-sm text-[#718078]">{{ dashboard.user.email }}</p></div></div><RouterLink class="rounded-full border border-[#26352f]/20 px-4 py-2 text-sm font-bold text-[#26352f]" to="/profil">Öppna din profil →</RouterLink></section>
      <section class="stat-grid" aria-label="Översikt">
        <div class="stat-card"><span>Egna recept</span><strong>{{ dashboard.stats.recipeCount }}</strong><small>recept publicerade</small></div>
        <div class="stat-card"><span>Favoriter</span><strong>{{ dashboard.stats.favoriteCount }}</strong><small>sparade recept</small></div>
        <div class="stat-card stat-card--sage"><span>Medlem sedan</span><strong>{{ new Date(dashboard.user.createdAt).toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' }) }}</strong><small>fortsätt samla</small></div>
      </section>
      <section class="dashboard-section"><div class="section-title"><div><p class="eyebrow">Ditt skapande</p><h2>Senaste recept</h2></div><RouterLink to="/skapa-recept" class="subtle-link">Nytt recept →</RouterLink></div><p v-if="!dashboard.recentRecipes.length" class="empty-inline">Du har inte skapat något recept ännu.</p><div v-else class="recipe-grid"><RecipeCard v-for="recipe in dashboard.recentRecipes" :key="recipe._id" :recipe="recipe" /></div></section>
      <section class="dashboard-section dashboard-section--favorites"><div class="section-title"><div><p class="eyebrow">Din samling</p><h2>Senaste favoriter</h2></div><RouterLink to="/favoriter" class="subtle-link">Visa alla →</RouterLink></div><p v-if="!validFavorites.length" class="empty-inline">Spara ett recept så hittar du det här.</p><div v-else class="recipe-grid"><RecipeCard v-for="favorite in validFavorites" :key="favorite.recipeId._id" :recipe="favorite.recipeId" /></div></section>
    </template>
  </main>
</template>