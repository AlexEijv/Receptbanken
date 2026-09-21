<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RecipeCard from '../components/RecipeCard.vue'
import { fetchPublicProfile, type PublicProfile } from '../services/api'

const route = useRoute()
const profile = ref<PublicProfile | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try { profile.value = await fetchPublicProfile(String(route.params.id)) } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Kunde inte hämta profilen.' } finally { isLoading.value = false }
})
</script>

<template>
  <main class="public-profile-page">
    <p v-if="isLoading" class="state-message">Hämtar profil...</p>
    <p v-else-if="errorMessage" class="state-message state-message--error">{{ errorMessage }}</p>
    <template v-else-if="profile">
      <header class="public-profile-heading">
        <div class="public-avatar"><img v-if="profile.user.profileImage" :src="profile.user.profileImage" :alt="`Profilbild för ${profile.user.username}`" /><span v-else>{{ profile.user.username.charAt(0).toUpperCase() }}</span></div>
        <div>
          <p class="eyebrow">Receptbankens medlem <span :class="profile.user.isOnline ? 'text-green-700' : 'text-[#718078]'"><span class="ml-2 inline-block h-2 w-2 rounded-full bg-current"></span>{{ profile.user.isOnline ? 'Online' : 'Offline' }}</span></p>
          <h1>{{ profile.user.username }}</h1>
          <p>{{ profile.user.bio || 'Den här medlemmen har inte skrivit någon biografi ännu.' }}</p>
          <div class="mt-5 flex gap-5 text-sm text-[#718078]"><span><strong class="text-[#26352f]">{{ profile.recipeCount }}</strong> recept</span><span><strong class="text-[#26352f]">{{ profile.reviewCount }}</strong> recensioner</span></div>
        </div>
      </header>
      <section><p class="eyebrow">Från profilen</p><h2 class="mb-6 font-serif text-4xl text-[#26352f]">Recept av {{ profile.user.username }}</h2><p v-if="!profile.recipes.length" class="empty-inline">Inga publicerade recept ännu.</p><div v-else class="recipe-grid"><RecipeCard v-for="recipe in profile.recipes" :key="recipe._id" :recipe="recipe" /></div></section>
    </template>
  </main>
</template>
