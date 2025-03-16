import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import type { PluginOptions } from 'vue-toastification';
import Toast, { POSITION } from 'vue-toastification';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './core/router';

import '@/shared/assets/main.css';
import '@fontsource/poppins';
import 'vue-toastification/dist/index.css';
import './shared/assets/styles.scss';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import PrimeToast from 'primevue/toast';

import merge from 'lodash.merge';
import Aura from '@primeuix/themes/aura';
import { getPresetExt } from './shared/layouts/composables/layout';
import { useLayoutStore } from './core/stores/useLayoutStore';

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toolbar from 'primevue/toolbar';
import MultiSelect from 'primevue/multiselect';

const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 1000
};

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
const layoutStore = useLayoutStore();

const auraPreset = Aura;
const presetExt = getPresetExt();
const mergedPreset = merge({}, auraPreset, presetExt);

app.use(PrimeVue, {
  theme: {
    preset: mergedPreset,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});

if (layoutStore.layoutConfig.darkTheme) {
  document.documentElement.classList.add('app-dark');
}

app.use(router);
app.use(Toast, toastOptions);
app.use(VueQueryPlugin);
app.use(ToastService);
app.use(ConfirmationService);

app.component('PrimeToast', PrimeToast);
app.component('PrimeMenu', Menu);
app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Dialog', Dialog);
app.component('Select', Select);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Toolbar', Toolbar);
app.component('MultiSelect', MultiSelect);

app.mount('#app');
