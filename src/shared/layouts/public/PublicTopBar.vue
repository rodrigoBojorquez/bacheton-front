<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="layoutStore.toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link :to="{ name: 'home' }" class="layout-topbar-logo">
        <MyLogo />
        <span>BACHETON</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <!-- Botón Dark Mode -->
        <button type="button" class="layout-topbar-action" @click="layoutStore.toggleDarkMode">
          <i :class="['pi', { 'pi-moon': layoutStore.layoutConfig.darkTheme, 'pi-sun': !layoutStore.layoutConfig.darkTheme }]"></i>
        </button>

        <!-- Botón Configurador -->
        <div class="relative">
          <button
            @click="layoutStore.toggleConfigurator"
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
        </div>
      </div>

      <!-- Extra Menu -->
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

      <!-- Menú rápido -->
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <button type="button" class="layout-topbar-action" @click="toggleAdminMenu">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mostrar configurador solo cuando está activo -->
    <AppConfigurator v-if="layoutStore.layoutState.configuratorVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import AppConfigurator from '../AppConfigurator.vue';
import MyLogo from '../../assets/LogoBacheton.vue';

const layoutStore = useLayoutStore();
const adminToggleRef = ref<InstanceType<any> | null>(null);

const toggleAdminMenu = (event: MouseEvent): void => {
  adminToggleRef.value?.toggleMenu(event);
};
</script>

<script lang="ts">
import StyleClass from 'primevue/styleclass';

export default {
  directives: {
    styleclass: StyleClass
  }
}
</script>
