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
          src="../shared/assets/img/Login-resource.webp"
          alt="Imagen de inicio de sesión"
          class="w-[500px] h-[500px] object-cover rounded-lg"
        />
      </div>

      <!-- Formulario de inicio de sesión -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <img src="../shared/assets/img/Logo-Bacheton.svg" alt="Logo" class="w-24 h-24" />
          <span class="text-4xl font-bold text-[var(--text-primary-color)]">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[var(--text-secondary-color)] mt-4">Iniciar Sesión</h2>
        </div>

        <form class="space-y-6">
          <FormInput id="username" type="text" label="Usuario o Correo" placeholder="Nombre de usuario o correo electrónico" required />
          <FormInput id="password" type="password" label="Contraseña" placeholder="Contraseña" required />

          <button
            type="submit"
            class="w-full py-2 bg-[var(--blue-dark)] text-[var(--white)] font-semibold rounded-lg hover:bg-[var(--btn-primary-bg)] transition-colors cursor-pointer"
          >
            Iniciar Sesión
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import FormInput from "@/shared/components/FormInput.vue";

const screenWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => screenWidth.value < 1024);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
