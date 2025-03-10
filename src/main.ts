import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { PluginOptions } from 'vue-toastification'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Toast, { POSITION } from 'vue-toastification'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './core/router'

import '@/shared/assets/main.css'
import '@fontsource/poppins'
import 'vue-toastification/dist/index.css'
import '../src/shared/assets/styles.scss'

import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import PrimeToast from 'primevue/toast'

// Importaciones de merge manual, tema Aura y tu layout
import merge from 'lodash.merge'
import Aura from '@primeuix/themes/aura'
import { layoutConfig, getPresetExt } from './shared/layouts/composables/layout'

// Importa la interfaz que definiste
import type { PrimeUixTheme } from './core/types/primeuix-theme'
import Menu from 'primevue/menu';

// Configuración de Toast
const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 1000
};

layoutConfig.primary = 'sky';
layoutConfig.surface = 'slate';

// Castea Aura y tu preset a la interfaz PrimeUixTheme
const auraPreset: PrimeUixTheme = Aura;
const skyPreset: PrimeUixTheme = getPresetExt();


const mergedPreset: PrimeUixTheme = merge({}, auraPreset, skyPreset);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);
app.use(VueQueryPlugin);
app.use(ToastService);
app.use(ConfirmationService);

app.use(PrimeVue, {
  theme: {
    preset: mergedPreset,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});

app.component('PrimeToast', PrimeToast);
app.component('PrimeMenu', Menu);

app.mount('#app');
