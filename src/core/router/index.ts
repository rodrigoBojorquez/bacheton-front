import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from "@/core/stores/authStore.ts";
import {watch} from "vue";
import {storeToRefs} from "pinia";
import authRoutes from "@/core/router/authRoutes.ts";
import publicRoutes from "@/core/router/publicRoutes.ts";
import adminRoutes from "@/core/router/adminRoutes.ts";
import userRoutes from "@/core/router/userRoutes.ts";
/* import {isSuperAdmin} from "@/core/common/composables/authUtilities.ts"; */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...publicRoutes,
    ...adminRoutes,
    ...userRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/shared/errors/Error404View.vue"),
    },
  ],
})

export default router

router.beforeEach (async (to) => {
  const authStore = useAuthStore();
  const { loading, isAuth } = storeToRefs(authStore);

  // Esperar a que el estado de carga termine antes de continuar con la navegación
  if (loading.value) {
    await new Promise(resolve => {
      watch(loading, (newValue) => {
        if (!newValue) resolve(true);
      }, { once: true });
    });
  }

  // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
  if (to.meta.requiresAuth && !isAuth.value) {
    return { name: "login" };
  }
/*
  if (to.meta.requiresAdminAccess) {
    if (!isSuperAdmin())
      return { name: "not-found" };
  } */
});

router.afterEach((to) => {
  document.title = to.meta.title ? `Bacheton - ${to.meta.title as string}` : "Bacheton - App"
})
