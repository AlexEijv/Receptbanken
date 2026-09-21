<script setup lang="ts">
import { reactive, ref } from 'vue'
import { requestPasswordReset } from '../services/api'
const form = reactive({ email: '' }); const sent = ref(false); const errorMessage = ref('')
async function submit() { try { await requestPasswordReset(form.email); sent.value = true } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Något gick fel.' } }
</script>
<template><main class="auth-page"><div class="auth-panel"><p class="eyebrow">Återställ åtkomst</p><h1>Glömt lösenordet?</h1><p class="auth-intro">Ange din e-post så får du instruktioner för att skapa ett nytt lösenord.</p><form v-if="!sent" @submit.prevent="submit"><label>E-post<input v-model="form.email" type="email" required /></label><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><button class="button button--dark" type="submit">Skicka instruktioner <span aria-hidden="true">→</span></button></form><p v-else class="form-success">Om kontot finns har instruktioner skickats. Kontrollera även skräpposten.</p><p class="auth-switch"><RouterLink to="/logga-in">Tillbaka till login</RouterLink></p></div></main></template>