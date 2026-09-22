<template>
	<div class="site-shell">
		<ToastMessage />
		<header class="site-header">
			<RouterLink class="brand" to="/"><span class="brand-mark" aria-hidden="true">▤</span> Receptbanken</RouterLink>
			<nav aria-label="Huvudnavigation">
				<RouterLink to="/recept">Recept</RouterLink>
				<RouterLink to="/om-oss">Om oss</RouterLink>
				<RouterLink to="/kontakt">Kontakt</RouterLink>
			</nav>
			<details v-if="authStore.user" class="header-user-menu">
				<summary class="header-profile"><span>{{ authStore.user.username }}</span><span class="profile-dot"><img v-if="authStore.user.profileImage" :src="authStore.user.profileImage" :alt="`Profilbild för ${authStore.user.username}`" /><span v-else>{{ authStore.user.username.charAt(0).toUpperCase() }}</span></span></summary>
				<div class="profile-dropdown">
					<div class="profile-dropdown__greeting"><span class="profile-dot"><img v-if="authStore.user.profileImage" :src="authStore.user.profileImage" :alt="`Profilbild för ${authStore.user.username}`" /><span v-else>{{ authStore.user.username.charAt(0).toUpperCase() }}</span></span><strong>Hej, {{ authStore.user.username }}</strong></div>
					<RouterLink to="/dashboard">Dashboard</RouterLink>
					<RouterLink to="/favoriter">Favoriter</RouterLink>
					<RouterLink v-if="authStore.user.role === 'admin'" to="/admin">Admin</RouterLink>
					<button class="profile-dropdown__logout" type="button" @click="signOut">Logga ut</button>
				</div>
			</details>
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
