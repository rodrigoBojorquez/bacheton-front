<template>
  <div class="flex min-h-screen items-center justify-center transition-colors relative" :style="{ backgroundColor: darkMode ? surface800 : surface0 }">

    <!-- Fondo dinámico para pantallas grandes -->
    <div
      class="absolute inset-0 transition-all duration-300"
      :style="{
        background: isSmallScreen
          ? 'none'
          : darkMode
          ? `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 16%, ${surface800} 55%, ${surface800} 100%)`
          :`linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 16%, ${surface0} 55%, ${surface0} 100%)`

      }"
    ></div>

    <!-- Fondo superior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: darkMode
          ? `linear-gradient(to bottom, ${surface700} 0%, ${surface700} 20%, transparent 100%)`
          : `linear-gradient(to bottom, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
        height: '15%',
        top: 0
      }"
    ></div>

    <!-- Fondo inferior para pantallas pequeñas -->
    <div
      v-if="isSmallScreen"
      class="absolute left-0 right-0 transition-all duration-300"
      :style="{
        background: darkMode
          ? `linear-gradient(to top, ${surface700} 0%, ${surface700} 20%, transparent 100%)`
          : `linear-gradient(to top, ${primaryMain} 0%, ${primaryLight} 20%, transparent 100%)`,
        height: '15%',
        bottom: 0
      }"
    ></div>

    <div class="relative z-10 flex w-full max-w-7xl justify-center rounded-lg overflow-hidden gap-x-20">
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

      <!-- Formulario de inicio de sesión -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <MyLogo class="w-20 p-2" />
          <span class="text-4xl font-bold" :style="{ color: primaryDark }">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold mt-4" :style="{ color: darkMode ? surface100 : surface800 }">Iniciar Sesión</h2>
        </div>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <FormInput
            v-model="email"
            :errorMessage="errors.email"
            id="email"
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            required
            @keypress="blockEmailSpecialChars"
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

          <p v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 font-semibold rounded-lg cursor-pointer hover:brightness-90 transition-all"
            :style="{ backgroundColor: primaryDark, color: '#fff' }"
          >
            {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="text-center mt-6">
          <span :style="{ color: darkMode ? surface100 : surface700 }"> ¿Aún no tienes cuenta?</span>
          <router-link :to="{ name: 'register' }" class="font-semibold hover:underline hover:brightness-90 transition-all" :style="{ color: primaryMain }">
            Registrarse
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { loginSchema } from '@/core/schemas/auth.ts';
import { useRouter } from 'vue-router';
import { showAccess, useLogin } from '@/core/services/authService.ts';
import { useGetErrorMessage } from '@/core/common/composables/errorHooks.ts';
import { useAuthStore } from '@/core/stores/authStore.ts';
import FormInput from '@/shared/components/FormInput.vue';
import MyLogo from '../../shared/assets/LogoBacheton.vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { primaryColors } from '@/shared/layouts/composables/layout';

// Bloquea caracteres no válidos en el email al escribir
function blockEmailSpecialChars(event: KeyboardEvent) {
  const allowedChars = /^[a-zA-Z0-9@._\-]$/;
  if (!allowedChars.test(event.key)) {
    event.preventDefault();
  }
}

// Sanitiza el input antes de enviar
function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML.trim();
}


const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

const layoutStore = useLayoutStore();
const layoutConfig = layoutStore.layoutConfig;
const darkMode = computed(() => layoutConfig.darkTheme);

// Superficie y primario
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


const surfacePalette = computed(() => {
  return surfaces.find(s => s.name === layoutConfig.surface)?.palette;
});

const primaryPalette = computed(() => {
  return primaryColors.find(c => c.name === layoutConfig.primary)?.palette;
});

const surface700 = computed(() => surfacePalette.value?.['700'] || '#374151');
const surface800 = computed(() => surfacePalette.value?.['800'] || '#1f2937');
const surface100 = computed(() => surfacePalette.value?.['100'] || '#f1f5f9');
const surface0 = computed(() => surfacePalette.value?.['0'] || '#ffffff');

const primaryMain = computed(() => primaryPalette.value?.['500'] || '#0ea5e9');
const primaryLight = computed(() => primaryPalette.value?.['300'] || '#7dd3fc');
const primaryDark = computed(() => primaryPalette.value?.['400'] || '#0369a1');

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});
const [email] = defineField('email');
const [password] = defineField('password');

const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref<string | null>(null);
const { mutate: login, isPending: isLoading } = useLogin();

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null;

  // Sanitizamos el email antes de enviar
  const sanitizedEmail = sanitizeInput(values.email);

  login({ ...values, email: sanitizedEmail }, {
    onSuccess: async () => {
      const accessLevel = await showAccess();
      authStore.setAuth(true);
      await router.push(accessLevel.rootPath);
    },
    onError: (error) => {
      errorMessage.value = useGetErrorMessage(error);
    },
  });
});


onMounted(() => {
  if (authStore.isAuth) {
    router.push({ name: 'dashboard' });
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
