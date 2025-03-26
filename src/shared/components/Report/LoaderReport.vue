<template>
  <div class="progress-container p-4">
    <ProgressBar :value="progress" style="height: 20px" />
    <div class="progress-message text-center mt-2 text-lg font-semibold">
      {{ currentMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ProgressBar from 'primevue/progressbar';

const progress = ref(0);
const intervalId = ref<number | null>(null);

const currentMessage = computed(() => {
  if (progress.value < 25) return 'Subiendo foto...';
  else if (progress.value < 50) return 'Detectando ubicación...';
  else if (progress.value < 75) return 'Ya estamos por terminar...';
  else if (progress.value < 100) return 'Finalizando...';
  else return 'Proceso completado!';
});

onMounted(() => {
  // Aumenta el progreso cada 500ms (ajusta el tiempo e incremento según lo necesites)
  intervalId.value = window.setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(intervalId.value!);
      intervalId.value = null;
    }
  }, 500);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.progress-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>
