<template>
	<div class="site-shell">
		<ToastMessage />
		<header class="site-header">
			<RouterLink class="brand" to="/"><span class="brand-mark">R</span> receptbanken</RouterLink>
			<nav aria-label="Huvudnavigation">
				<RouterLink to="/recept">Recept</RouterLink>
				<RouterLink v-if="authStore.user" to="/favoriter">Favoriter</RouterLink>
				<RouterLink v-if="authStore.user" to="/dashboard">Dashboard</RouterLink>
				<RouterLink v-if="authStore.user" to="/profil">Profil</RouterLink>
				<RouterLink v-if="authStore.user?.role === 'admin'" to="/admin">Admin</RouterLink>
				<RouterLink to="/om-oss">Om oss</RouterLink>
				<RouterLink to="/kontakt">Kontakt</RouterLink>
			</nav>
			<RouterLink v-if="!authStore.user" class="header-action" to="/logga-in">Logga in <span aria-hidden="true">↗</span></RouterLink>
			<button v-else type="button" class="header-action" @click="signOut">Logga ut <span aria-hidden="true">↗</span></button>
		</header>
		<RouterView />
		<footer class="site-footer"><span>receptbanken</span><span>Mat som känns hemma.</span></footer>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuthStore } from './stores/auth.store'
import ToastMessage from './components/ToastMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

async function signOut() {
	await authStore.logout()
	await router.push('/')
}
</script>
