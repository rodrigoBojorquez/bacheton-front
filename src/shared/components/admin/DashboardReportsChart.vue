<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import { getReportsSummary } from '@/core/services/dashboardService';
import type { ReportsSummaryResponse } from '@/core/types/dashboard';
import Chart from 'primevue/chart';

// Layout Store para detectar tema y colores dinámicos
const layoutStore = useLayoutStore();
const { layoutConfig } = layoutStore;

const chartData = ref();
const chartOptions = ref();

// Datos desde backend
const summaryData = ref<ReportsSummaryResponse | null>(null);

// Cargar datos
async function loadSummaryData() {
  try {
    summaryData.value = await getReportsSummary();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  } catch (error) {
    console.error('Error al cargar resumen:', error);
  }
}

// Configuración del gráfico
function setChartData() {

  return {
    labels: ['Pendientes', 'En progreso', 'Resueltos'],
    datasets: [
      {
        data: [
          summaryData.value?.pendingReports || 0,
          summaryData.value?.inProgressReports || 0,
          summaryData.value?.resolvedReports || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',  // rojo con 60%
          'rgba(251, 191, 36, 0.6)', // amarillo con 60%
          'rgba(34, 197, 94, 0.6)'   // verde con 60%
        ],
        hoverBackgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
}

// Opciones del gráfico
function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    cutout: '40%',
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    }
  };
}

// Detecta cambio de tema
watch(() => layoutConfig, () => {
  if (summaryData.value) {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }
}, { deep: true });

// Inicializa
onMounted(() => {
  loadSummaryData();
});
</script>

<template>
  <div class="card flex flex-col justify-center items-center">
    <h4 class="text-lg font-semibold mb-4">Resumen de Reportes</h4>
    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-80 flex justify-center" />
  </div>
</template>
