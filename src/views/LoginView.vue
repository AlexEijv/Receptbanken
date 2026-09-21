<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '', twoFactorToken: '' })
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  try {
    await authStore.login(form.email, form.password, form.twoFactorToken || undefined)
    if (!authStore.twoFactorRequired) await router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Kunde inte logga in.'
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-panel">
      <p class="eyebrow">Välkommen tillbaka</p>
      <h1>Logga in.</h1>
      <p class="auth-intro">Fortsätt där du slutade och hitta nästa favorit.</p>
      <form @submit.prevent="submit">
        <label>E-post<input v-model="form.email" type="email" autocomplete="email" required /></label>
        <label>Lösenord<input v-model="form.password" type="password" autocomplete="current-password" required /></label>
        <label v-if="authStore.twoFactorRequired">Kod från Authenticator<input v-model="form.twoFactorToken" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required /></label>
        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <button class="button button--dark" type="submit" :disabled="authStore.isLoading">{{ authStore.twoFactorRequired ? 'Verifiera kod' : (authStore.isLoading ? 'Loggar in...' : 'Logga in') }} <span aria-hidden="true">→</span></button>
      </form>
      <p class="auth-switch"><RouterLink to="/glomt-losenord">Glömt lösenordet?</RouterLink></p><p class="auth-switch">Ny här? <RouterLink to="/registrera">Skapa konto</RouterLink></p>
    </div>
  </main>
</template>