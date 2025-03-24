<template>
  <div class="transition-colors" :style="{ backgroundColor: darkMode ? surface800 : surface0 }">
    <PublicTopBar />
    <main>
      <div class="flex flex-col max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-6 space-y-12 mt-14">

        <!-- Hero Section (igual que antes) -->
        <section
          class="relative bg-cover h-150 flex items-center justify-center text-white"
          :style="{ backgroundImage: `url(${hero})`, backgroundPosition: 'center bottom' }"
        >
          <div class="absolute inset-0" :style="{ backgroundColor: primaryTransparent }"></div>
          <div class="relative z-10 text-center px-4">
            <p class="text-5xl md:text-6xl font-bold">
              Bienvenidos a <br />Bacheton
            </p>
            <p class="mt-4 text-2xl md:text-3xl max-w-2xl mx-auto">
              Una plataforma dedicada a mejorar la calidad de vida en nuestra ciudad
              mediante la gestión eficiente de baches.
            </p>
          </div>
        </section>

        <!-- Sección: Nuestra Historia -->
        <section class="rounded-xl shadow-lg p-6 md:p-10 text-2xl md:text-2xl" :style="{ backgroundColor: darkMode ? surface700 : surface50 }">
          <div>
            <p class="block font-semibold uppercase tracking-wide" :style="{ color: primaryDark }">
              Nuestra historia
            </p>
            <h1 class="text-4xl md:text-3xl font-bold mt-2" :style="{ color: darkMode ? surface100 : surface800 }">
              Desde el inicio hasta hoy
            </h1>
            <p class="mt-4 text-2xl leading-relaxed" :style="{ color: darkMode ? surface200 : surface600 }">
              Bacheton nació de la urgente necesidad de mejorar las condiciones de las calles de nuestra ciudad, brindando seguridad y comodidad a peatones y conductores. Lo que comenzó como una iniciativa para atender un problema cotidiano, rápidamente evolucionó en un proyecto integral que busca transformar la infraestructura vial mediante acciones eficientes y sostenibles. Desde entonces, hemos trabajado incansablemente para desarrollar soluciones innovadoras, optimizar procesos y fomentar la participación ciudadana, asegurando así un impacto positivo y duradero en nuestra comunidad.
            </p>
          </div>
        </section>


       <!-- Sección: Puntos Clave -->
<section class="py-10 px-6 md:px-10 rounded-xl shadow-lg" :style="{ backgroundColor: primaryMain }">
  <h2 class="text-2xl md:text-3xl font-bold text-center mb-6 text-white">
    Puntos Clave
  </h2>
  <p class="text-center mb-10 text-lg mx-auto text-white">
    Descubre nuestros principales valores y ventajas.
  </p>
  <div class="max-w-4xl mx-auto space-y-8">
    <div
      v-for="(punto, index) in puntos"
      :key="index"
      class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 rounded-xl"
    >
      <!-- Contenedor del ícono, similar a la sección de Pasos -->
      <div class="bg-white p-5 rounded-full flex-shrink-0 shadow-md">
        <i :class="[punto.icon, 'text-3xl']" :style="{ color: primaryDark }"></i>
      </div>
      <!-- Contenido: Título y descripción -->
      <div>
        <h5 class="text-xl font-semibold mb-2 text-center sm:text-left text-white">
          {{ punto.title }}
        </h5>
        <p class="text-base text-center sm:text-left leading-relaxed text-white">
          {{ punto.description }}
        </p>
      </div>
    </div>
  </div>
</section>

        <!-- Sección Nuestro Equipo (igual que antes) -->
        <section class="rounded-xl shadow-lg p-6 md:p-10" :style="{ backgroundColor: darkMode ? surface700 : surface50 }">
          <div class="mb-8 text-center">
            <h2 class="text-2xl md:text-3xl font-bold" :style="{ color: darkMode ? surface100 : surface800 }">
              Nuestro Equipo
            </h2>
            <p class="mt-3 mx-auto" :style="{ color: darkMode ? surface200 : surface600 }">
              Conoce al equipo apasionado que está detrás de Bacheton, trabajando cada día para mejorar nuestra ciudad.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="(miembro, index) in equipo" :key="index" class="h-full">
              <Card
                class="h-full shadow-md hover:shadow-lg transition-shadow duration-300"
                :style="{ backgroundColor: darkMode ? surface600 : 'white', borderColor: darkMode ? surface500 : surface200 }"
              >
                <template #header>
                  <div class="h-48 flex items-center justify-center" :style="{ backgroundColor: darkMode ? surface500 : surface100 }">
                    <img :src="miembro.foto" alt="Foto de perfil" class="w-full h-full object-cover" />
                  </div>
                </template>
                <template #title>
                  <h5 class="text-xl font-bold" :style="{ color: darkMode ? surface100 : surface800 }">
                    {{ miembro.nombre }}
                  </h5>
                </template>
                <template #content>
                  <p class="leading-relaxed" :style="{ color: darkMode ? surface200 : surface600 }">
                    {{ miembro.rol }}
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
import hero from '@/shared/assets/img/hero.jpg';
import perfil from '@/shared/assets/img/perfil.jpg';

// Manejo de Tema (igual que en HomeView)
const layoutStore = useLayoutStore();
const layoutConfig = layoutStore.layoutConfig;
const darkMode = computed(() => layoutConfig.darkTheme);

const surfaces = [
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  // ... Resto de paletas
];

// Obtener paletas
const surfacePalette = computed(() => surfaces.find(s => s.name === layoutConfig.surface)?.palette);
const surface0 = computed(() => surfacePalette.value?.['0'] || '#ffffff');
const surface50 = computed(() => surfacePalette.value?.['50'] || '#f8fafc');
const surface100 = computed(() => surfacePalette.value?.['100'] || '#f1f5f9');
const surface200 = computed(() => surfacePalette.value?.['200'] || '#e2e8f0');
const surface500 = computed(() => surfacePalette.value?.['500'] || '#64748b');
const surface600 = computed(() => surfacePalette.value?.['600'] || '#475569');
const surface700 = computed(() => surfacePalette.value?.['700'] || '#334155');
const surface800 = computed(() => surfacePalette.value?.['800'] || '#1f2937');

const primaryPalette = computed(() => primaryColors.find(c => c.name === layoutConfig.primary)?.palette);
const primaryMain = computed(() => primaryPalette.value?.['500'] || '#0ea5e9');
const primaryDark = computed(() => primaryPalette.value?.['400'] || '#0369a1');

// Función para convertir hexadecimal a rgba
function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace('#','');
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const primaryTransparent = computed(() => hexToRgba(primaryMain.value, 0.5));

// Datos del Equipo
const equipo = ref([
  {
    foto: perfil,
    nombre: 'Andres Garcia Leyva',
    rol: 'Desarrollador Fullstack'
  },
  {
    foto: perfil,
    nombre: 'Juan Carlos Lopez Can',
    rol: 'Desarrollador Frontend'
  },
  {
    foto: perfil,
    nombre: 'Ricardo Chi',
    rol: 'Desarrollador Frontend'
  },
  {
    foto: perfil,
    nombre: 'Rodrigo',
    rol: 'Desarrollador Fullstack'
  },
]);
// Datos de los Puntos Clave
const puntos = ref([
  {
    icon: 'pi pi-cog',
    title: 'Gestión Eficiente',
    description: 'Optimiza los recursos en la reparación y repavimentación, acelerando la solución de problemas.'
  },
  {
    icon: 'pi pi-users',
    title: 'Participación Comunitaria',
    description: 'Involucra a los ciudadanos en la identificación y solución de problemas para un impacto real.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Impacto Medible',
    description: 'Monitoreamos y reportamos el progreso de las mejoras en la infraestructura vial.'
  },
]);
</script>
