<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link :to="{ name: 'dashboard' }" class="layout-topbar-logo">

        <MyLogo />
                <span>BACHETON</span>
            </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <div class="relative">
          <button
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
          <AppConfigurator />
        </div>
      </div>

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

      <!-- Botón Profile que dispara el menú de AdminToggle -->
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">

          <!-- Otros botones, por ejemplo, Calendar o Messages -->
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

      <!-- Se monta el componente AdminToggle -->
      <AdminToggle ref="adminToggleRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLayout } from '../composables/layout';
import AppConfigurator from '../AppConfigurator.vue';
import AdminToggle from './AdminToggle.vue';
import MyLogo from '../../assets/LogoBacheton.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const adminToggleRef = ref<InstanceType<typeof AdminToggle> | null>(null);

// Función para mostrar el menú de AdminToggle al hacer clic en "Profile"
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

