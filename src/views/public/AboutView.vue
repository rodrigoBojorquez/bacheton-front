<template>
  <PublicTopBar />
  <div class="flex flex-col font-[var(--font-poppins)] space-y-[100px]">
    <!-- Hero Section (sin cambios) -->
    <section
      class="relative bg-cover h-150 flex items-center justify-center text-[var(--white)]"
      :style="{ backgroundImage: `url(${hero})`, backgroundPosition: 'center bottom' }"
    >
      <!-- Capa superpuesta -->
      <div class="absolute inset-0 bg-(--blue-primary-opacity)"></div>
      <div class="relative z-10 text-center px-4">
        <p class="text-[2rem] md:text-[4rem] font-bold text-white">
  Bienvenidos a <br />Bacheton
        </p>
        <p class="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
          Una plataforma dedicada a mejorar la calidad de vida en nuestra ciudad
          mediante la gestión eficiente de baches.
        </p>
      </div>
    </section>

    <!-- Sección Nuestra historia con animación -->
    <section class="mx-25 px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Columna Izquierda (texto de historia) -->
        <div v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000' }">
          <small class="block text-[var(--blue-primary)] font-semibold uppercase tracking-wide">
            Nuestra historia
          </small>
          <h1 class="text-4xl md:text-3xl font-bold text-[var(--text-primary)] mt-2">
            Desde el inicio hasta hoy
          </h1>
          <p class="mt-4 text-2xl text-[var(--gray)] leading-relaxed">
            Bacheton nació de la urgente necesidad de mejorar las condiciones de las calles de nuestra ciudad, brindando seguridad y comodidad a peatones y conductores. Lo que comenzó como una iniciativa para atender un problema cotidiano, rápidamente evolucionó en un proyecto integral que busca transformar la infraestructura vial mediante acciones eficientes y sostenibles. Desde entonces, hemos trabajado incansablemente para desarrollar soluciones innovadoras, optimizar procesos y fomentar la participación ciudadana, asegurando así un impacto positivo y duradero en nuestra comunidad.
          </p>
        </div>

        <!-- Columna Derecha (beneficios o pilares) -->
        <div v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000' }">
          <div class="flex gap-4 items-center">
            <i class="pi pi-cog" style="color: var(--blue-primary); font-size: 2.5rem;"></i>
            <div>
              <h3 class="font-semibold text-lg text-[var(--text-primary)]">Gestión Eficiente</h3>
              <p class="text-[var(--text-primary)]">
                Optimiza los recursos en la reparación y repavimentación de calles para agilizar la solución de problemas.
              </p>
            </div>
          </div>

          <div class="flex gap-4 mt-12 items-center">
            <i class="pi pi-users" style="color: var(--blue-primary); font-size: 2.5rem;"></i>
            <div>
              <h3 class="font-semibold text-lg text-[var(--text-primary)]">Participación Comunitaria</h3>
              <p class="text-[var(--text-primary)]">
                Involucra a los ciudadanos en la identificación y solución de baches para fomentar compromiso y colaboración.
              </p>
            </div>
          </div>

          <div class="flex gap-4 mt-12 items-center">
            <i class="pi pi-chart-line" style="color: var(--blue-primary); font-size: 2.5rem;"></i>
            <div>
              <h3 class="font-semibold text-lg text-[var(--text-primary)]">Impacto Medible</h3>
              <p class="text-[var(--text-primary)]">
                Monitoreamos y reportamos el progreso en la mejora de las condiciones viales, garantizando transparencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="px-4 py-8 bg-gradient-to-b from-[var(--blue-primary)] to-[var(--blue-light)]">
  <div class="max-w-7xl mx-auto">

    <h2
      class="text-3xl md:text-4xl font-bold text-white text-center mb-2"
      v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
    >
      Nuestro Equipo
    </h2>
    <p
      class="text-white text-center mb-6"
      v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }"
    >
      Conoce al equipo apasionado que está detrás de Bacheton, trabajando cada día para mejorar nuestra ciudad.
    </p>

    <!-- Contenedor modificado para scroll horizontal -->
    <div class="flex flex-nowrap gap-8 overflow-x-auto">
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000' }"
        class="max-w-[240px] w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center gap-2"
      >
        <div class="w-full h-36 bg-gray-200 rounded mb-4">
          <img
            src="@/shared/assets/img/perfil.jpg"
            alt="Foto de perfil"
            class="w-full h-36 object-cover rounded mb-4"
          />
        </div>
        <h3 class="text-base font-bold text-[var(--text-primary)]">
          Andres Garcia Leyva
        </h3>
        <p class="text-sm text-gray-500">
          Desarrollador Fullstack
        </p>
      </div>
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000' }"
        class="max-w-[240px] w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center gap-2"
      >
        <div class="w-full h-36 bg-gray-200 rounded mb-4">
          <img
            src="@/shared/assets/img/perfil.jpg"
            alt="Foto de perfil"
            class="w-full h-36 object-cover rounded mb-4"
          />
        </div>
        <h3 class="text-base font-bold text-[var(--text-primary)]">
          Andres Garcia Leyva
        </h3>
        <p class="text-sm text-gray-500">
          Desarrollador Fullstack
        </p>
      </div>
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000' }"
        class="max-w-[240px] w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center gap-2"
      >
        <div class="w-full h-36 bg-gray-200 rounded mb-4">
          <img
            src="@/shared/assets/img/perfil.jpg"
            alt="Foto de perfil"
            class="w-full h-36 object-cover rounded mb-4"
          />
        </div>
        <h3 class="text-base font-bold text-[var(--text-primary)]">
          Andres Garcia Leyva
        </h3>
        <p class="text-sm text-gray-500">
          Desarrollador Fullstack
        </p>
      </div>
      <div
        v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-r-8 animate-duration-1000' }"
        class="max-w-[240px] w-full bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center gap-2"
      >
        <div class="w-full h-36 bg-gray-200 rounded mb-4">
          <img
            src="@/shared/assets/img/perfil.jpg"
            alt="Foto de perfil"
            class="w-full h-36 object-cover rounded mb-4"
          />
        </div>
        <h3 class="text-base font-bold text-[var(--text-primary)]">
          Andres Garcia Leyva
        </h3>
        <p class="text-sm text-gray-500">
          Desarrollador Fullstack
        </p>
      </div>

      <!-- Repite los demás elementos de la misma manera -->
      <!-- ... -->
    </div>

  </div>
</section>




  </div>
</template>

<script setup lang="ts">
import hero from '@/shared/assets/img/hero.jpg'
import PublicTopBar from '@/shared/layouts/public/PublicTopBar.vue'
import Avatar from 'primevue/avatar'
</script>
<style scoped>
  .hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>º

