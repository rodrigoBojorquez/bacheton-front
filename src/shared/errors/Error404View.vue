<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 transition-colors duration-300 relative"
    :style="{
      backgroundColor: darkMode ? surface800 : surface0
    }">
    <!-- Fondo dinámico para pantallas grandes -->
    <div class="absolute inset-0 transition-all duration-300" :style="{
      background: isSmallScreen
        ? 'none'
        : darkMode
          ? `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 16%, ${surface800} 55%, ${surface800} 100%)`
          : `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 16%, ${surface0} 55%, ${surface0} 100%)`
    }"></div>

    <!-- Fondo superior para pantallas pequeñas -->
    <div v-if="isSmallScreen" class="absolute left-0 right-0 transition-all duration-300" :style="{
      background: darkMode
        ? `linear-gradient(to bottom, ${surface700} 0%, ${surface700} 20%, transparent 100%)`
        : `linear-gradient(to bottom, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
      height: '15%',
      top: 0
    }"></div>

    <!-- Fondo inferior para pantallas pequeñas -->
    <div v-if="isSmallScreen" class="absolute left-0 right-0 transition-all duration-300" :style="{
      background: darkMode
        ? `linear-gradient(to top, ${surface700} 0%, ${surface700} 20%, transparent 100%)`
        : `linear-gradient(to top, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
      height: '15%',
      bottom: 0
    }"></div>

    <div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Imagen (solo en pantallas grandes) -->
      <div class="hidden lg:flex justify-center items-center">
        <img src="../../shared/assets/img/ERROR-404.jpeg" alt="Página no encontrada"
          class="max-w-full h-auto max-h-[500px] object-contain transform transition-transform duration-300 hover:scale-105" />
      </div>

      <!-- Contenido de Error -->
      <div class="text-center lg:text-left">
        <div class="mb-4 text-9xl font-extrabold tracking-tight" :style="{
          color: darkMode ? surface100 : surface800,
          textShadow: darkMode
            ? '0 4px 6px rgba(0,0,0,0.3)'
            : '0 4px 6px rgba(0,0,0,0.1)'
        }">
          404
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4" :style="{ color: darkMode ? surface100 : surface800 }">
          Página no encontrada
        </h1>

        <p class="text-xl mb-8 max-w-2xl mx-auto lg:mx-0" :style="{ color: darkMode ? surface300 : surface600 }">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>

        <div class="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Button label="Volver al Inicio" @click="$router.push('/')"
            class="px-8 py-3 text-lg font-semibold w-full sm:w-auto" :style="{
              backgroundColor: primaryMain,
              color: 'white',
              borderColor: primaryMain,
              boxShadow: darkMode
                ? '0 4px 6px rgba(0,0,0,0.3)'
                : '0 4px 6px rgba(0,0,0,0.2)'
            }" />

          <Button label="Regresar" @click="$router.back()" outlined
            class="px-8 py-3 text-lg font-semibold w-full sm:w-auto" :style="{
              borderColor: darkMode ? surface300 : surface500,
              color: darkMode ? surface300 : surface700,
              boxShadow: darkMode
                ? '0 4px 6px rgba(0,0,0,0.2)'
                : '0 4px 6px rgba(0,0,0,0.1)'
            }" />
        </div>

        <div class="mt-12 opacity-50 text-sm" :style="{ color: darkMode ? surface400 : surface600 }">
          Si el problema persiste, por favor contacte al soporte técnico
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Button from 'primevue/button';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { primaryColors } from '@/shared/layouts/composables/layout';

const layoutStore = useLayoutStore();
const layoutConfig = layoutStore.layoutConfig;
const darkMode = computed(() => layoutConfig.darkTheme);

const surfaces = [
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  { name: 'zinc', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' } },
  { name: 'neutral', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' } },
  { name: 'stone', palette: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' } },
  { name: 'soho', palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' } },
  { name: 'viva', palette: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' } },
  { name: 'ocean', palette: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' } }];

const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const primaryPalette = computed(() => {
  return primaryColors.find(c => c.name === layoutConfig.primary)?.palette;
});

const surfacePalette = computed(() => {
  return surfaces.find(s => s.name === layoutConfig.surface)?.palette;
});

// Colores computados
const surface0 = computed(() => surfacePalette.value?.['0'] || '#ffffff');
const surface100 = computed(() => surfacePalette.value?.['100'] || '#f1f5f9');
const surface300 = computed(() => surfacePalette.value?.['300'] || '#cbd5e1');
const surface400 = computed(() => surfacePalette.value?.['400'] || '#94a3b8');
const surface500 = computed(() => surfacePalette.value?.['500'] || '#64748b');
const surface600 = computed(() => surfacePalette.value?.['600'] || '#475569');
const surface700 = computed(() => surfacePalette.value?.['700'] || '#334155');
const surface800 = computed(() => surfacePalette.value?.['800'] || '#1e293b');

const primaryMain = computed(() => primaryPalette.value?.['500'] || '#0ea5e9');
const primaryLight = computed(() => primaryPalette.value?.['300'] || '#7dd3fc');
const primaryDark = computed(() => primaryPalette.value?.['400'] || '#0369a1');
</script>

<style scoped>
.backdrop-brightness-90 {
  backdrop-filter: brightness(0.9);
}
</style>