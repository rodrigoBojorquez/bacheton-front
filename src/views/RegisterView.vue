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
      <!-- Imagen lateral -->


      <!-- Formulario de registro -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <RouterLink :to="{ name: 'home' }" class="flex gap-2 justify-center items-center">
          <img src="../shared/assets/img/Logo-Bacheton.svg" alt="Logo" class="w-24 h-24" />
          <span class="text-4xl font-bold text-[var(--text-primary-color)]">BACHETON</span>
        </RouterLink>

        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-[var(--text-secondary-color)] mt-4">Crear Cuenta</h2>
        </div>

        <form class="space-y-6">
          <FormInput id="name" type="text" label="Nombre" placeholder="Tu nombre" required />
          <FormInput id="email" type="email" label="Correo Electrónico" placeholder="ejemplo@correo.com" required />
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-4">
          <FormInput id="password" type="password" label="Contraseña" placeholder="Contraseña segura" required />
          <FormInput id="passwordConfirmation" type="password" label="Confirmar Contraseña" placeholder="Repite tu contraseña" required />
        </div>
      </div>
          <button
            type="submit"
            class="w-full py-2 bg-[var(--blue-dark)] text-[var(--white)] font-semibold rounded-lg hover:bg-[var(--btn-primary-bg)] transition-colors cursor-pointer"
          >
            Registrarse
          </button>
        </form>

        <div class="text-center mt-6 text-[var(--text-subtle-color)]">
          ¿Ya tienes una cuenta?
          <router-link :to="{ name: 'login' }" class="text-[var(--link-color)] font-semibold hover:underline">
            Iniciar Sesión
          </router-link>
        </div>
      </div>
      <div
        class="hidden lg:flex items-center justify-center shadow-lg backdrop-blur-lg backdrop-brightness-90 backdrop-contrast-125 rounded-lg mt-10"
        style="width: 580px; height: 535px"
      >
        <img
          src="../shared/assets/img/Login-resource.webp"
          alt="Imagen de registro"
          class="w-[500px] h-[500px] object-cover rounded-lg"
        />
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
