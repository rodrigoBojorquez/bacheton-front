<template>
  <div class="transition-colors" :style="{ backgroundColor: darkMode ? surface800 : surface0 }">
    <PublicTopBar />
    <main>
      <div class="flex flex-col max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-6 space-y-12 mt-14">
        <!-- Sección Banner-->
        <section class="rounded-xl shadow-lg overflow-hidden"
          :style="{ backgroundColor: darkMode ? surface700 : surface50 }">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
              <div>
                <h1 class="font-bold text-3xl md:text-4xl mb-4" :style="{ color: primaryDark }">Bacheton</h1>
                <h4 class="font-medium text-xl mb-6" :style="{ color: darkMode ? surface100 : surface700 }">
                  Transformando las calles de nuestra ciudad
                </h4>
                <p class="font-normal text-base md:text-lg mb-8 leading-relaxed"
                  :style="{ color: darkMode ? surface200 : surface600 }">
                  Únete a nuestra iniciativa para mejorar la seguridad vial y la calidad de vida en nuestra comunidad.
                  Reporta baches y contribuye a un cambio positivo. Juntos podemos crear un entorno urbano más seguro y
                  agradable para todos.
                </p>
              </div>
              <div class="mt-4 md:mt-6">
                <Button class="w-full md:w-auto text-base font-medium" size="large"
                  :style="{ backgroundColor: primaryMain, color: '#fff' }" @click="navegar">
                  Reportar un Bache
                </Button>
              </div>
            </div>

            <!-- Imagen del banner -->
            <div class="md:w-1/2 order-first md:order-last">
              <div class="h-64 sm:h-80 md:h-full">
                <img src="../shared/assets/img/Home-Bacheton.jpg" alt="Calles de México"
                  class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <!-- Sección de Beneficios -->
        <section class="rounded-xl shadow-lg p-6 md:p-10"
          :style="{ backgroundColor: darkMode ? surface700 : surface50 }">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left"
            :style="{ color: darkMode ? surface100 : surface800 }">
            Beneficios de unirte a Bacheton
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="(beneficio, index) in beneficios" :key="index" class="flex items-start space-x-5">
              <div class="p-6 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: primaryMain }">
                <i :class="[beneficio.icon, 'text-2xl text-white']"></i>
              </div>
              <div>
                <h5 class="text-lg font-bold mb-2" :style="{ color: darkMode ? surface100 : surface800 }">{{
                  beneficio.title }}</h5>
                <p class="leading-relaxed" :style="{ color: darkMode ? surface200 : surface600 }">{{
                  beneficio.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección de Pasos-->
        <section class="py-10 px-6 md:px-10 rounded-xl shadow-lg" :style="{ backgroundColor: primaryMain }">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 ">
            Cómo reportar un bache en 3 sencillos pasos
          </h2>
          <p class="text-center mb-10 text-lg mx-auto ">
            Sigue esta guía para contribuir a la mejora de nuestras calles de manera rápida y efectiva.
          </p>
          <div class="max-w-4xl mx-auto space-y-8">
            <div v-for="(paso, index) in pasos" :key="index"
              class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 rounded-xl">
              <div class="bg-white p-5 rounded-full flex-shrink-0 shadow-md">
                <i :class="[paso.icon, 'text-3xl']" :style="{ color: primaryDark }"></i>
              </div>
              <div>
                <h5 class="text-xl font-semibold mb-2 text-center sm:text-left ">{{ paso.title }}</h5>
                <p class="text-base text-center sm:text-left  leading-relaxed ">{{ paso.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección de Funcionalidades con cards mejoradas -->
        <section class="rounded-xl shadow-lg p-6 md:p-10"
          :style="{ backgroundColor: darkMode ? surface700 : surface50 }">
          <div class="mb-8 text-center">
            <h2 class="text-2xl md:text-3xl font-bold" :style="{ color: darkMode ? surface100 : surface800 }">
              Explora nuestras funcionalidades
            </h2>
            <p class="mt-3 mx-auto" :style="{ color: darkMode ? surface200 : surface600 }">
              Descubre las herramientas que te ayudarán a mejorar tu comunidad
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(funcionalidad, index) in funcionalidades" :key="index" class="h-full">
              <Card class="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                :style="{ backgroundColor: darkMode ? surface600 : 'white', borderColor: darkMode ? surface500 : surface200 }">
                <template #header>
                  <div class="h-48 flex items-center justify-center"
                    :style="{ backgroundColor: darkMode ? surface500 : surface100 }">
                    <img :src="funcionalidad.img" :alt="funcionalidad.title"
                      class="h-full w-full object-cover rounded-t-lg" />
                  </div>
                </template>
                <template #title>
                  <h5 class="text-xl font-bold" :style="{ color: darkMode ? surface100 : surface800 }">{{
                    funcionalidad.title }}</h5>
                </template>
                <template #content>
                  <p class="leading-relaxed" :style="{ color: darkMode ? surface200 : surface600 }">
                    {{ funcionalidad.description }}
                  </p>
                </template>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import PublicTopBar from '@/shared/layouts/public/PublicTopBar.vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { primaryColors } from '@/shared/layouts/composables/layout';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/core/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Verifica si el usuario está autenticado
const redireccion = computed(() => (authStore.isAuth ? 'app/report' : '/login'));

// Función para navegar a la ruta correcta
const navegar = () => {
  router.push(redireccion.value);
};

// Configuración del tema
const layoutStore = useLayoutStore();
const layoutConfig = layoutStore.layoutConfig;
const darkMode = computed(() => layoutConfig.darkTheme);

// Definición de las paletas de colores
const surfaces = [
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  { name: 'zinc', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' } },
  { name: 'neutral', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' } },
  { name: 'stone', palette: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' } },
  { name: 'soho', palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' } },
  { name: 'viva', palette: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' } },
  { name: 'ocean', palette: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' } }
];

// Computed properties para las paletas de colores
const surfacePalette = computed(() => {
  return surfaces.find(s => s.name === layoutConfig.surface)?.palette;
});

const primaryPalette = computed(() => {
  return primaryColors.find(c => c.name === layoutConfig.primary)?.palette;
});

// Colores computados de surface
const surface50 = computed(() => surfacePalette.value?.['50'] || '#f8fafc');
const surface100 = computed(() => surfacePalette.value?.['100'] || '#f1f5f9');
const surface200 = computed(() => surfacePalette.value?.['200'] || '#e2e8f0');
const surface500 = computed(() => surfacePalette.value?.['500'] || '#64748b');
const surface600 = computed(() => surfacePalette.value?.['600'] || '#475569');
const surface700 = computed(() => surfacePalette.value?.['700'] || '#334155');
const surface800 = computed(() => surfacePalette.value?.['800'] || '#1f2937');
const surface0 = computed(() => surfacePalette.value?.['0'] || '#ffffff');

// Colores computados primarios
const primaryMain = computed(() => primaryPalette.value?.['500'] || '#0ea5e9');
const primaryLight = computed(() => primaryPalette.value?.['300'] || '#7dd3fc');
const primaryDark = computed(() => primaryPalette.value?.['400'] || '#0369a1');

// Información de Beneficios
const beneficios = ref([
  {
    icon: "pi pi-shield",
    title: "Seguridad vial mejorada",
    description:
      "Reducimos los accidentes causados por baches, asegurando un tránsito más seguro para todos.",
  },
  {
    icon: "pi pi-users",
    title: "Comunidad activa",
    description:
      "Fomentamos la participación ciudadana, creando un sentido de pertenencia y responsabilidad.",
  },
  {
    icon: "pi pi-clock",
    title: "Respuesta rápida",
    description:
      "Nuestro sistema garantiza una atención eficiente a los reportes, minimizando los tiempos de resolución.",
  },
  {
    icon: "pi pi-star",
    title: "Impacto positivo",
    description:
      "Cada reporte contribuye a mejorar la infraestructura y la calidad de vida en la ciudad.",
  },
]);

// Información de Pasos
const pasos = ref([
  {
    icon: "pi pi-user-plus",
    title: "Regístrate",
    description:
      "Crea una cuenta en Bacheton para empezar a reportar baches y seguir su progreso.",
  },
  {
    icon: "pi pi-camera",
    title: "Reporta el bache",
    description:
      "Describe la ubicación y el estado del bache, y adjunta una foto para mayor precisión.",
  },
  {
    icon: "pi pi-refresh",
    title: "Sigue el progreso",
    description:
      "Recibe actualizaciones sobre el estado de tu reporte y contribuye a la transparencia del proceso.",
  },
]);

// Información de Funcionalidades
const funcionalidades = ref([
  {
    img: new URL('@/shared/assets/img/Bache-Img.jpg', import.meta.url).href,
    title: "Captura de baches",
    description: "Accede a la cámara para tomar una foto del bache y reportarlo fácilmente.",
  },
  {
    img: new URL('@/shared/assets/img/Mapa-img.png', import.meta.url).href,
    title: "Ubicación en tiempo real",
    description: "Activa la geolocalización para identificar con precisión la ubicación del bache y agilizar su registro en el mapa.",
  },
  {
    img: new URL('@/shared/assets/img/Reporte-Img.jpg', import.meta.url).href,
    title: "Monitorea tus reportes",
    description: "Consulta el estado de los baches que has reportado y sigue el progreso de su resolución.",
  },
]);
</script>