<template>
  <div>
    <!-- Menú de PrimeVue en modo popup -->
    <Menu ref="menu" class="p-4 m-4" :model="items" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import { useLogout } from '@/core/services/authService.ts';
import { useAuthStore } from '@/core/stores/authStore.ts';

const router = useRouter();
const authStore = useAuthStore();
const { mutateAsync: logout } = useLogout();

// Función para manejar el cierre de sesión
const handleLogout = async (): Promise<void> => {
  await logout(undefined, {
    onSuccess: async () => {
      authStore.setAuth(false);
      authStore.setToken(null);
      await router.push({ name: "login" });
    },
  });
};

// Definición de los items del menú, incluyendo la funcionalidad de cierre de sesión
const items = [
  {
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => {
      router.push('/perfil'); // Ajusta la ruta según tu configuración
    }
  },
  {
    label: 'Cerrar sesión',
    icon: 'pi pi-sign-out',
    command: () => {
      handleLogout();
    }
  }
];

const menu = ref<InstanceType<typeof Menu> | null>(null);

// Función para alternar la visibilidad del menú
const toggleMenu = (event: MouseEvent): void => {
  menu.value?.toggle(event);
};

// Exponer la función para que el componente padre pueda acceder a ella
defineExpose({ toggleMenu });
</script>
