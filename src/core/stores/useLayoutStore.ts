// src/core/stores/useLayoutStore.ts
import { defineStore } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { updatePreset, updateSurfacePalette, $t } from '@primeuix/themes';
import { getPresetExt, type ColorOption } from '@/shared/layouts/composables/layout';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';

const surfacesList = [
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  // Puedes agregar tus otras superficies aquí...
];

export const useLayoutStore = defineStore('layout', () => {
  const storedConfig = localStorage.getItem('layoutConfig');
  const storedState = localStorage.getItem('layoutState');

  const isConfiguratorOpen = ref(false);

  // Acción para abrir/cerrar configurador
  function setConfiguratorOpen(value: boolean) {
    isConfiguratorOpen.value = value;
  }

  const layoutConfig = reactive(storedConfig ? JSON.parse(storedConfig) : {
    preset: 'Aura',
    primary: 'sky',
    surface: 'slate',
    darkTheme: false,
    menuMode: 'static'
  });

  const layoutState = reactive(storedState ? JSON.parse(storedState) : {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null,
    configuratorVisible: false
  });

  // 🟢 Aquí agregas el getter computado:
  const isSidebarActive = computed(() =>
    layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
  );

  // Persistencia
  watch(layoutConfig, (value) => {
    localStorage.setItem('layoutConfig', JSON.stringify(value));
  }, { deep: true });

  watch(layoutState, (value) => {
    localStorage.setItem('layoutState', JSON.stringify(value));
  }, { deep: true });

  const presetMap: Record<'Aura' | 'Lara' | 'Nora', unknown> = {
    'Aura': Aura,
    'Lara': Lara,
    'Nora': Nora
  };

  const applyFullTheme = (): void => {
    const presetValue = presetMap[layoutConfig.preset as 'Aura' | 'Lara' | 'Nora'] || Aura;
    const surfacePalette = surfacesList.find(s => s.name === layoutConfig.surface)?.palette;

    $t()
      .preset(presetValue)
      .preset(getPresetExt(layoutConfig.primary))
      .surfacePalette(surfacePalette)
      .use({ useDefaultOptions: true });

    document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme);
  };

  const toggleMenu = (): void => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
    }
    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    }
  };

  const toggleDarkMode = (): void => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme);
  };

  const setPrimaryColor = (colorName: string): void => {
    layoutConfig.primary = colorName;
    updatePreset(getPresetExt(colorName));
    applyFullTheme();
  };

  const setSurfaceColor = (surface: ColorOption): void => {
    layoutConfig.surface = surface.name;
    updateSurfacePalette(surface.palette);
    applyFullTheme();
  };

  const setPreset = (presetName: string): void => {
    layoutConfig.preset = presetName;
    applyFullTheme();
  };

  const setMenuMode = (mode: string): void => {
    layoutConfig.menuMode = mode;
  };

  const toggleConfigurator = (): void => {
    layoutState.configuratorVisible = !layoutState.configuratorVisible;
  };

  const setActiveMenuItem = (item: unknown): void => {
    layoutState.activeMenuItem = item;
  };

  return {
    layoutConfig,
    layoutState,
    toggleMenu,
    toggleDarkMode,
    setPrimaryColor,
    setSurfaceColor,
    setPreset,
    setMenuMode,
    toggleConfigurator,
    setActiveMenuItem,
    applyFullTheme,
    isSidebarActive,
    setConfiguratorOpen,
    isConfiguratorOpen,
  };
});
