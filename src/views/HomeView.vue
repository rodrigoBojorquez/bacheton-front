<template>
  <div class="flex flex-col max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-6 space-y-12">

    <!-- Sección Banner-->
    <section class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <h1 class="font-bold text-3xl md:text-4xl mb-4 text-blue-800">Bacheton</h1>
            <h4 class="font-medium text-xl mb-6 text-gray-700">
              Transformando las calles de nuestra ciudad
            </h4>
            <p class="font-normal text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Únete a nuestra iniciativa para mejorar la seguridad vial y la calidad de vida en nuestra comunidad.
              Reporta baches y contribuye a un cambio positivo. Juntos podemos crear un entorno urbano más seguro y
              agradable
              para todos.
            </p>
          </div>
          <div class="mt-4 md:mt-6">
            <Button class="w-full md:w-auto text-base font-medium" size="large">
              Reportar un Bache
            </Button>
          </div>
        </div>

        <!-- Imagen del banner -->
        <div class="md:w-1/2 order-first md:order-last">
          <div class="h-64 sm:h-80 md:h-full">
            <img src="https://cdn1.matadornetwork.com/blogs/2/2018/04/Donceles-Ciudad-de-M%C3%A9xico.jpg"
              alt="Calles de México" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Beneficios -->
    <section class="bg-white rounded-xl shadow-lg p-6 md:p-10">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
        Beneficios de unirte a Bacheton
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="(beneficio, index) in beneficios" :key="index" class="flex items-start space-x-5">
          <div class="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center flex-shrink-0">
            <i :class="[beneficio.icon, 'text-2xl']" </i>
          </div>
          <div>
            <h5 class="text-lg font-bold text-gray-800 mb-2">{{ beneficio.title }}</h5>
            <p class="text-gray-600 leading-relaxed">{{ beneficio.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Pasos-->
    <section class="bg-[#5087F7] text-white py-10 px-6 md:px-10 rounded-xl shadow-lg">
      <h2 class="text-2xl md:text-3xl font-bold text-center mb-6">
        Cómo reportar un bache en 3 sencillos pasos
      </h2>
      <p class="text-center mb-10 text-lg mx-auto">
        Sigue esta guía para contribuir a la mejora de nuestras calles de manera rápida y efectiva.
      </p>
      <div class="max-w-4xl mx-auto space-y-8">
        <div v-for="(paso, index) in pasos" :key="index"
          class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 rounded-xl">
          <div class="bg-white p-5 rounded-full flex-shrink-0 shadow-md">
            <i :class="[paso.icon, 'text-blue-600 text-3xl']"></i>
          </div>
          <div>
            <h5 class="text-xl font-semibold text-white mb-2 text-center sm:text-left">{{ paso.title }}</h5>
            <p class="text-blue-50 text-base leading-relaxed">{{ paso.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Funcionalidades con cards mejoradas -->
    <section class="bg-gray-50 rounded-xl shadow-lg p-6 md:p-10">
      <div class="mb-8 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
          Explora nuestras funcionalidades
        </h2>
        <p class="mt-3 text-gray-600  mx-auto">
          Descubre las herramientas que te ayudarán a mejorar tu comunidad
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(funcionalidad, index) in funcionalidades" :key="index" class="h-full">
          <Card class="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <template #header>
              <div class="bg-blue-100 h-48 flex items-center justify-center">
                <i :class="['text-5xl text-blue-600', funcionalidad.icon || 'pi pi-map']"></i>
              </div>
            </template>
            <template #title>
              <h5 class="text-xl font-bold text-gray-800">{{ funcionalidad.title }}</h5>
            </template>
            <template #content>
              <p class="text-gray-600 leading-relaxed">
                {{ funcionalidad.description }}
              </p>
            </template>
          </Card>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';
import Card from 'primevue/card';

// Información de Beneficios
const beneficios = ref([
  {
    icon: "pi pi-shield",
    title: "Seguridad vial mejorada",
    description:
      "Reducimos los accidentes causados por baches, asegurando un tránsito más seguro para todos.",
  },
  {
    icon: "pi pi-users",
    title: "Comunidad activa",
    description:
      "Fomentamos la participación ciudadana, creando un sentido de pertenencia y responsabilidad.",
  },
  {
    icon: "pi pi-clock",
    title: "Respuesta rápida",
    description:
      "Nuestro sistema garantiza una atención eficiente a los reportes, minimizando los tiempos de resolución.",
  },
  {
    icon: "pi pi-star",
    title: "Impacto positivo",
    description:
      "Cada reporte contribuye a mejorar la infraestructura y la calidad de vida en la ciudad.",
  },
]);

// Información de Pasos
const pasos = ref([
  {
    icon: "pi pi-user-plus",
    title: "Regístrate",
    description:
      "Crea una cuenta en Bacheton para empezar a reportar baches y seguir su progreso.",
  },
  {
    icon: "pi pi-camera",
    title: "Reporta el bache",
    description:
      "Describe la ubicación y el estado del bache, y adjunta una foto para mayor precisión.",
  },
  {
    icon: "pi pi-refresh",
    title: "Sigue el progreso",
    description:
      "Recibe actualizaciones sobre el estado de tu reporte y contribuye a la transparencia del proceso.",
  },
]);

// Información de Funcionalidades
const funcionalidades = ref([
  {
    icon: "pi pi-map",
    title: "Mapa de baches",
    description:
      "Visualiza los baches reportados en tiempo real y encuentra las zonas más afectadas de tu ciudad.",
  },
  {
    icon: "pi pi-chart-bar",
    title: "Estadísticas",
    description:
      "Accede a datos clave sobre los reportes y su resolución. Monitorea el progreso de tu comunidad.",
  },
  {
    icon: "pi pi-book",
    title: "Guías de uso",
    description:
      "Aprende a utilizar todas las herramientas de Bacheton con nuestras guías paso a paso y tutoriales interactivos.",
  },
]);
</script>