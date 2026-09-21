<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { createRecipe, fetchCategories, type Category, uploadImages } from '../services/api'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const categories = ref<Category[]>([])
const isLoadingCategories = ref(true)
const errorMessage = ref('')
const selectedImages = ref<File[]>([])
const form = reactive({
  title: '', description: '', image: '', images: '', prepTime: 10, cookTime: 20, servings: 4,
  difficulty: 'easy' as 'easy' | 'medium' | 'hard', categoryId: '', tags: '',
  ingredients: [{ amount: '', name: '' }], instructions: [{ step: 1, text: '' }],
})

onMounted(async () => {
  try {
    categories.value = await fetchCategories()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte hämta kategorier.'
  } finally {
    isLoadingCategories.value = false
  }
})

function addIngredient() { form.ingredients.push({ amount: '', name: '' }) }
function removeIngredient(index: number) { if (form.ingredients.length > 1) form.ingredients.splice(index, 1) }
function addInstruction() { form.instructions.push({ step: form.instructions.length + 1, text: '' }) }
function removeInstruction(index: number) { if (form.instructions.length > 1) form.instructions.splice(index, 1) }

async function submit() {
  errorMessage.value = ''
  try {
    const uploadedImages = selectedImages.value.length ? await uploadImages(selectedImages.value) : []
    const recipe = await createRecipe({
      ...form,
      image: form.image || undefined,
      images: [...uploadedImages, ...form.images.split(',').map((url) => url.trim()).filter(Boolean)].slice(0, 10),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    })
    await router.push(`/recept/${recipe._id}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte skapa receptet.'
  }
}

function selectImages(event: Event) {
  const input = event.target as HTMLInputElement
  selectedImages.value = Array.from(input.files ?? []).slice(0, 10)
}
</script>

<template>
  <main class="form-page">
    <header class="page-heading"><div><p class="eyebrow">Dela din matglädje</p><h1>Skapa recept</h1></div><p>Gör det enkelt för andra att laga något riktigt gott.</p></header>
    <form class="recipe-form" @submit.prevent="submit">
      <section class="form-section form-section--wide">
        <h2>Grunden</h2>
        <label>Rubrik<input v-model="form.title" required maxlength="120" placeholder="Till exempel: Krämig tomatpasta" /></label>
        <label>Beskrivning<textarea v-model="form.description" required maxlength="1000" rows="4" placeholder="Vad gör receptet speciellt?"></textarea></label>
        <label>Bild-URL<input v-model="form.image" type="url" placeholder="https://..." /></label>
        <label>Ladda upp från datorn <small>JPG, PNG eller WebP, max 5 MB per bild</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="selectImages" /></label>
        <label>Ladda upp från datorn <small>JPG, PNG eller WebP, max 5 MB per bild</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="selectImages" /></label>
      </section>
      <section class="form-section">
        <h2>Detaljer</h2>
        <div class="form-grid">
          <label>Förberedelsetid<input v-model.number="form.prepTime" type="number" min="0" required /></label>
          <label>Tillagningstid<input v-model.number="form.cookTime" type="number" min="0" required /></label>
          <label>Portioner<input v-model.number="form.servings" type="number" min="1" required /></label>
          <label>Svårighetsgrad<select v-model="form.difficulty"><option value="easy">Enkel</option><option value="medium">Medel</option><option value="hard">Avancerad</option></select></label>
        </div>
        <label>Kategori<select v-model="form.categoryId" required :disabled="isLoadingCategories"><option value="">Välj kategori</option><option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option></select></label>
        <label>Taggar <small>Separera med kommatecken</small><input v-model="form.tags" placeholder="vardag, snabbt, vegetariskt" /></label>
      </section>
      <section class="form-section">
        <div class="section-title"><h2>Ingredienser</h2><button type="button" class="add-button" @click="addIngredient">+ Lägg till</button></div>
        <div v-for="(ingredient, index) in form.ingredients" :key="index" class="repeat-row"><input v-model="ingredient.amount" required placeholder="Mängd" /><input v-model="ingredient.name" required placeholder="Ingrediens" /><button type="button" class="remove-button" aria-label="Ta bort ingrediens" @click="removeIngredient(index)">×</button></div>
      </section>
      <section class="form-section">
        <div class="section-title"><h2>Gör så här</h2><button type="button" class="add-button" @click="addInstruction">+ Lägg till steg</button></div>
        <div v-for="(instruction, index) in form.instructions" :key="index" class="repeat-row repeat-row--instruction"><span>{{ index + 1 }}</span><textarea v-model="instruction.text" required rows="2" placeholder="Beskriv steget..."></textarea><button type="button" class="remove-button" aria-label="Ta bort steg" @click="removeInstruction(index)">×</button></div>
      </section>
      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
      <div class="form-actions"><RouterLink class="back-link" to="/recept">Avbryt</RouterLink><button class="button button--dark" type="submit" :disabled="authStore.isLoading">Publicera recept <span aria-hidden="true">→</span></button></div>
    </form>
  </main>
</template>