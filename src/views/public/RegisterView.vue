<template>
  <div class="flex min-h-screen items-center justify-center transition-colors relative">
    <!-- Fondo dinámico para pantallas grandes -->
    <div
      class="absolute inset-0 transition-all duration-300"
      :style="{
        background: isSmallScreen
          ? 'none'
          : 'linear-gradient(-90deg, var(--blue-primary) 0%, var(--blue-light) 16%, var(--white) 55%, var(--white) 100%)',
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
      <!-- Formulario de registro -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <MyLogo class="w-20 p-2" />
          <span class="text-4xl font-bold text-[var(--text-primary-color)]">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[var(--text-secondary-color)] mt-4">Crear Cuenta</h2>
        </div>

        <!-- Usamos handleSubmit para que Vee Validate maneje la validación -->
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Campo Nombre -->
          <div>
            <label for="name" class="block text-md font-medium mb-1">Nombre <span class="text-red-500">*</span></label>
            <input
              v-model="name"
              id="name"
              type="text"
              class="w-full mt-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--blue-dark)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary-color)]"
              :class="{'border-red-500': nameError}"
              placeholder="Tu nombre"
            />
            <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
          </div>

          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-md font-medium mb-1">Correo Electrónico <span class="text-red-500">*</span></label>
            <input
              v-model="email"
              id="email"
              type="email"
              class="w-full mt-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--blue-dark)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary-color)]"
              :class="{'border-red-500': emailError}"
              placeholder="ejemplo@correo.com"
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
          </div>

          <!-- Contraseña y Confirmación -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Contraseña -->
            <div class="relative">
              <label for="password" class="block text-md font-medium mb-1">Contraseña <span class="text-red-500">*</span></label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                id="password"
                class="w-full mt-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--blue-dark)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary-color)]"
                :class="{'border-red-500': passwordError}"
                placeholder="Contraseña segura"
              />
              <!-- Ícono para mostrar/ocultar contraseña -->
              <button
                type="button"
                class="absolute right-2 top-9 text-gray-500"
                @click="toggleShowPassword"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>

              <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
            </div>

            <!-- Confirmar Contraseña -->
            <div class="relative">
              <label for="passwordConfirmation" class="block text-md font-medium mb-1">
                Confirmar Contraseña <span class="text-red-500">*</span>
              </label>
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="passwordConfirmation"
                id="passwordConfirmation"
                class="w-full mt-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--blue-dark)] outline-none bg-[var(--bg-primary)] text-[var(--text-primary-color)]"
                :class="{'border-red-500': passwordConfirmationError}"
                placeholder="Repite tu contraseña"
              />
              <!-- Ícono para mostrar/ocultar contraseña -->
              <button
                type="button"
                class="absolute right-2 top-9 text-gray-500"
                @click="toggleShowConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>

              <p v-if="passwordConfirmationError" class="text-red-500 text-sm mt-1">
                {{ passwordConfirmationError }}
              </p>
            </div>
          </div>

          <!-- Mensaje de error global -->
          <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

          <!-- Botón de envío -->
          <button
            type="submit"
            class="w-full py-2 bg-[var(--blue-dark)] text-[var(--white)] font-semibold rounded-lg hover:bg-[var(--btn-primary-bg)] transition-colors cursor-pointer"
            :disabled="isLoading"
          >
            {{ isLoading ? "Cargando..." : "Registrarse" }}
          </button>
        </form>

        <div class="text-center mt-6 text-[var(--text-subtle-color)]">
          ¿Ya tienes una cuenta?
          <router-link :to="{ name: 'login' }" class="text-[var(--link-color)] font-semibold hover:underline">
            Iniciar Sesión
          </router-link>
        </div>
      </div>

      <!-- Imagen lateral -->
      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-lg backdrop-brightness-90 backdrop-contrast-125 rounded-lg mt-10"
        style="width: 580px; height: 535px"
      >
        <img
          src="../../shared/assets/img/Login-resource.webp"
          alt="Imagen de registro"
          class="w-[500px] h-[500px] object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Ejemplo de vista de registro con validaciones de Vee Validate y Yup
 * para contraseña compleja y confirmación, e íconos de PrimeVue para
 * mostrar/ocultar contraseña.
 */

// ------------------------------
// Imports
// ------------------------------
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/core/stores/authStore.ts";

// Vee Validate & Yup
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { registerSchema } from "@/core/schemas/auth"; // Ajusta la ruta

// Composables
import { useRegister } from "@/core/services/authService.ts";
import { useGetErrorMessage } from "@/core/common/composables/errorHooks.ts";

// Componentes
import MyLogo from "../../shared/assets/LogoBacheton.vue";

// ------------------------------
// Responsividad
// ------------------------------
const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));

// ------------------------------
// Vee Validate: useForm
// ------------------------------
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

// Definimos los campos con useField
const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } = useField<string>("password");
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } =
  useField<string>("passwordConfirmation");

// ------------------------------
// Estado local y store
// ------------------------------
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref<string | null>(null);

// Para mostrar/ocultar contraseñas
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

function toggleShowConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

// ------------------------------
// Lógica de registro
// ------------------------------
const { mutate: registerUser, isPending: isLoading } = useRegister();

const onSubmit = handleSubmit(async (values) => {
  // Limpia el mensaje de error global
  errorMessage.value = null;

  // `values` incluye { name, email, password, passwordConfirmation }
  // Prepara la carga para el backend
  const payload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };

  registerUser(payload, {
    onSuccess: (res) => {
      // Guardar el token en el store
      authStore.setAuth(true);
      authStore.setToken(res.token);

      // Redirigir al dashboard (o donde necesites)
      router.push({ name: "admin-dashboard" });
    },
    onError: (err) => {
      errorMessage.value = useGetErrorMessage(err);
    },
  });
});
</script>

<style scoped>
/* Agrega estilos específicos si lo deseas */
</style>
