<script setup lang="ts">
import { computed } from 'vue'
import AppMenuItem from './AdminMenuItem.vue';
import { useAuthStore } from '@/core/stores/authStore.ts'
import {
  mapPermissionsToMenu,
  permissionToRouteMap
} from '@/core/common/composables/authUtilities.ts'

// interface MenuItem {
//   label: string;
//   icon?: string;
//   to?: string;
//   url?: string;
//   target?: string;
//   class?: string;
//   separator?: boolean;
//   items?: MenuItem[];
// }

// const model = ref<MenuItem[]>([
//   {
//     label: 'Home',
//     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/dashboard' }]
//   },
//   {
//         label: 'Gestión de Usuarios',
//         icon: 'pi pi-fw pi-users',
//         items: [
//           {
//             label: 'Usuarios',
//             icon: 'pi pi-fw pi-id-card',
//             to: '/admin/users'
//           },
//           {
//             label: 'Roles',
//             icon: 'pi pi-fw pi-address-book',
//             to: '/admin/roles'
//           },
//           {
//             label: 'Permisos',
//             icon: 'pi pi-fw pi-lock',
//             to: '/admin/permissions'
//           }
//         ]
//       },
//       {
//     label: 'Gestión de Sistema',
//     items: [{ label: 'Logs', icon: 'pi pi-fw pi-list', to: '/admin/logs' }]
//   }
// ]);

const authStore = useAuthStore();
const menuItems = computed(() => mapPermissionsToMenu(permissionToRouteMap, authStore.accessLevel!));

</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuItems" :key="item">
      <app-menu-item :item="item" :index="i" />
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
