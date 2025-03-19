<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import Tag from 'primevue/tag';
import DatePicker from 'primevue/datepicker';
import { listLogs } from '@/core/services/logsService.ts';
import type { LogEntry as APILogEntry } from '@/core/types/logs.ts';
import { format } from 'date-fns';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toolbar from 'primevue/toolbar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

interface LogEntry {
  id: string;
  timestamp: Date;
  formattedTimestamp: string;
  method: string;
  endpoint: string;
  statusCode: number | string;
  duration: string;
  type: 'Information' | 'Warning' | 'Error';
  userId: string;
}

const logs = ref<LogEntry[]>([]);
const selectedDate = ref<Date | null>(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  timestamp: { value: null as Date | null, matchMode: FilterMatchMode.DATE_IS }
});

const logTypes = [
  { label: 'Todos', value: null },
  { label: 'Information', value: 'Information' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Error', value: 'Error' }
];

// Asignar colores al Type
const getSeverity = (type: string) => {
  switch (type) {
    case 'Information': return 'info';
    case 'Warning': return 'warn';
    case 'Error': return 'danger';
    default: return undefined;
  }
};

// NUEVO: Asignar iconos al Type
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Information': return 'pi pi-info-circle';
    case 'Warning': return 'pi pi-exclamation-triangle';
    case 'Error': return 'pi pi-times';
    default: return '';
  }
};

// Asignar colores a los métodos
const getMethodSeverity = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'success';
    case 'POST': return 'success';
    case 'PUT': return 'warn';
    case 'DELETE': return 'danger';
    default: return 'secondary';
  }
};

onMounted(async () => {
  try {
    const response = await listLogs();
    logs.value = response.map((log: APILogEntry) => {
      const logDate = new Date(log.timestamp);
      return {
        id: log.id,
        timestamp: logDate,
        formattedTimestamp: format(logDate, 'dd MMM yyyy HH:mm:ss'),
        method: log.method ?? 'N/A',
        endpoint: log.endpoint ?? 'N/A',
        statusCode: log.status ?? 'N/A',
        duration: log.duration ? `${parseFloat(log.duration).toFixed(2)}ms` : 'N/A',
        type: log.level as 'Information' | 'Warning' | 'Error',
        userId: log.userId ?? 'Anonymous'
      };
    });
  } catch (error) {
    console.error('Error al cargar logs:', error);
  }
});

// Watch para sincronizar filtro de fecha
watch(selectedDate, (newDate) => {
  filters.value.timestamp.value = newDate;
});
</script>

<template>
  <div class="max-w-7xl mx-auto p-4">

    <DataTable
      :value="logs"
      dataKey="id"
      :filters="filters"
      filterDisplay="menu"
      class="shadow"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 25, 50, 100]"
    >
      <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <template #start>
          <h4 class="m-0 text-lg font-bold">Gestión de Logs</h4>
        </template>

        <template #end>
          <div class="flex items-center gap-4">
            <Select
              v-model="filters.type.value"
              :options="logTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Filtrar por Tipo"
              class="w-48"
            />
            <DatePicker
              v-model="selectedDate"
              showIcon
              showTime
              hourFormat="24"
              dateFormat="dd M yy"
              placeholder="Filtrar por Fecha"
              class="w-48"
            />
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search text-gray-500" />
              </InputIcon>
              <InputText v-model="filters.global.value" placeholder="Buscar logs" class="border border-gray-300 rounded-md p-2" />
            </IconField>
          </div>
        </template>
      </Toolbar>

      <Column field="formattedTimestamp" header="Fecha" sortable class="py-2 px-4" />

      <!-- Columna Método -->
      <Column field="method" header="Método" sortable class="py-2 px-4">
        <template #body="slotProps">
          <Tag :value="slotProps.data.method" :severity="getMethodSeverity(slotProps.data.method)" />
        </template>
      </Column>

      <Column field="endpoint" header="Endpoint" sortable class="py-2 px-4" />
      <Column field="statusCode" header="Status" sortable class="py-2 px-4" />
      <Column field="duration" header="Duración" sortable class="py-2 px-4" />

      <!-- Columna Tipo con icono -->
      <Column field="type" header="Tipo" class="py-2 px-4">
        <template #body="slotProps">
          <div class="flex">
            <Tag
              :value="slotProps.data.type"
              :severity="getSeverity(slotProps.data.type)"
              :icon="getTypeIcon(slotProps.data.type)"
            />
          </div>
        </template>
      </Column>

      <Column field="userId" header="Usuario" class="py-2 px-4">
        <template #body="slotProps">
          <span v-if="slotProps.data.userId !== 'Anonymous'">
            {{ slotProps.data.userId }}
          </span>
          <span v-else class="text-gray-500 ">No hay usuario</span>
        </template>
      </Column>

      <!-- SIN RESULTADOS -->
      <template #empty>
        <div class="text-secondary text-center p-4">SIN RESULTADOS</div>
      </template>

    </DataTable>
  </div>
</template>
