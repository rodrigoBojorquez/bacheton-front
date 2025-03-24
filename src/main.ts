import { createApp } from 'vue';
import { createPinia } from 'pinia';
import type { PluginOptions } from 'vue-toastification';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast, { POSITION } from 'vue-toastification';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './core/router';

import '@/shared/assets/main.css';
import '@fontsource/poppins';
import 'vue-toastification/dist/index.css';
import '../src/shared/assets/styles.scss';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import PrimeToast from 'primevue/toast';
import { getPresetExt } from './shared/layouts/composables/layout';

// PrimeVue components
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
import Chart from 'primevue/chart';


// Importaciones de componentes PrimeVue para el Mapa
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Tooltip from 'primevue/tooltip';

// Import Store
import { useLayoutStore } from '@/core/stores/useLayoutStore';

// --- Configuración de Toast ---
const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 1000
};

const app = createApp(App);

// --- Pinia y Router ---
app.use(createPinia());
app.use(router);

// --- Toasts, Vue Query, PrimeVue Services ---
app.use(Toast, toastOptions);
app.use(VueQueryPlugin);
app.use(ToastService);
app.use(ConfirmationService);

// --- PrimeVue Configuración ---
app.use(PrimeVue, {
  theme: {
    options: {
      darkModeSelector: '.app-dark'
    }
  },
  locale: {
    startsWith: 'Empieza con',
    contains: 'Contiene',
    notContains: 'No contiene',
    endsWith: 'Termina con',
    equals: 'Igual a',
    notEquals: 'Diferente de',
    noFilter: 'Sin Filtro',

  }
});

// --- PrimeVue Components Globally ---
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
app.component('Chart', Chart);

//Nuevos componentes del mapa
app.component('Tag', Tag);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Card', Card);
app.component('Calendar', Calendar);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.directive('tooltip', Tooltip);


// --- Inicializar configuración de Layout ---
const layoutStore = useLayoutStore();
layoutStore.applyFullTheme();

const skyPreset = getPresetExt(layoutStore.layoutConfig.primary || 'sky');

app.mount('#app');
