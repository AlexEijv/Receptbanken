<script setup lang="ts">
import { computed, onMounted } from 'vue'

import RecipeCard from '../components/RecipeCard.vue'
import { useRecipeStore } from '../stores/recipe.store'

const recipeStore = useRecipeStore()
const latestRecipes = computed(() => recipeStore.result.items.slice(0, 3))

onMounted(() => recipeStore.loadRecipes({ sort: 'newest', limit: 3 }))
</script>

<template>
  <main>
    <section class="hero-section">
      <div>
        <p class="eyebrow">Receptbanken</p>
        <h1>Mat som känns hemma.</h1>
        <p class="hero-copy">Upptäck vardagsfavoriter, nya smaker och recept värda att dela vidare.</p>
        <RouterLink class="button button--dark" to="/recept">Utforska recept <span aria-hidden="true">→</span></RouterLink>
      </div>
      <div class="hero-stamp" aria-label="Laga något gott idag">
        <span>laga</span>
        <strong>något<br />gott</strong>
        <span>idag</span>
      </div>
    </section>
    <section class="home-band">
      <p class="eyebrow">En plats för smak</p>
      <h2>Recept för riktiga dagar.</h2>
      <p>Från snabba middagar till långsamma helger. Sök, spara och bygg din egen samling.</p>
    </section>
    <section class="home-section home-intro">
      <div>
        <p class="eyebrow">Gör matlagningen enklare</p>
        <h2>Allt du vill laga, på ett ställe.</h2>
      </div>
      <p class="section-copy">Hitta inspiration när tiden är knapp, spara dina favoriter och dela recepten som alltid går hem. Receptbanken är gjord för att användas – om och om igen.</p>
    </section>

    <section class="home-section home-categories" aria-labelledby="categories-title">
      <div class="section-heading">
        <div><p class="eyebrow">Börja här</p><h2 id="categories-title">Vad är du sugen på?</h2></div>
        <RouterLink class="subtle-link" to="/recept">Alla recept →</RouterLink>
      </div>
      <div class="category-grid">
        <RouterLink class="category-card category-card--quick" to="/recept"><span>Under 30 min</span><strong>Snabbt &amp; enkelt</strong><i aria-hidden="true">→</i></RouterLink>
        <RouterLink class="category-card category-card--weekend" to="/recept"><span>När det får ta tid</span><strong>Helgens favoriter</strong><i aria-hidden="true">→</i></RouterLink>
        <RouterLink class="category-card category-card--share" to="/recept"><span>För fler runt bordet</span><strong>Att dela med andra</strong><i aria-hidden="true">→</i></RouterLink>
      </div>
    </section>

    <section class="home-section home-latest" aria-labelledby="latest-title">
      <div class="section-heading">
        <div><p class="eyebrow">Nytt i receptbanken</p><h2 id="latest-title">Nyligen tillagt.</h2></div>
        <RouterLink class="subtle-link" to="/recept">Se hela katalogen →</RouterLink>
      </div>
      <p v-if="recipeStore.isLoading" class="state-message">Hämtar recept...</p>
      <p v-else-if="recipeStore.errorMessage" class="state-message state-message--error">Kunde inte hämta recepten just nu.</p>
      <div v-else-if="latestRecipes.length" class="recipe-grid"><RecipeCard v-for="recipe in latestRecipes" :key="recipe._id" :recipe="recipe" /></div>
      <div v-else class="home-empty"><p>De första recepten är på väg in.</p><RouterLink class="button button--dark" to="/skapa-recept">Dela ett recept <span aria-hidden="true">→</span></RouterLink></div>
    </section>

    <section class="home-callout">
      <div><p class="eyebrow">Din egen samling</p><h2>Spara det som blir en favorit.</h2><p>Med ett konto kan du samla recept, skapa egna och alltid ha nästa middag nära till hands.</p></div>
      <RouterLink class="button button--light" to="/registrera">Kom igång gratis <span aria-hidden="true">→</span></RouterLink>
    </section>
  </main>
</template>
