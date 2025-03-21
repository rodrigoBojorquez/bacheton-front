<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import type { UpdateReportRequest, ReportSeverity, ReportStatus } from '@/core/types/reportMap';

const props = defineProps<{
    visible: boolean,
    report: UpdateReportRequest
}>();

const emit = defineEmits(['update:visible', 'update:report', 'save']);

const { visible, report } = toRefs(props);

// Form local state
const localReport = ref<UpdateReportRequest>({
    id: '',
    comment: '',
    severity: 'Medium',
    status: 'Pending'
});

// Opciones para los dropdowns
const severityOptions = [
    { label: 'Baja', value: 'Low' },
    { label: 'Media', value: 'Medium' },
    { label: 'Alta', value: 'High' }
];

const statusOptions = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En progreso', value: 'InProgress' },
    { label: 'Resuelto', value: 'Resolved' }
];

// Sincronizar con props cuando cambien
watch(report, (newReport) => {
    localReport.value = { ...newReport };
}, { deep: true, immediate: true });

// Actualizar el reporte en el parent
function updateReport(field: keyof UpdateReportRequest, value: any) {
    localReport.value = { ...localReport.value, [field]: value };
    emit('update:report', localReport.value);
}

// Cerrar diálogo
function closeDialog() {
    emit('update:visible', false);
}

// Guardar reporte
function saveReport() {
    emit('save');
}
</script>

<template>
    <Dialog :visible="visible" header="Editar Reporte" :modal="true" :style="{ width: '500px' }" :dismissableMask="true"
        @update:visible="closeDialog">
        <div class="p-fluid">
            <div class="field mb-4">
                <label for="comment" class="font-medium mb-2 block">Comentario</label>
                <Textarea id="comment" v-model="localReport.comment" rows="5" class="w-full"
                    @input="updateReport('comment', localReport.comment)" />
            </div>

            <div class="field mb-4">
                <label for="severity" class="font-medium mb-2 block">Severidad</label>
                <Dropdown id="severity" v-model="localReport.severity" :options="severityOptions" optionLabel="label"
                    optionValue="value" class="w-full" @change="updateReport('severity', localReport.severity)" />
            </div>

            <div class="field mb-4">
                <label for="status" class="font-medium mb-2 block">Estado</label>
                <Dropdown id="status" v-model="localReport.status" :options="statusOptions" optionLabel="label"
                    optionValue="value" class="w-full" @change="updateReport('status', localReport.status)" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-outlined" @click="closeDialog" />
                <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="saveReport" />
            </div>
        </template>
    </Dialog>
</template>