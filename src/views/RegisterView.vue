<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ username: '', email: '', password: '' })
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  try {
    await authStore.register(form.username, form.email, form.password)
    await router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte skapa kontot.'
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-panel">
      <p class="eyebrow">Din egen receptsamling</p>
      <h1>Skapa konto.</h1>
      <p class="auth-intro">Spara favoriter och samla dina bästa recept på ett ställe.</p>
      <form @submit.prevent="submit">
        <label>Användarnamn<input v-model="form.username" minlength="3" maxlength="40" autocomplete="username" required /></label>
        <label>E-post<input v-model="form.email" type="email" autocomplete="email" required /></label>
        <label>Lösenord<input v-model="form.password" type="password" minlength="12" autocomplete="new-password" required /><small>Minst 12 tecken.</small></label>
        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <button class="button button--dark" type="submit" :disabled="authStore.isLoading">{{ authStore.isLoading ? 'Skapar konto...' : 'Skapa konto' }} <span aria-hidden="true">→</span></button>
      </form>
      <p class="auth-switch">Har du redan konto? <RouterLink to="/logga-in">Logga in</RouterLink></p>
    </div>
  </main>
</template>