import '@/shared/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import Material from "@primeuix/themes/material"
import '../src/shared/assets/main.css'
import '@fontsource/poppins';



import App from './App.vue'
import router from './core/router'

const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 1000,
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: '.app-ligh'
    }
  },
})

app.mount('#app')
