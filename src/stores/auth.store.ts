import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getCurrentUser, loginUser, logoutUser, registerUser, type AuthUser } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const initialized = ref(false)
  const twoFactorRequired = ref(false)

  async function initialize() {
    try {
      user.value = await getCurrentUser()
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string, twoFactorToken?: string) {
    isLoading.value = true
    try {
      const result = await loginUser({ email, password, twoFactorToken })
      if ('requiresTwoFactor' in result) { twoFactorRequired.value = true; return }
      user.value = result
      twoFactorRequired.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function register(username: string, email: string, password: string) {
    isLoading.value = true
    try {
      user.value = await registerUser({ username, email, password })
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await logoutUser()
    user.value = null
  }

  return { user, isLoading, initialized, twoFactorRequired, initialize, login, register, logout }
})