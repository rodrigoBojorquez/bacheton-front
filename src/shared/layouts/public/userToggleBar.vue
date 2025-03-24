<template>
  <div>
    <!-- Menú de PrimeVue en modo popup -->
    <Menu ref="menu" class="p-4 m-4" :model="items" :popup="true" />
    <Profile ref="profileRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Menu from 'primevue/menu'
import { useLogout } from '@/core/services/authService'
import { useAuthStore } from '@/core/stores/authStore'
import Profile from '@/shared/layouts/admin/Profile.vue'

const profileRef = ref<InstanceType<typeof Profile> | null>(null);
// Obtenemos el router y el store de autenticación
const router = useRouter()
const authStore = useAuthStore()
const { mutateAsync: logout } = useLogout()

// Función para cerrar sesión
const handleLogout = async (): Promise<void> => {
  await logout(undefined, {
    onSuccess: async () => {
      authStore.setAuth(false)
      authStore.setToken(null)
      await router.push({ name: 'login' })
    },
  })
}

// Definir el modelo del menú de forma reactiva según el estado de autenticación
const items = computed(() => {
  if (authStore.isAuth) {
    // Si la sesión está iniciada, mostrar Perfil y Cerrar sesión
    return [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => {
      profileRef.value?.openDialog();
    }
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => handleLogout(),
      },
    ]
  } else {
    // Si la sesión está cerrada, mostrar Iniciar sesión
    return [
      {
        label: 'Iniciar sesión',
        icon: 'pi pi-sign-in',
        command: () => router.push({ name: 'login' }),
      },
    ]
  }
})

// Referencia al menú para poder controlarlo desde el padre si es necesario
const menu = ref<InstanceType<typeof Menu> | null>(null)

// Función para alternar la visibilidad del menú
const toggleMenu = (event: MouseEvent): void => {
  menu.value?.toggle(event)
}

// Exponer la función toggleMenu al componente padre
defineExpose({ toggleMenu })
</script>
