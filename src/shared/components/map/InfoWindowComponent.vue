<template>
    <div class="min-w-[200px] p-2 dark:text-white">
        <img v-if="report.imageUrl" :src="`${baseUrl}${report.imageUrl}`" alt="Reporte"
            class="w-full max-h-[150px] object-cover mb-2" @error="hideImage" />
        <p class="text-base my-1 dark:text-gray-800">
            <strong>Localidad:</strong> {{ (report.location) }}
        </p>
        <p class="text-base my-1 dark:text-gray-800">
            <strong>Fecha:</strong> {{ formatDate(report.createDate) }}
        </p>
        <p class="text-base my-1">
            <span class="dark:text-gray-800"><strong>Severidad:</strong></span>
            <span :class="getSeverityClass(report.severity)" class="px-2 py-1 rounded text-base ml-1">
                {{ getSeverityText(report.severity) }}
            </span>
        </p>
        <p class="text-base my-1">
            <span class="text-gray-800"><strong>Estado:</strong></span>
            <span :class="getStatusClass(report.status)" class="px-2 py-1 rounded text-base ml-1">
                {{ getStatusText(report.status) }}
            </span>
        </p>
        <Button label="Ver detalles" icon="pi pi-info-circle" @click="$emit('viewDetails', report.id)" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import type { Report, ReportStatus, ReportSeverity } from '@/core/types/reportMap';

defineProps<{
    report: Report;
    baseUrl: string;
}>();

defineEmits(['viewDetails']);

const showImage = ref(true);

// Función para manejar errores de imagen
const hideImage = () => {
    showImage.value = false;
};

// Formateador de fecha
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

// Funciones de utilidad
function getSeverityText(severity: ReportSeverity): string {
    const texts: Record<ReportSeverity, string> = {
        High: 'Alta',
        Medium: 'Media',
        Low: 'Baja'
    };
    return texts[severity] || 'Desconocida';
}

function getSeverityClass(severity: ReportSeverity): string {
    const classes: Record<ReportSeverity, string> = {
        High: 'bg-red-100 text-red-800 ',
        Medium: 'bg-yellow-100 text-yellow-800 ',
        Low: 'bg-blue-100 text-blue-800 '
    };
    return classes[severity] || 'bg-gray-100 dark:bg-gray-700';
}

function getStatusText(status: ReportStatus): string {
    const texts: Record<ReportStatus, string> = {
        Pending: 'Pendiente',
        InProgress: 'En progreso',
        Resolved: 'Resuelto'
    };
    return texts[status] || 'Desconocido';
}

function getStatusClass(status: ReportStatus): string {
    const classes: Record<ReportStatus, string> = {
        Pending: 'bg-red-100 text-red-800 ',
        InProgress: 'bg-yellow-100 text-yellow-800 ',
        Resolved: 'bg-green-100 text-green-800 '
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-700';
}
</script>