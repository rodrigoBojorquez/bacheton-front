<template>
  <!-- Ajusta la altura y el padding según tu diseño o preferencias -->
  <div class="layout-topbar relative flex items-center px-4 h-14">

    <!-- Sección Izquierda: Logo -->
    <div class="layout-topbar-logo-container flex-none">
      <router-link :to="{ name: 'home' }" class="layout-topbar-logo">
        <MyLogo />
        <span>BACHETON</span>
      </router-link>
    </div>

    <div class="flex-1 flex items-center text-pr justify-center gap-8">
      <!-- Enlace a Inicio -->
      <router-link :to="{ name: 'home' }" class="flex items-center gap-2 ">
        <i class="pi pi-home text-2xl md:text-3xl text-primary"></i>
        <span class="hidden   md:inline-block text-lg md:text-xl">Inicio</span>
      </router-link>

      <!-- Enlace a Sobre Nosotros -->
      <router-link :to="{ name: 'about' }" class="flex items-center gap-2 ">
        <i class="pi pi-info-circle text-2xl md:text-3xl text-primary"></i>
        <span class="hidden   md:inline-block text-lg md:text-xl">Sobre Nosotros</span>
      </router-link>

      <!-- Nuevo Enlace: Reportes (visible solo si el usuario está autenticado) -->
      <router-link v-if="authStore.isAuth" :to="{ name: 'report' }" class="flex items-center gap-2 ">
        <i class="pi pi-file text-2xl md:text-3xl text-primary"></i>
        <span class="hidden  md:inline-block text-lg md:text-xl">Reportes</span>
      </router-link>

      <!-- Nuevo Enlace: Administración (visible solo si el usuario tiene permisos) -->
      <RouterLink v-if="canAccessPanel" :to="{ name: 'app-monitoring' }" class="flex items-center gap-2">
        <i class="pi pi-map text-2xl md:text-3xl text-primary"></i>
        <span class="hidden  md:inline-block text-lg md:text-xl">Mapa</span>
      </RouterLink>

      <!-- Nuevo Enlace: Administración (visible solo si el usuario tiene permisos) -->
      <RouterLink v-if="canAccessMap" :to="{ name: 'dashboard' }" class="flex items-center gap-2">
        <i class="pi pi-th-large text-2xl md:text-3xl text-primary"></i>
        <span class="hidden  md:inline-block text-lg md:text-xl">Panel</span>
      </RouterLink>
    </div>

    <!-- Sección Derecha: Acciones del Topbar -->
    <div class="layout-topbar-actions flex items-center gap-4 flex-none">
      <div class="layout-config-menu flex items-center gap-2">
        <!-- Botón Modo Oscuro -->
        <button type="button" class="layout-topbar-action" @click="layoutStore.toggleDarkMode">
          <i
            :class="['pi', { 'pi-moon': layoutStore.layoutConfig.darkTheme, 'pi-sun': !layoutStore.layoutConfig.darkTheme }]"></i>
        </button>

        <!-- Botón Configurador -->
        <div class="relative">
          <button ref="configButtonRef" type="button" class="layout-topbar-action layout-topbar-action-highlight"
            @click="toggleConfigurator">
            <i class="pi pi-palette"></i>
          </button>
        </div>
      </div>

      <!-- Menú Extra -->
      <button class="layout-topbar-menu-button layout-topbar-action" v-styleclass="{
        selector: '@next',
        enterFromClass: 'hidden',
        enterActiveClass: 'animate-scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'animate-fadeout',
        hideOnOutsideClick: true
      }">
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <!-- Menú Rápido (otros botones) -->
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

    <!-- Configurador siempre cargado, controlado por v-show -->
    <AppConfigurator ref="configPanelRef" v-show="layoutStore.isConfiguratorOpen"
      @closeConfigurator="closeConfigurator" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import AppConfigurator from '../AppConfigurator.vue';
import AdminToggle from './userToggleBar.vue';
import MyLogo from '../../assets/LogoBacheton.vue';
import { useAuthStore } from '@/core/stores/authStore'

const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const adminToggleRef = ref<InstanceType<typeof AdminToggle> | null>(null);
const configPanelRef = ref<InstanceType<typeof AppConfigurator> | null>(null);
const configButtonRef = ref<HTMLButtonElement | null>(null);

const canAccessMap = computed(() => {
  const permissions = authStore.permissions
  return permissions.includes("superAdmin:Administracion") || permissions.includes("monitoring:Reportes")
})

const canAccessPanel = computed(() => {
  const permissions = authStore.permissions
  return permissions.includes("superAdmin:Administracion")
})

const toggleAdminMenu = (event: MouseEvent): void => {
  adminToggleRef.value?.toggleMenu(event);
};

// Toggle del ConfigPanel
const toggleConfigurator = () => {
  layoutStore.setConfiguratorOpen(!layoutStore.isConfiguratorOpen);
};

// Cierra el configurador
const closeConfigurator = () => {
  layoutStore.setConfiguratorOpen(false);
};

// Detecta click fuera para cerrar el configurador
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
