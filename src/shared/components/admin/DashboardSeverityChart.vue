<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { getReportsSeverity } from '@/core/services/dashboardService';
import type { ReportsSeverityResponse } from '@/core/types/dashboard';
import Chart from 'primevue/chart';

const layoutStore = useLayoutStore();
const { layoutConfig } = layoutStore;

// Chart Data & Options
const chartData = ref();
const chartOptions = ref();

// Datos desde backend
const severityData = ref<ReportsSeverityResponse | null>(null);

// Flag de "no hay datos"
const noData = ref(false);

// Función para cargar los datos
async function loadSeverityData() {
  try {
    severityData.value = await getReportsSeverity();

    const total = (severityData.value?.highSeverity || 0) +
                  (severityData.value?.mediumSeverity || 0) +
                  (severityData.value?.lowSeverity || 0);

    if (total === 0) {
      noData.value = true;
    } else {
      noData.value = false;
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }

  } catch (error) {
    console.error('Error al cargar severidad:', error);
    noData.value = true;
  }
}

// Configurar datos del gráfico
function setChartData() {
  return {
    labels: ['Alta Severidad', 'Media Severidad', 'Baja Severidad'],
    datasets: [
      {
        type: 'bar',
        label: 'Alta Severidad',
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // rojo con transparencia
        data: [severityData.value?.highSeverity || 0, 0, 0],
        barThickness: 40
      },
      {
        type: 'bar',
        label: 'Media Severidad',
        backgroundColor: 'rgba(245, 158, 11, 0.6)', // amarillo con transparencia
        data: [0, severityData.value?.mediumSeverity || 0, 0],
        barThickness: 40
      },
      {
        type: 'bar',
        label: 'Baja Severidad',
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // azul con transparencia
        data: [0, 0, severityData.value?.lowSeverity || 0],
        barThickness: 40
      }
    ]
  };
}

// Opciones de la gráfica
function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const borderColor = documentStyle.getPropertyValue('--surface-border');
  const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textMutedColor
        }
      }
    },
    scales: {
      x: {
        ticks: { color: textMutedColor },
        grid: { color: 'transparent', borderColor: 'transparent' }
      },
      y: {
        ticks: { color: textMutedColor },
        grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
      }
    }
  };
}

// Re-renderiza cuando cambian colores o tema
watch(() => layoutConfig, () => {
  if (severityData.value && !noData.value) {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }
}, { deep: true });

// Inicializa
onMounted(() => {
  loadSeverityData();
});
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Reportes por Severidad</div>

    <!-- Si no hay datos -->
    <div v-if="noData" class="text-center text-gray-500 py-10">
      No hay reportes disponibles.
    </div>

    <!-- Si hay datos -->
    <Chart
      v-else
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="h-80"
    />
  </div>
</template>
