<template>
  <div class="flex min-h-screen items-center justify-center transition-colors relative">
    <!-- Fondo dinámico para pantallas grandes -->
    <div
      class="absolute inset-0 transition-all duration-300"
      :style="{
        background: isSmallScreen
          ? 'none'
          : 'linear-gradient(90deg, var(--blue-primary) 0%, var(--blue-light) 16%, var(--white) 55%, var(--white) 100%)',
      }"
    ></div>

    <!-- Fondo superior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: 'linear-gradient(to bottom, var(--blue-primary) 0%, var(--blue-light) 20%, transparent 100%)',
        height: '15%',
        top: 0
      }"
    ></div>

    <!-- Fondo inferior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: 'linear-gradient(to top, var(--blue-primary) 0%, var(--blue-light) 20%, transparent 100%)',
        height: '15%',
        bottom: 0
      }"
    ></div>

    <div class="relative z-10 flex w-full max-w-7xl justify-center rounded-lg overflow-hidden gap-x-20">
      <!-- Imagen lateral -->
      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-lg backdrop-brightness-90 backdrop-contrast-125 rounded-lg"
        style="width: 580px; height: 535px"
      >
        <img
          src="../../shared/assets/img/Login-resource.webp"
          alt="Imagen de inicio de sesión"
          class="w-[500px] h-[500px] object-cover rounded-lg"
        />
      </div>

      <!-- Formulario de inicio de sesión -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <MyLogo class="w-20 p-2" />
          <span class="text-4xl font-bold text-[var(--text-primary-color)]">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[var(--text-secondary-color)] mt-4">Iniciar Sesión</h2>
        </div>

        <!-- Usamos @submit.prevent="onSubmit" para que VeeValidate maneje la validación -->
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Campos usando defineField -->
          <FormInput
            v-model="email"
            :errorMessage="errors.email"
            id="email"
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            required
          />
          <FormInput
            v-model="password"
            :errorMessage="errors.password"
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Contraseña"
            required
          />

          <!-- Mensaje de error proveniente del backend (ej. credenciales inválidas) -->
          <p v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 bg-[var(--blue-dark)] text-[var(--white)] font-semibold rounded-lg hover:bg-[var(--btn-primary-bg)] transition-colors cursor-pointer"
          >
            {{ isLoading ? "Cargando..." : "Iniciar Sesión" }}
          </button>
        </form>

        <div class="text-center mt-6 text-[var(--text-subtle-color)]">
          ¿Aún no tienes cuenta?
          <router-link :to="{ name: 'register' }" class="text-[var(--link-color)] font-semibold hover:underline">
            Registrarse
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Aquí integramos:
 * 1. Manejo de responsividad (screenWidth, isSmallScreen)
 * 2. Manejo de validación (vee-validate, Yup)
 * 3. Lógica de login (useLogin, Pinia store, etc.)
 */

import { ref, computed, onMounted, onUnmounted } from "vue";

// ---- Vee Validate & Yup ----
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { loginSchema } from "@/core/schemas/auth.ts";

// ---- Vue Router ----
import { useRouter } from "vue-router";

// ---- Composables y Stores propios ----
import { useLogin } from "@/core/services/authService.ts";
import { useGetErrorMessage } from "@/core/common/composables/errorHooks.ts";
import { useAuthStore } from "@/core/stores/authStore.ts";

// ---- Componente Input reutilizable ----
import FormInput from "@/shared/components/FormInput.vue";
import MyLogo from '../../shared/assets/LogoBacheton.vue';

// -----------------------------------------------------------
// 1. Manejo de la pantalla (responsividad)
// -----------------------------------------------------------
const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

// -----------------------------------------------------------
// 2. Configuración de Vee Validate (Esquema de validación Yup)
// -----------------------------------------------------------
const { errors, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

// defineField crea campos reactivos con sus validaciones
// Extraemos cada campo para usarlo en v-model
const [email] = defineField("email");
const [password] = defineField("password");

// -----------------------------------------------------------
// 3. Lógica de autenticación
// -----------------------------------------------------------
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref<string | null>(null);

// useLogin: composable que maneja la llamada al backend
const { mutate: login, isPending: isLoading } = useLogin();

/**
 * onSubmit se encarga de:
 *  - Validar el formulario (gracias a handleSubmit)
 *  - Llamar a login(...) si es válido
 */
const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null; // Limpiamos errores previos

  login(values, {
    onSuccess: () => {
      authStore.setAuth(true); // Marcamos que el usuario está autenticado
      router.push({ name: "admin-dashboard" });
    },
    onError: (error) => {
      errorMessage.value = useGetErrorMessage(error); // Mensaje de error del backend
    },
  });
});

// -----------------------------------------------------------
// 4. Ciclo de vida: onMounted / onUnmounted
// -----------------------------------------------------------
onMounted(() => {
  // Si ya está autenticado, redireccionamos a home
  if (authStore.isAuth) {
    router.push({ name: "admin-dashboard" });
  }

  // Detectamos el resize para cambiar dinámicamente el fondo
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
