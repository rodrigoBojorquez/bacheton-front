<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { primaryColors, type ColorOption } from '@/shared/layouts/composables/layout';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import SelectButton from 'primevue/selectbutton';

const layoutStore = useLayoutStore();
const { layoutConfig, isConfiguratorOpen, setConfiguratorOpen } = layoutStore;

// Presets disponibles
const presets = { Aura, Lara, Nora };
const preset = ref(layoutConfig.preset);
const presetOptions = ref(Object.keys(presets));

// Modo menú
const menuMode = ref(layoutConfig.menuMode);
const menuModeOptions = ref([
  { label: 'Static', value: 'static' },
 /*  { label: 'Overlay', value: 'overlay' } */
]);

// Superficies disponibles
// Superficies disponibles
const surfaces = ref([
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  { name: 'zinc', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' } },
  { name: 'neutral', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' } },
  { name: 'stone', palette: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' } },
  { name: 'soho', palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' } },
  { name: 'viva', palette: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' } },
  { name: 'ocean', palette: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' } }
]);

// Ref para el panel configurador
const configPanelRef = ref<HTMLElement | null>(null);

// Actualizar colores
function updateColors(type: 'primary' | 'surface', color: ColorOption): void {
  if (type === 'primary') {
    layoutStore.setPrimaryColor(color.name);
  } else if (type === 'surface') {
    layoutStore.setSurfaceColor(color);
  }
}

// Actualizar preset
function onPresetChange(): void {
  layoutStore.setPreset(preset.value);
}

// Actualizar modo menú
function onMenuModeChange(): void {
  layoutStore.setMenuMode(menuMode.value);
}

// Cerrar configurador al hacer clic fuera
function handleClickOutside(event: MouseEvent) {
  if (configPanelRef.value && !configPanelRef.value.contains(event.target as Node)) {
    if (isConfiguratorOpen) {
      setConfiguratorOpen(false);
    }
  }
}

onMounted(() => {
  const primary = layoutConfig.primary;
  const primaryColor = primaryColors.find(p => p.name === primary);
  if (primaryColor) {
    layoutStore.setPrimaryColor(primaryColor.name);
  }

  const surfaceColor = surfaces.value.find(s => s.name === layoutConfig.surface);
  if (surfaceColor) {
    layoutStore.setSurfaceColor(surfaceColor);
  }

  preset.value = layoutConfig.preset;
  menuMode.value = layoutConfig.menuMode;

  // Listener global para detectar clics
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<script lang="ts">
import StyleClass from 'primevue/styleclass';
export default {
  directives: {
    styleclass: StyleClass
  }
}
</script>

<template>
  <div
    ref="configPanelRef"
    v-show="isConfiguratorOpen"
   class="config-panel absolute top-[3.25rem] right-52 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border shadow-lg z-50"
  >
    <div class="flex flex-col gap-4">
      <!-- Color Primario -->
      <div>
        <span class="text-sm text-muted-color font-semibold">Color Primario</span>
        <div class="pt-2 flex gap-2 flex-wrap justify-between">
          <button
            v-for="primaryColor in primaryColors"
            :key="primaryColor.name"
            type="button"
            :title="primaryColor.name"
            @click="updateColors('primary', primaryColor)"
            :class="[ 'border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1', { 'outline-primary': layoutConfig.primary === primaryColor.name } ]"
            :style="{ backgroundColor: primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500'] }"
          ></button>
        </div>
      </div>

      <!-- Color de Superficie -->
      <div>
        <span class="text-sm text-muted-color font-semibold">Color de Superficie</span>
        <div class="pt-2 flex gap-2 flex-wrap justify-between">
          <button
            v-for="surface in surfaces"
            :key="surface.name"
            type="button"
            :title="surface.name"
            @click="updateColors('surface', surface)"
            :class="[ 'border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1', { 'outline-primary': layoutConfig.surface === surface.name } ]"
            :style="{ backgroundColor: surface.palette['500'] }"
          ></button>
        </div>
      </div>

      <!-- Preajustes -->
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted-color font-semibold">Preajustes</span>
        <SelectButton v-model="preset" @change="onPresetChange" :options="presetOptions" :allowEmpty="false" />
      </div>

      <!-- Modo de SideBar -->
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted-color font-semibold">Modo de SideBar</span>
        <SelectButton v-model="menuMode" @change="onMenuModeChange" :options="menuModeOptions" :allowEmpty="false" optionLabel="label" optionValue="value" />
      </div>
    </div>
  </div>
</template>
