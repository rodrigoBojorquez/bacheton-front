<template>
  <!-- Topbar -->
  <div class="layout-topbar relative flex items-center px-4 h-14">
    <!-- Sección Izquierda: Logo (solo visible en md o superior) -->
    <div class="hidden  sm:hidden md:flex  items-center">
      <router-link :to="{ name: 'home' }" class="layout-topbar-logo">
        <MyLogo />
        <span>BACHETON</span>
      </router-link>
    </div>

    <!-- Navegación de escritorio: visible desde md en adelante -->
    <div class="hidden md:flex flex-1 items-center text-pr justify-center gap-8">
      <!-- Enlaces de navegación (Inicio, Sobre Nosotros, etc.) -->
      <router-link
        :to="{ name: 'home' }"
        class="flex items-center gap-2"
        :class="{ 'active-tab': route.name === 'home' }"
      >
        <i class="pi pi-home text-2xl md:text-3xl text-primary"></i>
        <span class="hidden md:inline-block text-lg md:text-xl">Inicio</span>
      </router-link>

      <router-link
        :to="{ name: 'about' }"
        class="flex items-center gap-2"
        :class="{ 'active-tab': route.name === 'about' }"
      >
        <i class="pi pi-info-circle text-2xl md:text-3xl text-primary"></i>
        <span class="hidden md:inline-block text-lg md:text-xl">Sobre Nosotros</span>
      </router-link>

      <router-link
        v-if="authStore.isAuth"
        :to="{ name: 'report' }"
        class="flex items-center gap-2"
        :class="{ 'active-tab': route.name === 'report' }"
      >
        <i class="pi pi-file text-2xl md:text-3xl text-primary"></i>
        <span class="hidden md:inline-block text-lg md:text-xl">Reportes</span>
      </router-link>

      <router-link
        v-if="canAccessMap"
        :to="{ name: 'app-monitoring' }"
        class="flex items-center gap-2"
        :class="{ 'active-tab': route.name === 'app-monitoring' }"
      >
        <i class="pi pi-map text-2xl md:text-3xl text-primary"></i>
        <span class="hidden md:inline-block text-lg md:text-xl">Mapa</span>
      </router-link>

      <router-link
        v-if="canAccessPanel"
        :to="{ name: 'dashboard' }"
        class="flex items-center gap-2"
        :class="{ 'active-tab': route.name === 'dashboard' }"
      >
        <i class="pi pi-th-large text-2xl md:text-3xl text-primary"></i>
        <span class="hidden md:inline-block text-lg md:text-xl">Panel</span>
      </router-link>
    </div>

    <!-- Botón de menú móvil: visible solo en móvil -->
    <!-- NOTA: Usamos 'justify-start' en vez de 'justify-left' -->
    <div class="flex md:hidden justify-start flex-1">
      <button @click="toggleMobileMenu" class="text-primary focus:outline-none">
        <i class="pi" :class="mobileMenuOpen ? 'pi-times text-2xl' : 'pi-bars text-2xl'"></i>
      </button>
    </div>

    <!-- Acciones del Topbar (se mantienen siempre visibles) -->
    <div class="layout-topbar-actions flex items-center gap-4 flex-none">
      <div class="layout-config-menu flex items-center gap-2">
        <!-- Botón Modo Oscuro -->
        <button type="button" class="layout-topbar-action" @click="layoutStore.toggleDarkMode">
          <i
            :class="[
              'pi',
              { 'pi-moon': layoutStore.layoutConfig.darkTheme, 'pi-sun': !layoutStore.layoutConfig.darkTheme }
            ]"
          ></i>
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

      <!-- Menú Rápido (otros botones) -->
      <div class="flex items-center space-x-2">
        <div v-if="authStore.isAuth">
          <div class="text-md text-primary font-semibold">{{ authStore.userName }}</div>
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
  </div>

  <!-- Menú de navegación móvil desplegable a la izquierda -->
  <transition name="fade">
    <div
      v-if="mobileMenuOpen"
      class="md:hidden absolute top-14 left-0 w-64 shadow-lg z-50
             max-h-[calc(100vh-3.5rem)] overflow-y-auto"
             :class="layoutStore.layoutConfig.darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
    >
      <div class="flex flex-col gap-4 p-4">
        <router-link
          @click="toggleMobileMenu"
          :to="{ name: 'home' }"
          class="flex items-center gap-2"
          :class="{ 'active-tab': route.name === 'home' }"
        >
          <i class="pi pi-home text-2xl text-primary"></i>
          <span class="text-lg">Inicio</span>
        </router-link>

        <router-link
          @click="toggleMobileMenu"
          :to="{ name: 'about' }"
          class="flex items-center gap-2"
          :class="{ 'active-tab': route.name === 'about' }"
        >
          <i class="pi pi-info-circle text-2xl text-primary"></i>
          <span class="text-lg">Sobre Nosotros</span>
        </router-link>

        <router-link
          v-if="authStore.isAuth"
          @click="toggleMobileMenu"
          :to="{ name: 'report' }"
          class="flex items-center gap-2"
          :class="{ 'active-tab': route.name === 'report' }"
        >
          <i class="pi pi-file text-2xl text-primary"></i>
          <span class="text-lg">Reportes</span>
        </router-link>

        <router-link
          v-if="canAccessMap"
          @click="toggleMobileMenu"
          :to="{ name: 'app-monitoring' }"
          class="flex items-center gap-2"
          :class="{ 'active-tab': route.name === 'app-monitoring' }"
        >
          <i class="pi pi-map text-2xl text-primary"></i>
          <span class="text-lg">Mapa</span>
        </router-link>

        <router-link
          v-if="canAccessPanel"
          @click="toggleMobileMenu"
          :to="{ name: 'dashboard' }"
          class="flex items-center gap-2"
          :class="{ 'active-tab': route.name === 'dashboard' }"
        >
          <i class="pi pi-th-large text-2xl text-primary"></i>
          <span class="text-lg">Panel</span>
        </router-link>
      </div>
    </div>
  </transition>

  <AppConfigurator
  ref="configPanelRef"
  v-show="layoutStore.isConfiguratorOpen"
  @closeConfigurator="closeConfigurator"
/>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import AppConfigurator from '../AppConfigurator.vue';
import AdminToggle from './userToggleBar.vue';
import MyLogo from '../../assets/LogoBacheton.vue';
import { useAuthStore } from '@/core/stores/authStore';

const authStore = useAuthStore();
const route = useRoute();
const layoutStore = useLayoutStore();

const adminToggleRef = ref<InstanceType<typeof AdminToggle> | null>(null);
const configPanelRef = ref<InstanceType<typeof AppConfigurator> | null>(null);
const configButtonRef = ref<HTMLButtonElement | null>(null);

// Estado para controlar el menú móvil
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const canAccessMap = computed(() => {
  const permissions = authStore.permissions;
  return permissions.includes("superAdmin:Administracion") || permissions.includes("monitoring:Reportes");
});

const canAccessPanel = computed(() => {
  const permissions = authStore.permissions;
  return permissions.includes("superAdmin:Administracion");
});

const toggleAdminMenu = (event: MouseEvent): void => {
  adminToggleRef.value?.toggleMenu(event);
};

const toggleConfigurator = () => {
  layoutStore.setConfiguratorOpen(!layoutStore.isConfiguratorOpen);
};

const closeConfigurator = () => {
  layoutStore.setConfiguratorOpen(false);
};

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

<style scoped>
.active-tab {
  border-bottom: 2px solid currentColor;
  color: currentColor;
}

/* Transición para el menú móvil */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
