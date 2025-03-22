<script setup lang="ts">
import type { Report } from '@/core/types/reportMap';

const props = defineProps<{
    visible: boolean,
    report: Report | null
}>();

const emit = defineEmits(['update:visible', 'edit', 'delete']);

// Formatear fecha
function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
}

const getSeverity = (severity: string) => {
    switch (severity) {
        case 'High': return 'danger'; // Rojo
        case 'Medium': return 'warn'; // Naranja
        case 'Low': return 'info'; // Axul
        default: return 'secondary'; // Gris
    }
};

const getSeverityText = (severity: string): string => {
    const texts: Record<string, string> = {
        High: 'Alta',
        Medium: 'Media',
        Low: 'Baja'
    };
    return texts[severity] || 'Desconocida';
};

const getStatusSeverity = (status: string) => {
    switch (status) {
        case 'Pending': return 'danger'; // Rojo
        case 'InProgress': return 'warn'; // Naranja
        case 'Resolved': return 'success'; // Verde
        default: return 'secondary'; // Gris
    }
};

const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
        Pending: 'Pendiente',
        InProgress: 'En progreso',
        Resolved: 'Resuelto'
    };
    return texts[status] || 'Desconocido';
};

// Obtener URL de imagen
function getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    const baseUrl = import.meta.env.VITE_IMAGES_URL;
    return `${baseUrl}${imageUrl}`;
}

// Ocultar imagen si hay un error de carga
function handleImageError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
}

// Cerrar diálogo
function closeDialog() {
    emit('update:visible', false);
}

// Editar reporte
function editReport() {
    if (props.report) {
        emit('edit', props.report);
    }
}

// Eliminar reporte
function deleteReport() {
    if (props.report) {
        emit('delete', props.report);
    }
}
</script>

<template>
    <Dialog :visible="visible" :header="`Detalles: ${report?.location || ''}`" :modal="true"
        :style="{ width: '80vw', maxWidth: '800px' }" :dismissableMask="true" @update:visible="closeDialog">
        <div v-if="report" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <h5 class="font-medium text-gray-600 mb-1">Comentario</h5>
                    <p class="mb-4">{{ report.comment }}</p>

                    <h5 class="font-medium text-gray-600 mb-1">Ubicación</h5>
                    <p class="mb-4">{{ report.location }}</p>

                    <h5 class="font-medium text-gray-600 mb-1">Coordenadas</h5>
                    <p class="mb-4">{{ report.latitude }}, {{ report.longitude }}</p>

                    <h5 class="font-medium text-gray-600 mb-1">Fecha de creación</h5>
                    <p class="mb-4">{{ formatDate(report.createDate) }}</p>
                </div>

                <div>
                    <h5 class="font-medium text-gray-600 mb-1">Severidad</h5>
                    <Tag :severity="getSeverity(report.severity)" :value="getSeverityText(report.severity)" />

                    <h5 class="font-medium text-gray-600 mt-4 mb-1">Estado</h5>
                    <Tag :severity="getStatusSeverity(report.status)" :value="getStatusText(report.status)" />
                    
                    <div v-if="report.imageUrl" class="mt-4">
                        <h5 class="font-medium text-gray-600 mb-1">Imagen</h5>
                        <img :src="getImageUrl(report.imageUrl)" alt="Imagen del reporte"
                            class="max-w-full h-auto rounded shadow" @error="handleImageError">
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cerrar" icon="pi pi-times" class="p-button-outlined" @click="closeDialog" />
                <Button label="Editar" icon="pi pi-pencil" class="p-button-warning" @click="editReport" />
                <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="deleteReport" />
            </div>
        </template>
    </Dialog>
</template>
