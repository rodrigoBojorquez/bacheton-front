<script setup lang="ts">
import DashboardReportsChart from '@/shared/components/admin/DashboardReportsChart.vue';
import DashboardSeverityChart from '@/shared/components/admin/DashboardSeverityChart.vue';
import DashboardTopUsersChart from '@/shared/components/admin/DashboardTopUsersChart.vue';
import DashboardTopUsersTable from '@/shared/components/admin/DashboardTopUsersTable.vue';
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 gap">


  <h3 class="text-2xl font-bold mb-6">
    DASHBOARD
  </h3>

  <!-- GRID -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Primera fila -->
    <DashboardSeverityChart />
    <DashboardReportsChart />

    <!-- Segunda fila -->
    <DashboardTopUsersChart />
    <DashboardTopUsersTable />
  </div>
</div>
</template>
