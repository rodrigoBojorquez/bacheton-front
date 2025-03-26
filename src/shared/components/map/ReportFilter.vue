<script setup lang="ts">
import { ref, defineProps, defineEmits, toRefs, watch } from 'vue';
import type { MonitoringReportsRequest } from '@/core/types/reportMap';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import { format } from 'date-fns';

const props = defineProps<{
    modelValue: MonitoringReportsRequest
}>();

const emit = defineEmits(['update:modelValue', 'search']);
const { modelValue } = toRefs(props);

// Opciones para los filtros
const severityOptions = [
    { label: 'Todos', value: null },
    { label: 'Baja', value: 'Low' },
    { label: 'Media', value: 'Medium' },
    { label: 'Alta', value: 'High' }
];

const statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En progreso', value: 'InProgress' },
    { label: 'Resuelto', value: 'Resolved' }
];

// Actualizar filtro
function updateFilter(key: keyof MonitoringReportsRequest, value: any) {
    const updatedFilter = { 
        ...modelValue.value, 
        [key]: value,
        page: 1  // Reset to first page when filtering
    };
    emit('update:modelValue', updatedFilter);
}

// Buscar reportes
function handleSearch() {
    emit('search');
}

// Limpiar todos los filtros
function clearAllFilters() {
    const clearedFilters: MonitoringReportsRequest = {
        page: 1,
        pageSize: modelValue.value.pageSize,
        reportStatus: null,
        reportSeverity: null,
        startDate: null,
        endDate: null,
        latitude: modelValue.value.latitude,
        longitude: modelValue.value.longitude,
        radiusKm: modelValue.value.radiusKm
    };

    emit('update:modelValue', clearedFilters);
    handleSearch();
}

// Observar cambios en los filtros
watch(
    () => [
        modelValue.value.reportStatus,
        modelValue.value.reportSeverity,
        modelValue.value.startDate,
        modelValue.value.endDate
    ],
    () => {
        handleSearch();
    },
    { deep: true }
);

// Formato para la fecha
function formatDate(date: Date | null) {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy');
}
</script>

<template>
    <Toolbar class="mb-4">
        <template #start>
            <h2 class="m-0 text-xl font-bold">Monitoreo de Reportes</h2>
        </template>
        
        <template #end>
            <div class="flex flex-col md:flex-row items-center gap-4">
                <Dropdown 
                    :modelValue="modelValue.reportStatus"
                    @update:modelValue="(value) => updateFilter('reportStatus', value)"
                    :options="statusOptions"
                    optionLabel="label" 
                    optionValue="value" 
                    placeholder="Estado" 
                    class="w-48" 
                />
                
                <Dropdown 
                    :modelValue="modelValue.reportSeverity"
                    @update:modelValue="(value) => updateFilter('reportSeverity', value)"
                    :options="severityOptions"
                    optionLabel="label" 
                    optionValue="value" 
                    placeholder="Severidad" 
                    class="w-48" 
                />
                
                <DatePicker 
                    :modelValue="modelValue.startDate"
                    @update:modelValue="(value) => updateFilter('startDate', value)"
                    showIcon 
                    dateFormat="dd/mm/yy"
                    placeholder="Fecha desde" 
                    class="w-48" 
                />
                
                <Button 
                    label="Limpiar" 
                    icon="pi pi-filter-slash" 
                    class="p-button-secondary" 
                    @click="clearAllFilters" 
                />
            </div>
        </template>
    </Toolbar>
</template>