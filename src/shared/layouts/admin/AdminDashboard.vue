<script setup lang="ts">
import { useLayoutStore } from '@/core/stores/useLayoutStore'; // Cambio aquí
import { computed, ref, watch } from 'vue';
import AppFooter from './AdminFooter.vue';
import AppSidebar from './AdminSidebar.vue';
import AppTopbar from './AdminTopBar.vue';

const layoutStore = useLayoutStore(); // Uso del store

const outsideClickListener = ref<EventListener | null>(null);

// Observamos el estado del sidebar
watch(() => layoutStore.isSidebarActive, (newVal: boolean) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

// Computed para las clases del contenedor
const containerClass = computed(() => {
  return {
    'layout-overlay': layoutStore.layoutConfig.menuMode === 'overlay',
    'layout-static': layoutStore.layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutStore.layoutState.staticMenuDesktopInactive && layoutStore.layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutStore.layoutState.overlayMenuActive,
    'layout-mobile-active': layoutStore.layoutState.staticMenuMobileActive
  };
});

// Click fuera del menú
function bindOutsideClickListener(): void {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: Event): void => {
      if (isOutsideClicked(event as MouseEvent)) {
        layoutStore.layoutState.overlayMenuActive = false;
        layoutStore.layoutState.staticMenuMobileActive = false;
        layoutStore.layoutState.menuHoverActive = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
}

function unbindOutsideClickListener(): void {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value);
    outsideClickListener.value = null;
  }
}

function isOutsideClicked(event: MouseEvent): boolean {
  const sidebarEl = document.querySelector('.layout-sidebar') as HTMLElement | null;
  const topbarEl = document.querySelector('.layout-menu-button') as HTMLElement | null;
  if (!sidebarEl || !topbarEl) {
    return true;
  }
  return !(
    sidebarEl.isSameNode(event.target as Node) ||
    sidebarEl.contains(event.target as Node) ||
    topbarEl.isSameNode(event.target as Node) ||
    topbarEl.contains(event.target as Node)
  );
}
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <app-sidebar></app-sidebar>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <PrimeToast />
</template>

<style lang="scss" scoped></style>
