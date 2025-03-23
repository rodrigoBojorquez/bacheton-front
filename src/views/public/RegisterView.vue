<template>
  <div class="flex min-h-screen items-center justify-center transition-colors relative" :style="{ backgroundColor: darkMode ? surface800 : surface0 }">
    <!-- Fondo dinámico para pantallas grandes -->
    <div
      class="absolute inset-0 transition-all duration-300"
      :style="{
        background: isSmallScreen
          ? 'none'
          : darkMode
          ? `linear-gradient(90deg, ${surface800} 0%, ${surface800} 16%, ${surface800} 55%, ${primaryMain} 100%)`
          :`linear-gradient(90deg, ${surface0} 0%, ${surface0} 16%, ${surface0} 55%, ${primaryMain} 100%)`

      }"
    ></div>

    <!-- Fondo superior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: `linear-gradient(to bottom, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
        height: '15%',
        top: 0
      }"
    ></div>

    <!-- Fondo inferior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: `linear-gradient(to top, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
        height: '15%',
        bottom: 0
      }"
    ></div>

    <div class="relative z-10 flex w-full max-w-7xl justify-center rounded-lg overflow-hidden gap-x-20">
      <!-- Formulario de registro -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <MyLogo class="w-20 p-2" />
          <span class="text-4xl font-bold" :style="{ color: primaryDark }">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold mt-4" :style="{ color: surface800 }">Crear Cuenta</h2>
        </div>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Campo Nombre -->
         <!-- Campo Nombre -->
<div>
  <label for="name" class="block text-md font-medium mb-1">Nombre <span class="text-red-500">*</span></label>
  <input
    v-model="name"
    id="name"
    type="text"
    class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 outline-none"
    :class="{'border-red-500': nameError}"
    :style="{
      borderColor: surface700,
      '--tw-ring-color': primaryDark
    }"
    @keypress="blockSpecialChars"
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
    class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 outline-none"
    :class="{'border-red-500': emailError}"
    :style="{
      borderColor: surface700,
      '--tw-ring-color': primaryDark
    }"
    @keypress="blockEmailSpecialChars"
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
                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 outline-none"
                :class="{'border-red-500': passwordError}"
                :style="{
                  borderColor: surface700,
                  '--tw-ring-color': primaryDark
                }"
                placeholder="Contraseña segura"
              />
              <button type="button" class="absolute right-2 top-10 text-gray-500 cursor-pointer" @click="toggleShowPassword" tabindex="-1">
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
                class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 outline-none"
                :class="{'border-red-500': passwordConfirmationError}"
                :style="{
                  borderColor: surface700,
                  '--tw-ring-color': primaryDark
                }"
                placeholder="Repite tu contraseña"
              />
              <button type="button" class="absolute right-2 top-10 text-gray-500 cursor-pointer" @click="toggleShowConfirmPassword" tabindex="-1">
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
              <p v-if="passwordConfirmationError" class="text-red-500 text-sm mt-1">{{ passwordConfirmationError }}</p>
            </div>
          </div>

          <!-- Mensaje de error global -->
          <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

          <!-- Botón de envío -->
          <button
            type="submit"
            class="w-full py-2 font-semibold rounded-lg transition-colors cursor-pointer hover:brightness-90"
            :disabled="isLoading"
            :style="{ backgroundColor: primaryDark, color: '#fff' }"
          >
            {{ isLoading ? 'Cargando...' : 'Registrarse' }}
          </button>
        </form>

        <div class="text-center mt-6">
          <span :style="{ color: darkMode ? surface100 : surface700 }">¿Ya tienes una cuenta?</span>
          <router-link :to="{ name: 'login' }" class="font-semibold hover:underline transition-colors" :style="{ color: primaryMain }">
            Iniciar Sesión
          </router-link>
        </div>
      </div>

      <!-- Imagen lateral -->
      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-lg backdrop-brightness-90 backdrop-contrast-125 rounded-lg bg-[var(--surface-100)]"
        style="width: 580px; height: 535px"
      >
        <img
          src="../../shared/assets/img/Login-resource.webp"
          alt="Imagen de inicio de sesión"
          class="w-[500px] h-[500px] object-cover rounded-lg"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/core/stores/authStore.ts';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { primaryColors } from '@/shared/layouts/composables/layout';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { registerSchema } from '@/core/schemas/auth';
import { showAccess, useRegister } from '@/core/services/authService.ts'
import { useGetErrorMessage } from '@/core/common/composables/errorHooks.ts';
import MyLogo from '../../shared/assets/LogoBacheton.vue';

// 🔐 Bloquea caracteres especiales en nombre
function blockSpecialChars(event: KeyboardEvent) {
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]$/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
}

// 🔐 Bloquea caracteres peligrosos en email
function blockEmailSpecialChars(event: KeyboardEvent) {
  const allowedChars = /^[a-zA-Z0-9@._\-]$/;
  if (!allowedChars.test(event.key)) {
    event.preventDefault();
  }
}

// 🧼 Sanitización adicional antes de enviar
function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML.trim();
}


// Responsividad
const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

// LayoutStore para colores dinámicos
const layoutStore = useLayoutStore();
const layoutConfig = layoutStore.layoutConfig;
const darkMode = computed(() => layoutConfig.darkTheme);

// Superficies y primarios
const surfaces = [
  { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
  { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
  { name: 'zinc', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' } },
  { name: 'neutral', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' } },
  { name: 'stone', palette: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' } },
  { name: 'soho', palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' } },
  { name: 'viva', palette: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' } },
  { name: 'ocean', palette: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' } }
];

const surfacePalette = computed(() => surfaces.find(s => s.name === layoutConfig.surface)?.palette);
const primaryPalette = computed(() => primaryColors.find(c => c.name === layoutConfig.primary)?.palette);

const surface700 = computed(() => surfacePalette.value?.['700'] || '#374151');
const surface800 = computed(() => surfacePalette.value?.['800'] || '#1f2937');
const surface100 = computed(() => surfacePalette.value?.['100'] || '#f1f5f9');
const surface0 = computed(() => surfacePalette.value?.['0'] || '#ffffff');
const primaryMain = computed(() => primaryPalette.value?.['500'] || '#0ea5e9');
const primaryLight = computed(() => primaryPalette.value?.['300'] || '#7dd3fc');
const primaryDark = computed(() => primaryPalette.value?.['400'] || '#0369a1');

// Vee Validate
const { handleSubmit } = useForm({ validationSchema: toTypedSchema(registerSchema) });
const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: password, errorMessage: passwordError } = useField<string>('password');
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } = useField<string>('passwordConfirmation');

// Auth y registro
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref<string | null>(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

function toggleShowConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

const { mutate: registerUser, isPending: isLoading } = useRegister();

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null;
  const sanitizedName = sanitizeInput(values.name);
  const sanitizedEmail = sanitizeInput(values.email);

  const payload = {
    name: sanitizedName,
    email: sanitizedEmail,
    password: values.password
  };

  registerUser(payload, {
    onSuccess: async (res) => {
      authStore.setAuth(true);
      const accessLevel = await showAccess();
      authStore.setToken(res.token);
      await router.push(accessLevel.rootPath);
    },
    onError: (err) => {
      errorMessage.value = useGetErrorMessage(err);
    }
  });
});

</script>

