<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { fetchRecipe, updateRecipe, uploadImages } from '../services/api'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const selectedImages = ref<File[]>([])
const form = reactive({
  title: '', description: '', image: '', images: '', prepTime: 0, cookTime: 0, servings: 1,
  difficulty: 'easy' as 'easy' | 'medium' | 'hard', categoryId: '', tags: '',
  ingredients: [{ amount: '', name: '' }], instructions: [{ step: 1, text: '' }],
})

onMounted(async () => {
  try {
    const recipe = await fetchRecipe(String(route.params.id))
    Object.assign(form, {
      ...recipe,
      images: (recipe.images ?? []).join(', '),
      tags: recipe.tags.join(', '),
      ingredients: recipe.ingredients.map((item) => ({ ...item })),
      instructions: recipe.instructions.map((item) => ({ ...item })),
      categoryId: typeof recipe.categoryId === 'string' ? recipe.categoryId : recipe.categoryId?._id ?? '',
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte hämta receptet.'
  } finally {
    isLoading.value = false
  }
})

function selectImages(event: Event) {
  const input = event.target as HTMLInputElement
  selectedImages.value = Array.from(input.files ?? []).slice(0, 10)
}

async function submit() {
  isSaving.value = true
  errorMessage.value = ''
  try {
    const uploadedImages = selectedImages.value.length ? await uploadImages(selectedImages.value) : []
    const recipe = await updateRecipe(String(route.params.id), {
      ...form,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      images: [...uploadedImages, ...form.images.split(',').map((url) => url.trim()).filter(Boolean)].slice(0, 10),
      image: form.image || undefined,
    })
    await router.push(`/recept/${recipe._id}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte spara receptet.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-16 lg:px-12">
    <p v-if="isLoading" class="py-20 text-center text-[#718078]">Hämtar recept...</p>
    <template v-else>
      <header class="mb-10 flex items-end justify-between gap-8">
        <div><p class="text-xs font-bold uppercase tracking-[.18em] text-[#6f8067]">Ditt recept</p><h1 class="mt-3 font-serif text-6xl leading-none tracking-tight text-[#26352f]">Redigera</h1></div>
        <p class="max-w-xs text-sm leading-6 text-[#718078]">Uppdatera receptet och spara ändringarna.</p>
      </header>
      <form class="grid gap-4" @submit.prevent="submit">
        <section class="grid gap-5 border border-[#26352f]/15 bg-[#fffdf8] p-6 md:p-8">
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Rubrik<input v-model="form.title" required class="border border-[#26352f]/20 bg-transparent p-3 font-normal outline-none focus:border-[#c16e4b]" /></label>
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Beskrivning<textarea v-model="form.description" required rows="4" class="border border-[#26352f]/20 bg-transparent p-3 font-normal outline-none focus:border-[#c16e4b]"></textarea></label>
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Bild-URL<input v-model="form.image" type="url" class="border border-[#26352f]/20 bg-transparent p-3 font-normal outline-none focus:border-[#c16e4b]" /></label>
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Ladda upp bilder <small class="font-normal text-[#718078]">JPG, PNG eller WebP, max 5 MB per bild</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple @change="selectImages" class="block w-full border border-dashed border-[#26352f]/25 p-3 text-sm font-normal" /></label>
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Fler bild-URL:er <small class="font-normal text-[#718078]">Separera URL:er med kommatecken</small><textarea v-model="form.images" rows="2" class="border border-[#26352f]/20 bg-transparent p-3 font-normal outline-none focus:border-[#c16e4b]"></textarea></label>
        </section>
        <section class="grid gap-5 border border-[#26352f]/15 bg-[#fffdf8] p-6 md:p-8">
          <div class="grid gap-4 md:grid-cols-4"><label class="grid gap-2 text-sm font-bold text-[#26352f]">Förberedelsetid<input v-model.number="form.prepTime" type="number" min="0" required class="border border-[#26352f]/20 bg-transparent p-3 font-normal" /></label><label class="grid gap-2 text-sm font-bold text-[#26352f]">Tillagningstid<input v-model.number="form.cookTime" type="number" min="0" required class="border border-[#26352f]/20 bg-transparent p-3 font-normal" /></label><label class="grid gap-2 text-sm font-bold text-[#26352f]">Portioner<input v-model.number="form.servings" type="number" min="1" required class="border border-[#26352f]/20 bg-transparent p-3 font-normal" /></label><label class="grid gap-2 text-sm font-bold text-[#26352f]">Svårighetsgrad<select v-model="form.difficulty" class="border border-[#26352f]/20 bg-transparent p-3 font-normal"><option value="easy">Enkel</option><option value="medium">Medel</option><option value="hard">Avancerad</option></select></label></div>
          <label class="grid gap-2 text-sm font-bold text-[#26352f]">Taggar<input v-model="form.tags" class="border border-[#26352f]/20 bg-transparent p-3 font-normal" /></label>
        </section>
        <section class="grid gap-4 border border-[#26352f]/15 bg-[#fffdf8] p-6 md:p-8"><h2 class="font-serif text-3xl text-[#26352f]">Ingredienser och instruktioner</h2><div v-for="ingredient in form.ingredients" :key="ingredient.name + ingredient.amount" class="grid gap-2 md:grid-cols-[.7fr_1.8fr]"><input v-model="ingredient.amount" required placeholder="Mängd" class="border border-[#26352f]/20 bg-transparent p-3" /><input v-model="ingredient.name" required placeholder="Ingrediens" class="border border-[#26352f]/20 bg-transparent p-3" /></div><div v-for="instruction in form.instructions" :key="instruction.step" class="grid gap-3 md:grid-cols-[2rem_1fr]"><span class="grid h-7 w-7 place-items-center rounded-full bg-[#c16e4b] text-sm font-bold text-[#f4f0e8]">{{ instruction.step }}</span><textarea v-model="instruction.text" required rows="2" class="border border-[#26352f]/20 bg-transparent p-3" /></div></section>
        <p v-if="errorMessage" class="text-sm text-[#a64d3c]" role="alert">{{ errorMessage }}</p>
        <div class="flex items-center justify-end gap-5"><RouterLink class="text-sm font-bold text-[#718078]" :to="`/recept/${route.params.id}`">Avbryt</RouterLink><button class="rounded-full bg-[#26352f] px-5 py-3 font-bold text-[#f4f0e8] disabled:opacity-50" type="submit" :disabled="isSaving">{{ isSaving ? 'Sparar...' : 'Spara ändringar' }} <span aria-hidden="true">→</span></button></div>
      </form>
    </template>
  </main>
</template>
