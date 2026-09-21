<script setup lang="ts">
import type { Recipe } from '../types/recipe'

defineProps<{ recipe: Recipe }>()

const difficultyLabels = { easy: 'Enkel', medium: 'Medel', hard: 'Avancerad' }
</script>

<template>
  <article class="group overflow-hidden border border-[#26352f]/15 bg-[#fffdf8] transition hover:-translate-y-1 hover:border-[#c16e4b]/60">
    <div class="min-h-48 bg-gradient-to-br from-[#c7d7c2] to-[#aabca9] bg-cover bg-center" :style="(recipe.images?.[0] || recipe.image) ? { backgroundImage: `url(${recipe.images?.[0] || recipe.image})` } : undefined">
      <span class="m-4 inline-block bg-[#fffdf8]/90 px-2 py-1 text-xs font-bold text-[#26352f]">{{ difficultyLabels[recipe.difficulty] }}</span>
    </div>
    <div class="p-5">
      <p class="mb-3 text-xs font-bold uppercase tracking-[.08em] text-[#c16e4b]">{{ recipe.cookTime + recipe.prepTime }} min · {{ recipe.servings }} portioner</p>
      <h3 class="mb-2 font-serif text-3xl leading-none text-[#26352f]">{{ recipe.title }}</h3>
      <p class="mb-3 min-h-12 text-sm leading-6 text-[#718078]">{{ recipe.description }}</p>
      <p class="mb-4 text-sm font-bold text-[#c16e4b]" aria-label="Betyg och antal recensioner"><span>{{ recipe.averageRating ? `${recipe.averageRating.toFixed(1)} ★` : 'Inget betyg' }}</span><small class="ml-2 font-normal text-[#718078]">({{ recipe.reviewCount ?? 0 }} recensioner)</small></p>
      <RouterLink :to="`/recept/${recipe._id}`" class="font-bold text-[#26352f]">Visa recept <span class="ml-2 text-[#c16e4b]" aria-hidden="true">→</span></RouterLink>
    </div>
  </article>
</template>