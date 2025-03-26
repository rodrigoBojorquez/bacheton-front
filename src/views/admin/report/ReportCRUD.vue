<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { listMonitoringReports, useUpdateReport, useDeleteReport } from '@/core/services/reportMapService';
import type { Report, ReportStatus, ReportSeverity, UpdateReportRequest } from '@/core/types/reportMap';
import { FilterMatchMode } from '@primevue/core/api';

const toast = useToast();
const reports = ref<Report[]>([]);
const selectedReports = ref<Report[]>([]);
const reportDialog = ref(false);
const deleteReportDialog = ref(false);
const submitted = ref(false);
const loading = ref(false);

// Formulario para edición
const reportForm = ref<UpdateReportRequest>({
    id: '',
    comment: '',
    severity: 'Low',
    status: 'Pending'
});

// Filtros para la tabla - Fix: Initialize with proper structure
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    severity: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Opciones para filtros y selects
const statusOptions = ref([
    { label: 'Pendiente', value: 'Pending' },
    { label: 'Progreso', value: 'InProgress' },
    { label: 'Resuelto', value: 'Resolved' }
]);

const severityOptions = ref([
    { label: 'Baja', value: 'Low' },
    { label: 'Media', value: 'Medium' },
    { label: 'Alta', value: 'High' }
]);

// Fechas para filtrado
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

onMounted(async () => {
    await loadReports();
});

// Fix: Safe access to nested properties in the watch function
watch([
    () => filters.value.status?.value,
    () => filters.value.severity?.value,
    startDate,
    endDate
], async () => {
    await loadReports();
});

async function loadReports() {
    loading.value = true;
    try {
        const response = await listMonitoringReports({
            reportStatus: filters.value.status?.value as ReportStatus | null,
            reportSeverity: filters.value.severity?.value as ReportSeverity | null,
            startDate: startDate.value ? startDate.value.toISOString() : null,
            endDate: endDate.value ? endDate.value.toISOString() : null
        });
        reports.value = response.items;
    } catch (error) {
        console.error('Error loading reports:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error cargando reportes' });
    } finally {
        loading.value = false;
    }
}

function editReport(report: Report) {
    reportForm.value = {
        id: report.id,
        comment: report.comment,
        severity: report.severity,
        status: report.status
    };
    submitted.value = false;
    reportDialog.value = true;
}

const updateReportMutation = useUpdateReport();
const deleteReportMutation = useDeleteReport();

async function saveReport() {
    submitted.value = true;

    if (!reportForm.value.comment?.trim()) {
        return;
    }

    try {
        await updateReportMutation.mutateAsync(reportForm.value);
        await loadReports();
        reportDialog.value = false;
    } catch (error) {
        console.error('Error updating report:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el reporte' });
    }
}

function confirmDeleteReport(report: Report) {
    reportForm.value = {
        id: report.id,
        comment: report.comment,
        severity: report.severity,
        status: report.status
    };
    deleteReportDialog.value = true;
}

async function deleteReport() {
    try {
        await deleteReportMutation.mutateAsync(reportForm.value.id);
        reports.value = reports.value.filter(r => r.id !== reportForm.value.id);
        deleteReportDialog.value = false;
    } catch (error) {
        console.error('Error deleting report:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el reporte' });
    }
}

function getSeverityClass(severity: ReportSeverity) {
    switch (severity) {
        case 'High': return 'bg-red-100 text-red-800 font-bold';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 font-bold';
        case 'Low': return 'bg-blue-100 text-blue-800 font-bold';
        default: return '';
    }
}

function getStatusClass(status: ReportStatus) {
    switch (status) {
        case 'Pending': return 'bg-red-100 text-red-800';
        case 'InProgress': return 'bg-yellow-100 text-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        default: return '';
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function clearFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        severity: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
    startDate.value = null;
    endDate.value = null;
}
</script>

<template>
    <div class="max-w-7xl mx-auto p-4">
        <Toolbar class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <template #start>
                <h4 class="m-0 text-lg font-bold">Gestión de Reportes</h4>
            </template>

            <template #end>
                <div class="flex flex-col md:flex-row items-center gap-4">
                    <Select v-model="filters.status.value" :options="statusOptions" optionLabel="label"
                        optionValue="value" placeholder="Estado" class="w-40" />
                    <Select v-model="filters.severity.value" :options="severityOptions" optionLabel="label"
                        optionValue="value" placeholder="Severidad" class="w-40" />
                    <div class="flex flex-col sm:flex-row gap-2">
                        <Calendar v-model="startDate" showIcon dateFormat="dd/mm/yy" placeholder="Fecha inicial"
                            class="w-40" />
                        <Calendar v-model="endDate" showIcon dateFormat="dd/mm/yy" placeholder="Fecha final"
                            class="w-40" />
                    </div>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search text-gray-500" />
                        </InputIcon>
                        <InputText v-model="filters.global.value" placeholder="Buscar reportes"
                            class="border border-gray-300 rounded-md p-2" />
                    </IconField>
                    <Button icon="pi pi-filter-slash" text rounded outlined title="Limpiar filtros" class="p-2"
                        @click="clearFilters" />
                </div>
            </template>
        </Toolbar>

        <DataTable :value="reports" v-model:selection="selectedReports" selectionMode="multiple" dataKey="id"
            :paginator="true" :rows="10" :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25, 50]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} reportes" filterDisplay="menu"
            :filters="filters" class="shadow">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="id" header="ID" sortable class="py-2 px-4" />
            <Column field="location" header="Ubicación" sortable class="py-2 px-4" />
            <Column field="comment" header="Comentario" class="py-2 px-4">
                <template #body="slotProps">
                    <span :title="slotProps.data.comment">
                        {{ slotProps.data.comment.length > 50 ? slotProps.data.comment.substring(0, 50) + '...' :
                            slotProps.data.comment }}
                    </span>
                </template>
            </Column>
            <Column field="severity" header="Severidad" sortable class="py-2 px-4">
                <template #body="slotProps">
                    <span class="px-2 py-1 rounded-full text-xs" :class="getSeverityClass(slotProps.data.severity)">
                        {{ slotProps.data.severity === 'High' ? 'Alta' :
                            slotProps.data.severity === 'Medium' ? 'Media' : 'Baja' }}
                    </span>
                </template>
            </Column>
            <Column field="status" header="Estado" sortable class="py-2 px-4">
                <template #body="slotProps">
                    <span class="px-2 py-1 rounded-full text-xs" :class="getStatusClass(slotProps.data.status)">
                        {{ slotProps.data.status === 'Pending' ? 'Pendiente' :
                            slotProps.data.status === 'InProgress' ? 'Progreso' : 'Resuelto' }}
                    </span>
                </template>
            </Column>
            <Column field="createDate" header="Fecha Creación" sortable class="py-2 px-4">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.createDate) }}
                </template>
            </Column>
            <Column header="Acciones" class="py-2 px-4">
                <template #body="slotProps">
                    <div class="flex space-x-2">
                        <Button icon="pi pi-pencil"
                            class="p-button-rounded p-button-outlined bg-green-500 hover:bg-green-600 text-white"
                            @click="editReport(slotProps.data)" />
                        <Button icon="pi pi-trash" severity="danger"
                            class="p-button-rounded p-button-outlined bg-red-500 hover:bg-red-600 text-white"
                            @click="confirmDeleteReport(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Dialog para Editar Reporte -->
        <Dialog header="Editar Reporte" v-model:visible="reportDialog" modal class="w-96">
            <div class="space-y-4">
                <div>
                    <label for="comment" class="block text-sm font-medium">
                        Comentario <span class="text-red-500">*</span>
                    </label>
                    <Textarea id="comment" v-model="reportForm.comment" rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    <small v-if="submitted && !reportForm.comment?.trim()" class="p-error text-red-500">
                        El comentario es obligatorio.
                    </small>
                </div>
                <div>
                    <label for="severity" class="block text-sm font-medium">
                        Severidad <span class="text-red-500">*</span>
                    </label>
                    <Select id="severity" v-model="reportForm.severity" :options="severityOptions" optionLabel="label"
                        optionValue="value" placeholder="Selecciona la severidad"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label for="status" class="block text-sm font-medium">
                        Estado <span class="text-red-500">*</span>
                    </label>
                    <Select id="status" v-model="reportForm.status" :options="statusOptions" optionLabel="label"
                        optionValue="value" placeholder="Selecciona el estado"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end space-x-2 mt-4">
                    <Button label="Cancelar" icon="pi pi-times"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" text
                        @click="reportDialog = false" />
                    <Button label="Guardar" icon="pi pi-check"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" @click="saveReport" />
                </div>
            </template>
        </Dialog>

        <!-- Dialog para Confirmar Eliminación -->
        <Dialog header="Confirmar" v-model:visible="deleteReportDialog" modal class="w-120">
            <div class="flex items-center space-x-3">
                <i class="pi pi-exclamation-triangle !text-3xl text-orange-400"></i>
                <span class="text-gray-700">
                    ¿Seguro que deseas eliminar este reporte?
                </span>
            </div>
            <template #footer>
                <div class="flex justify-end space-x-2 mt-4">
                    <Button label="Cancelar" icon="pi pi-times"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" text
                        @click="deleteReportDialog = false" />
                    <Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteReport" />
                </div>
            </template>
        </Dialog>
    </div>
</template>