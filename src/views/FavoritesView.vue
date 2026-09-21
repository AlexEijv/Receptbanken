<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import RecipeCard from '../components/RecipeCard.vue'
import { fetchFavorites } from '../services/api'
import { useAuthStore } from '../stores/auth.store'
import type { Recipe } from '../types/recipe'

const router = useRouter()
const authStore = useAuthStore()
const recipes = ref<Recipe[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  if (!authStore.user) return
  try {
    const favorites = await fetchFavorites(authStore.user.id)
    recipes.value = favorites.map((favorite) => favorite.recipeId)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte hämta favoriter.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="catalog-page">
    <header class="page-heading"><div><p class="eyebrow">Din samling</p><h1>Favoriter</h1></div><p>Recept du vill hitta tillbaka till.</p></header>
    <p v-if="isLoading" class="state-message">Hämtar dina favoriter...</p>
    <p v-else-if="errorMessage" class="state-message state-message--error">{{ errorMessage }}</p>
    <div v-else-if="recipes.length === 0" class="empty-panel"><h2>Här blir fint.</h2><p>Du har inte sparat några recept ännu. Börja med att utforska katalogen.</p><button class="button button--dark" type="button" @click="router.push('/recept')">Utforska recept <span aria-hidden="true">→</span></button></div>
    <section v-else class="recipe-grid"><RecipeCard v-for="recipe in recipes" :key="recipe._id" :recipe="recipe" /></section>
  </main>
</template>