<template>
  <div class="card">
    <h4 class="text-lg font-semibold mb-4">Lista de Usuarios con más Reportes</h4>

    <DataTable
      :value="topUsers"
      :filters="filters"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 25]"
      filterDisplay="menu"
      dataKey="id"
      :globalFilterFields="['name', 'email']"
      class="shadow"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search text-gray-500" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar usuarios" class="border border-gray-300 rounded-md p-2" />
          </IconField>
        </div>
      </template>

      <Column field="name" header="Nombre" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="reportsCount" header="Número de Reportes" sortable />

      <template #empty> <div class="text-center py-8 text-gray-500">No se encontraron usuarios.</div> </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTopUsers } from '@/core/services/dashboardService';
import type { TopUser } from '@/core/types/dashboard';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';

const topUsers = ref<TopUser[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// ✅ Aquí aplicamos el filtro
async function loadTopUsers() {
  const response = await getTopUsers();
  topUsers.value = response.filter(user => user.reportsCount >= 1);
}

onMounted(() => {
  loadTopUsers();
});
</script>
