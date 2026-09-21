<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '../services/api'
const route = useRoute(); const router = useRouter(); const form = reactive({ password: '', confirm: '' }); const errorMessage = ref(''); const done = ref(false)
async function submit() { if (form.password !== form.confirm) { errorMessage.value = 'Lösenorden matchar inte.'; return }; try { await resetPassword(String(route.query.token ?? ''), form.password); done.value = true; setTimeout(() => router.push('/logga-in'), 1200) } catch (error) { errorMessage.value = error instanceof Error ? error.message : 'Kunde inte återställa lösenordet.' } }
</script>
<template><main class="auth-page"><div class="auth-panel"><p class="eyebrow">Nytt lösenord</p><h1>Återställ.</h1><form @submit.prevent="submit"><label>Nytt lösenord<input v-model="form.password" type="password" minlength="12" required /></label><label>Upprepa lösenord<input v-model="form.confirm" type="password" minlength="12" required /></label><p v-if="errorMessage" class="form-error">{{ errorMessage }}</p><p v-if="done" class="form-success">Lösenordet är ändrat. Du skickas till login.</p><button class="button button--dark" type="submit">Spara nytt lösenord <span aria-hidden="true">→</span></button></form></div></main></template>