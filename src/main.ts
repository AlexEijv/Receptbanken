import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)
app.use(createPinia()).use(router)
void useAuthStore().initialize()
app.mount('#app')
