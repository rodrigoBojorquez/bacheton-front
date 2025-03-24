<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ChartData, ChartOptions } from 'chart.js';
import Chart from 'primevue/chart';
import { getTopUsers } from '@/core/services/dashboardService';
import type { TopUser } from '@/core/types/dashboard';

const chartData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [
    {
      label: 'Número de Reportes',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
});

const chartOptions = ref<ChartOptions<'bar'>>({
  indexAxis: 'y', // Horizontal Bar
  responsive: true,
  scales: {
    x: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
});

onMounted(async () => {
  const topUsers: TopUser[] = await getTopUsers();

  // 🔥 Filtrar solo usuarios con reportes >= 1
  const filteredUsers = topUsers.filter((user) => user.reportsCount >= 1);

  chartData.value.labels = filteredUsers.map((user) => user.name);
  chartData.value.datasets[0].data = filteredUsers.map((user) => user.reportsCount);
});
</script>

<template>
  <div class="card">
    <h4 class="text-lg font-semibold mb-4">Top Usuarios por Número de Reportes</h4>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-96" />
  </div>
</template>
