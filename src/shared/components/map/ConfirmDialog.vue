<script setup lang="ts">
defineProps<{
    visible: boolean,
    title: string,
    message: string
}>();

const emit = defineEmits(['update:visible', 'confirm']);

// Cerrar diálogo
function closeDialog() {
    emit('update:visible', false);
}

// Confirmar acción
function confirmAction() {
    emit('confirm');
}
</script>

<template>
    <Dialog :visible="visible" :header="title" :modal="true" :style="{ width: '450px' }" @update:visible="closeDialog">
        <div class="flex items-center gap-3">
            <i class="pi pi-exclamation-triangle text-yellow-500 text-3xl"></i>
            <p>{{ message }}</p>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-outlined" @click="closeDialog" />
                <Button label="Confirmar" icon="pi pi-check" class="p-button-danger" @click="confirmAction" />
            </div>
        </template>
    </Dialog>
</template>