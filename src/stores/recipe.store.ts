import { defineStore } from 'pinia'
import { ref } from 'vue'

import { fetchRecipes, type RecipeListResponse } from '../services/api'
import type { RecipeQuery } from '../types/recipe'

export const useRecipeStore = defineStore('recipes', () => {
  const result = ref<RecipeListResponse>({ items: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } })
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function loadRecipes(query: RecipeQuery = {}) {
    isLoading.value = true
    errorMessage.value = ''
    try {
      result.value = await fetchRecipes(query)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Något gick fel. Försök igen.'
    } finally {
      isLoading.value = false
    }
  }

  return { result, isLoading, errorMessage, loadRecipes }
})