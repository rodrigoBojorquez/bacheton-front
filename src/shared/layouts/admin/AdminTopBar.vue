<template>
  <div class="layout-topbar relative"> <!-- Relative necesario -->
    <!-- Logo y Botón menú -->
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="layoutStore.toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link :to="{ name: 'dashboard' }" class="layout-topbar-logo">
        <MyLogo />
        <span>BACHETON</span>
      </router-link>
    </div>

    <!-- Acciones del Topbar -->
    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <!-- Botón Modo Oscuro -->
        <button type="button" class="layout-topbar-action" @click="layoutStore.toggleDarkMode">
          <i :class="['pi', { 'pi-moon': layoutStore.layoutConfig.darkTheme, 'pi-sun': !layoutStore.layoutConfig.darkTheme }]"></i>
        </button>

        <!-- Botón Configurador -->
        <div class="relative">
          <button
            ref="configButtonRef"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
            @click="toggleConfigurator"
          >
            <i class="pi pi-palette"></i>
          </button>
        </div>
      </div>

      <!-- Menú Extra -->
      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <!-- Menú Rápido -->
      <div class="flex items-center space-x-2">
        <div v-if="authStore.isAuth">
    <div class=" text-md text-primary font-semibold">{{ authStore.userName }}</div>
    <div class="text-xs font-semibold">{{ authStore.userRole }}</div>
  </div>
  <button type="button" class="layout-topbar-action" @click="toggleAdminMenu">
    <i class="pi pi-user"></i>
    <span>Profile</span>
  </button>

</div>


      <!-- Menú Perfil -->
      <AdminToggle ref="adminToggleRef" />
    </div>

    <!-- Configurador SIEMPRE cargado, solo controlado por v-show -->
    <AppConfigurator
      ref="configPanelRef"
      v-show="layoutStore.isConfiguratorOpen"
      @closeConfigurator="closeConfigurator"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import AppConfigurator from '../AppConfigurator.vue';
import AdminToggle from './AdminToggle.vue';
import MyLogo from '../../assets/LogoBacheton.vue';
import { useAuthStore } from '@/core/stores/authStore';

const layoutStore = useLayoutStore();
const adminToggleRef = ref<InstanceType<typeof AdminToggle> | null>(null);
const configPanelRef = ref<InstanceType<typeof AppConfigurator> | null>(null);
const configButtonRef = ref<HTMLButtonElement | null>(null);
  const authStore = useAuthStore()


const toggleAdminMenu = (event: MouseEvent): void => {
  adminToggleRef.value?.toggleMenu(event);
};

// Toggle del ConfigPanel
const toggleConfigurator = () => {
  layoutStore.setConfiguratorOpen(!layoutStore.isConfiguratorOpen);
};

// Cierra configurador
const closeConfigurator = () => {
  layoutStore.setConfiguratorOpen(false);
};

// Detecta click fuera
const handleClickOutside = (event: MouseEvent) => {
  const configuratorEl = configPanelRef.value?.$el;
  const buttonEl = configButtonRef.value;

  if (
    layoutStore.isConfiguratorOpen &&
    configuratorEl &&
    !configuratorEl.contains(event.target) &&
    buttonEl &&
    !buttonEl.contains(event.target as Node)
  ) {
    layoutStore.setConfiguratorOpen(false);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
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
