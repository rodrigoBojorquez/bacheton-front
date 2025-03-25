<script setup lang="ts">
import { computed } from 'vue'
import AppMenuItem from './AdminMenuItem.vue';
import { useAuthStore } from '@/core/stores/authStore.ts'
import {
  mapPermissionsToMenu,
  permissionToRouteMapForPanel
} from '@/core/common/composables/authUtilities.ts'


const authStore = useAuthStore();
const menuItems = computed(() => mapPermissionsToMenu(permissionToRouteMapForPanel, authStore.accessLevel!));

</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuItems" :key="item">
      <app-menu-item :item="item" :index="i" />
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
